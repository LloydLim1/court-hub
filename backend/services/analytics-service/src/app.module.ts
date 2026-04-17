import { Controller, Get, Injectable, Module } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { EXECUTIVE_KPIS, SAMPLE_BOOKINGS } from "@courthub/domain";

@Injectable()
class AnalyticsService {
  kpis() {
    return EXECUTIVE_KPIS;
  }

  revenueSeries() {
    return [
      { hour: "08:00", revenue: 6400, bookings: 4 },
      { hour: "10:00", revenue: 9300, bookings: 7 },
      { hour: "12:00", revenue: 12500, bookings: 9 },
      { hour: "14:00", revenue: 17000, bookings: 11 },
      { hour: "16:00", revenue: 21800, bookings: 14 },
      { hour: "18:00", revenue: 24500, bookings: 16 },
      { hour: "20:00", revenue: 26750, bookings: 18 },
    ];
  }

  customerInsights() {
    return {
      highRiskCustomers: [
        { customerId: "CUS-001", noShowCount: 2, requiresAdvancePayment: false },
        { customerId: "CUS-103", noShowCount: 3, requiresAdvancePayment: true },
      ],
      latestBookings: SAMPLE_BOOKINGS.slice(0, 2),
    };
  }

  reports() {
    return [
      { id: "RPT-001", title: "End-of-day Finance Summary", format: "pdf" },
      { id: "RPT-002", title: "No-Show Trend Report", format: "csv" },
    ];
  }
}

@ApiTags("analytics")
@Controller("analytics")
class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("kpis")
  @ApiOperation({ summary: "Executive KPI rollup" })
  kpis() {
    return this.analyticsService.kpis();
  }

  @Get("revenue")
  @ApiOperation({ summary: "Revenue series for charting" })
  revenue() {
    return this.analyticsService.revenueSeries();
  }

  @Get("customers")
  @ApiOperation({ summary: "Customer insight and no-show risk summary" })
  customers() {
    return this.analyticsService.customerInsights();
  }

  @Get("reports")
  @ApiOperation({ summary: "Generated report metadata" })
  reports() {
    return this.analyticsService.reports();
  }
}

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AppModule {}
