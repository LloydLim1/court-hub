import {
  Body,
  ConflictException,
  Controller,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { GRACE_PERIOD_MINUTES, SAMPLE_BOOKINGS, SPORT_SPECS, getCourtBufferMinutes, type SportType } from "@courthub/domain";
import { IsArray, IsDateString, IsIn, IsOptional, IsString } from "class-validator";

class CreateBookingDto {
  @ApiProperty({ enum: ["basketball", "volleyball", "pickleball", "badminton"] })
  @IsIn(["basketball", "volleyball", "pickleball", "badminton"])
  sport!: SportType;

  @ApiProperty()
  @IsString()
  courtId!: string;

  @ApiProperty()
  @IsString()
  customerId!: string;

  @ApiProperty()
  @IsString()
  customerName!: string;

  @ApiProperty()
  @IsString()
  staffId!: string;

  @ApiProperty()
  @IsDateString()
  startTime!: string;

  @ApiProperty()
  @IsDateString()
  endTime!: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  equipmentCategoryIds?: string[];
}

class CheckInDto {
  @ApiProperty()
  @IsString()
  bookingId!: string;
}

class SweepNoShowDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  referenceTime?: string;
}

type MutableBooking = (typeof SAMPLE_BOOKINGS)[number] & {
  releasedAt?: string;
  lateArrivalEligible?: boolean;
};

@Injectable()
class BookingService {
  private readonly bookings: MutableBooking[] = [...SAMPLE_BOOKINGS];
  private readonly customerNoShowCounts = new Map<string, number>([
    ["CUS-001", 2],
    ["CUS-002", 0],
  ]);
  private readonly courtScopes: Record<string, string[]> = {
    "COURT-BASKETBALL": ["COURT-BASKETBALL"],
    "COURT-VOLLEYBALL": ["COURT-VOLLEYBALL"],
    "COURT-PB-HALL": ["COURT-PB-HALL", "COURT-PB-A", "COURT-PB-B", "COURT-PB-C"],
    "COURT-PB-A": ["COURT-PB-HALL", "COURT-PB-A"],
    "COURT-PB-B": ["COURT-PB-HALL", "COURT-PB-B"],
    "COURT-PB-C": ["COURT-PB-HALL", "COURT-PB-C"],
    "COURT-BD-HALL": ["COURT-BD-HALL", "COURT-BD-A", "COURT-BD-B", "COURT-BD-C"],
    "COURT-BD-A": ["COURT-BD-HALL", "COURT-BD-A"],
    "COURT-BD-B": ["COURT-BD-HALL", "COURT-BD-B"],
    "COURT-BD-C": ["COURT-BD-HALL", "COURT-BD-C"],
  };

  availability(startTime: string, endTime: string, courtId: string, sport: SportType) {
    return {
      available: !this.findConflict({ startTime, endTime, courtId, sport } as CreateBookingDto),
      bufferMinutes: getCourtBufferMinutes(sport, sport),
      scopes: this.resolveScopes(courtId),
    };
  }

  create(dto: CreateBookingDto) {
    const conflict = this.findConflict(dto);
    if (conflict) {
      throw new ConflictException({
        message: "Court conflict detected.",
        conflictWith: conflict.id,
        court: conflict.courtName,
      });
    }

    const pricingSnapshot = {
      sport: dto.sport,
      bookedAt: new Date().toISOString(),
      baseRate: SPORT_SPECS[dto.sport].basePrice,
      peakMultiplier: 1,
      weekendMultiplier: 1,
      specialDayMultiplier: 1,
      minimumPrice: SPORT_SPECS[dto.sport].basePrice,
      appliedRules: [],
      subtotal: SPORT_SPECS[dto.sport].basePrice,
      equipmentSubtotal: 0,
      total: SPORT_SPECS[dto.sport].basePrice,
    };

    const booking: MutableBooking = {
      id: `BK-${Date.now()}`,
      customerId: dto.customerId,
      customerName: dto.customerName,
      courtId: dto.courtId,
      courtName: dto.courtId,
      sport: dto.sport,
      staffId: dto.staffId,
      channel: "walk_in",
      status: "pending",
      checkInStatus: "not_arrived",
      noShowStatus: "clear",
      paymentStatus: "pending",
      totalAmount: pricingSnapshot.total,
      pricingSnapshot,
      timeline: {
        startTime: dto.startTime,
        endTime: dto.endTime,
        graceDeadline: this.getGraceDeadline(dto.startTime),
        bufferMinutes: 5,
      },
      lateArrivalEligible: true,
    };

    this.bookings.push(booking);
    return booking;
  }

