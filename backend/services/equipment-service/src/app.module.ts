import { Body, Controller, Get, Injectable, Module, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { EQUIPMENT_BUNDLES, type SportType } from "@courthub/domain";
import { IsIn, IsString } from "class-validator";

class ReserveBundleDto {
  @ApiProperty()
  @IsString()
  bookingId!: string;

  @ApiProperty({ enum: ["basketball", "volleyball", "pickleball", "badminton"] })
  @IsIn(["basketball", "volleyball", "pickleball", "badminton"])
  sport!: SportType;
}

class UpdateEquipmentStateDto {
  @ApiProperty({ enum: ["available", "reserved", "in_use", "returned", "damaged", "maintenance"] })
  @IsIn(["available", "reserved", "in_use", "returned", "damaged", "maintenance"])
  state!: "available" | "reserved" | "in_use" | "returned" | "damaged" | "maintenance";
}

@Injectable()
class EquipmentService {
  private readonly equipment = [
    { id: "EQ-BB-001", name: "Basketball Bundle", sport: "basketball", state: "available" },
    { id: "EQ-VB-001", name: "Volleyball Bundle", sport: "volleyball", state: "available" },
    { id: "EQ-PB-001", name: "Pickleball Bundle A", sport: "pickleball", state: "reserved" },
    { id: "EQ-BD-001", name: "Badminton Bundle A", sport: "badminton", state: "maintenance" },
  ];

  list() {
    return this.equipment;
  }

  bundles() {
    return EQUIPMENT_BUNDLES;
  }

  reserve(dto: ReserveBundleDto) {
    const available = this.equipment.find((item) => item.sport === dto.sport && item.state === "available");
    if (!available) {
      return { reserved: false, bookingBlocked: true, reason: "Equipment unavailable for this sport." };
    }

    available.state = "reserved";
    return { reserved: true, bookingId: dto.bookingId, equipmentId: available.id };
  }

  updateState(id: string, state: UpdateEquipmentStateDto["state"]) {
    const item = this.equipment.find((entry) => entry.id === id);
    if (!item) return null;
    item.state = state;
    return item;
  }
}

@ApiTags("equipment")
@Controller("equipment")
class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  @ApiOperation({ summary: "List tracked equipment assets" })
  list() {
    return this.equipmentService.list();
  }

  @Get("bundles")
  @ApiOperation({ summary: "List preconfigured sport bundles" })
  bundles() {
    return this.equipmentService.bundles();
  }

  @Post("reserve")
  @ApiOperation({ summary: "Reserve equipment for a booking" })
  reserve(@Body() dto: ReserveBundleDto) {
    return this.equipmentService.reserve(dto);
  }

  @Patch(":id/state")
  @ApiOperation({ summary: "Update an equipment asset state" })
  updateState(@Param("id") id: string, @Body() dto: UpdateEquipmentStateDto) {
    return this.equipmentService.updateState(id, dto.state);
  }
}

@Module({
  controllers: [EquipmentController],
  providers: [EquipmentService],
})
export class AppModule {}
