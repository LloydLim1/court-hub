import { Body, Controller, Get, Injectable, Module, Post } from "@nestjs/common";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { SPORT_SPECS, type SportType } from "@courthub/domain";
import { IsBoolean, IsDateString, IsIn, IsNumber, IsString } from "class-validator";

class PricingSimulationDto {
  @ApiProperty({ enum: ["basketball", "volleyball", "pickleball", "badminton"] })
  @IsIn(["basketball", "volleyball", "pickleball", "badminton"])
  sport!: SportType;

  @ApiProperty()
  @IsDateString()
  bookingDate!: string;

  @ApiProperty()
  @IsNumber()
  equipmentSubtotal!: number;
}

class PricingRuleChangeDto {
  @ApiProperty()
  @IsString()
  adminId!: string;

  @ApiProperty({ enum: ["basketball", "volleyball", "pickleball", "badminton"] })
  @IsIn(["basketball", "volleyball", "pickleball", "badminton"])
  sport!: SportType;

  @ApiProperty()
  @IsNumber()
  baseRate!: number;

  @ApiProperty()
  @IsNumber()
  peakMultiplier!: number;

  @ApiProperty()
  @IsNumber()
  weekendMultiplier!: number;

  @ApiProperty()
  @IsNumber()
  minimumPrice!: number;
}

class SpecialDayDto {
  @ApiProperty()
  @IsDateString()
  date!: string;

  @ApiProperty()
  @IsString()
  label!: string;

  @ApiProperty()
  @IsNumber()
  multiplier!: number;

  @ApiProperty()
  @IsBoolean()
  active!: boolean;
}

type PricingRule = {
  sport: SportType;
  baseRate: number;
  peakMultiplier: number;
  weekendMultiplier: number;
  minimumPrice: number;
};

@Injectable()
class PricingService {
  private readonly rules: Record<SportType, PricingRule> = {
    basketball: {
      sport: "basketball",
      baseRate: SPORT_SPECS.basketball.basePrice,
      peakMultiplier: 1.25,
      weekendMultiplier: 1.15,
      minimumPrice: 1200,
    },
    volleyball: {
      sport: "volleyball",
      baseRate: SPORT_SPECS.volleyball.basePrice,
      peakMultiplier: 1.2,
      weekendMultiplier: 1.15,
      minimumPrice: 1200,
    },
    pickleball: {
      sport: "pickleball",
      baseRate: SPORT_SPECS.pickleball.basePrice,
      peakMultiplier: 1.2,
      weekendMultiplier: 1.1,
      minimumPrice: 450,
    },
    badminton: {
      sport: "badminton",
      baseRate: SPORT_SPECS.badminton.basePrice,
      peakMultiplier: 1.15,
      weekendMultiplier: 1.08,
      minimumPrice: 400,
    },
  };

  private readonly specialDays: SpecialDayDto[] = [
    { date: "2026-05-01T00:00:00.000Z", label: "Labor Day", multiplier: 1.3, active: true },
    { date: "2026-06-12T00:00:00.000Z", label: "Independence Day", multiplier: 1.2, active: true },
  ];

  private readonly changeLog: Array<Record<string, unknown>> = [];

  listRules() {
    return Object.values(this.rules);
  }

  listHistory() {
    return this.changeLog;
  }

  listSpecialDays() {
    return this.specialDays;
  }

  simulate(dto: PricingSimulationDto) {
    const rule = this.rules[dto.sport];
    const bookingDate = new Date(dto.bookingDate);
    const isWeekend = [0, 6].includes(bookingDate.getUTCDay());
    const hour = bookingDate.getUTCHours();
    const isPeak = hour >= 9 && hour < 13 ? false : hour >= 17 && hour < 21;
    const specialDay = this.specialDays.find(
      (entry) => entry.active && new Date(entry.date).toDateString() === bookingDate.toDateString(),
    );

    const peakMultiplier = isPeak ? rule.peakMultiplier : 1;
    const weekendMultiplier = isWeekend ? rule.weekendMultiplier : 1;
    const specialDayMultiplier = specialDay?.multiplier ?? 1;

    const subtotal = Math.max(
      Math.round(rule.baseRate * peakMultiplier * weekendMultiplier * specialDayMultiplier),
      rule.minimumPrice,
    );
    const total = subtotal + dto.equipmentSubtotal;

    return {
      sport: dto.sport,
      bookedAt: new Date().toISOString(),
      baseRate: rule.baseRate,
      peakMultiplier,
      weekendMultiplier,
      specialDayMultiplier,
      minimumPrice: rule.minimumPrice,
      appliedRules: [
        isPeak ? "peak-hour" : null,
        isWeekend ? "weekend" : null,
        specialDay ? specialDay.label : null,
      ].filter(Boolean),
      subtotal,
      equipmentSubtotal: dto.equipmentSubtotal,
      total,
    };
  }

  updateRule(dto: PricingRuleChangeDto) {
    const previous = this.rules[dto.sport];
    this.rules[dto.sport] = {
      sport: dto.sport,
      baseRate: dto.baseRate,
      peakMultiplier: dto.peakMultiplier,
      weekendMultiplier: dto.weekendMultiplier,
      minimumPrice: dto.minimumPrice,
    };
    this.changeLog.unshift({
      adminId: dto.adminId,
      sport: dto.sport,
      changedAt: new Date().toISOString(),
      before: previous,
      after: this.rules[dto.sport],
    });
    return this.rules[dto.sport];
  }

  upsertSpecialDay(dto: SpecialDayDto) {
    const index = this.specialDays.findIndex((entry) => entry.date === dto.date);
    if (index >= 0) {
      this.specialDays[index] = dto;
    } else {
      this.specialDays.push(dto);
    }
    return dto;
  }
}

@ApiTags("pricing")
@Controller("pricing")
class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get("rules")
  @ApiOperation({ summary: "List active pricing rules" })
  rules() {
    return this.pricingService.listRules();
  }

  @Get("history")
  @ApiOperation({ summary: "List pricing change audit log entries" })
  history() {
    return this.pricingService.listHistory();
  }

  @Get("special-days")
  @ApiOperation({ summary: "List special day pricing entries" })
  specialDays() {
    return this.pricingService.listSpecialDays();
  }

  @Post("simulate")
  @ApiOperation({ summary: "Calculate a price using the live rule set" })
  simulate(@Body() dto: PricingSimulationDto) {
    return this.pricingService.simulate(dto);
  }

  @Post("rules")
  @ApiOperation({ summary: "Update a sport pricing rule and write an audit log" })
  updateRule(@Body() dto: PricingRuleChangeDto) {
    return this.pricingService.updateRule(dto);
  }

  @Post("special-days")
  @ApiOperation({ summary: "Create or update a special day pricing override" })
  upsertSpecialDay(@Body() dto: SpecialDayDto) {
    return this.pricingService.upsertSpecialDay(dto);
  }
}

@Module({
  controllers: [PricingController],
  providers: [PricingService],
})
export class AppModule {}
