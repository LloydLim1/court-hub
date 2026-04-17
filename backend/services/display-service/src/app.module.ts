import { Controller, Get, Injectable, Module } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { DISPLAY_ROTATION_VIEWS } from "@courthub/domain";

@Injectable()
class DisplayService {
  overview() {
    return {
      now: new Date().toISOString(),
      views: DISPLAY_ROTATION_VIEWS,
      ticker:
        "CourtHub live updates: Pickleball B released after no-show • Volleyball grace period warning active • Basketball full court next slot at 18:00",
    };
  }

  schedule() {
    return [
      { court: "Basketball Full Court", nextSlot: "18:00", status: "in_use" },
      { court: "Pickleball B", nextSlot: "Available now", status: "no_show" },
      { court: "Badminton B", nextSlot: "18:20", status: "cleaning" },
    ];
  }
}

@ApiTags("display")
@Controller("display")
class DisplayController {
  constructor(private readonly displayService: DisplayService) {}

  @Get("overview")
  @ApiOperation({ summary: "Return the display rotation configuration and ticker" })
  overview() {
    return this.displayService.overview();
  }

  @Get("schedule")
  @ApiOperation({ summary: "Return the public schedule feed" })
  schedule() {
    return this.displayService.schedule();
  }
}

@Module({
  controllers: [DisplayController],
  providers: [DisplayService],
})
export class AppModule {}