  checkIn(bookingId: string) {
    const booking = this.bookings.find((item) => item.id === bookingId);
    if (!booking) throw new NotFoundException("Booking not found.");

    booking.status = "checked_in";
    booking.checkInStatus = "checked_in";
    booking.noShowStatus = "clear";
    return booking;
  }

  sweepNoShows(referenceTime = new Date().toISOString()) {
    const reference = new Date(referenceTime);
    const released = this.bookings
      .filter(
        (booking) =>
          booking.status !== "checked_in" &&
          booking.status !== "completed" &&
          booking.status !== "cancelled" &&
          new Date(booking.timeline.graceDeadline) <= reference,
      )
      .map((booking) => {
        booking.status = "no_show";
        booking.noShowStatus = "released";
        booking.releasedAt = reference.toISOString();
        const nextCount = (this.customerNoShowCounts.get(booking.customerId) ?? 0) + 1;
        this.customerNoShowCounts.set(booking.customerId, nextCount);
        return {
          bookingId: booking.id,
          courtId: booking.courtId,
          status: "available",
          customerNoShowCount: nextCount,
          highRisk: nextCount >= 3,
        };
      });

    return {
      evaluatedAt: reference.toISOString(),
      released,
    };
  }

  listToday() {
    return this.bookings;
  }

  transitions() {
    return this.bookings.map((booking) => ({
      bookingId: booking.id,
      checkpoints: [
        { code: "T-15", at: this.addMinutes(booking.timeline.startTime, -15) },
        { code: "T-5", at: this.addMinutes(booking.timeline.startTime, -5) },
        { code: "T+10", at: this.addMinutes(booking.timeline.startTime, 10) },
      ],
    }));
  }

  private findConflict(dto: CreateBookingDto) {
    const requestScopes = this.resolveScopes(dto.courtId);
    const requestStart = new Date(dto.startTime).getTime();
    const requestEnd = new Date(dto.endTime).getTime();

    return this.bookings.find((booking) => {
      if (["cancelled", "completed", "no_show"].includes(booking.status)) {
        return false;
      }

      const sameScope = this.resolveScopes(booking.courtId).some((scope) => requestScopes.includes(scope));
      if (!sameScope) return false;

      const bufferMinutes = getCourtBufferMinutes(dto.sport, booking.sport);
      const existingStart = new Date(booking.timeline.startTime).getTime() - bufferMinutes * 60_000;
      const existingEnd = new Date(booking.timeline.endTime).getTime() + bufferMinutes * 60_000;

      return requestStart < existingEnd && requestEnd > existingStart;
    });
  }

  private resolveScopes(courtId: string) {
    return this.courtScopes[courtId] ?? [courtId];
  }

  private getGraceDeadline(startTime: string) {
    return this.addMinutes(startTime, GRACE_PERIOD_MINUTES);
  }

  private addMinutes(dateString: string, minutes: number) {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toISOString();
  }
}

@ApiTags("bookings")
@Controller("bookings")
class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get("availability")
  @ApiOperation({ summary: "Check availability with scope-aware conflict detection" })
  availability(
    @Query("startTime") startTime: string,
    @Query("endTime") endTime: string,
    @Query("courtId") courtId: string,
    @Query("sport") sport: SportType,
  ) {
    return this.bookingService.availability(startTime, endTime, courtId, sport);
  }

  @Get("today")
  @ApiOperation({ summary: "List today's bookings" })
  listToday() {
    return this.bookingService.listToday();
  }

  @Get("transitions")
  @ApiOperation({ summary: "List transition checkpoints for active bookings" })
  transitions() {
    return this.bookingService.transitions();
  }

  @Post()
  @ApiOperation({ summary: "Create a booking with zero-conflict validation" })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  @Post("check-in")
  @ApiOperation({ summary: "Mark a booking as checked in" })
  checkIn(@Body() dto: CheckInDto) {
    return this.bookingService.checkIn(dto.bookingId);
  }

  @Post("sweep-no-shows")
  @ApiOperation({ summary: "Mark overdue bookings as no-shows and release courts" })
  sweepNoShows(@Body() dto: SweepNoShowDto) {
    return this.bookingService.sweepNoShows(dto.referenceTime);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific booking" })
  getOne(@Param("id") bookingId: string) {
    const booking = this.bookingService.listToday().find((item) => item.id === bookingId);
    if (!booking) throw new NotFoundException("Booking not found.");
    return booking;
  }
}

@Module({
  controllers: [BookingController],
  providers: [BookingService],
})
export class AppModule {}
