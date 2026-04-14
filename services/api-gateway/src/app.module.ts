import { Controller, Get, Injectable, Module } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Injectable()
class GatewayRegistryService {
  listRoutes() {
    return [
      { service: "auth-service", upstream: "http://auth-service:4001/api" },
      { service: "booking-service", upstream: "http://booking-service:4002/api" },
      { service: "equipment-service", upstream: "http://equipment-service:4003/api" },
      { service: "pricing-service", upstream: "http://pricing-service:4004/api" },
      { service: "payment-service", upstream: "http://payment-service:4005/api" },
      { service: "notification-service", upstream: "http://notification-service:4006/api" },
      { service: "analytics-service", upstream: "http://analytics-service:4007/api" },
      { service: "display-service", upstream: "http://display-service:4008/api" },
    ];
  }
}

@ApiTags("gateway")
@Controller()
class GatewayController {
  constructor(private readonly registry: GatewayRegistryService) {}

  @Get("health")
  @ApiOperation({ summary: "Gateway heartbeat" })
  health() {
    return { status: "ok", service: "api-gateway" };
  }

  @Get("routes")
  @ApiOperation({ summary: "List service upstreams known by the gateway" })
  routes() {
    return this.registry.listRoutes();
  }
}

@Module({
  controllers: [GatewayController],
  providers: [GatewayRegistryService],
})
export class AppModule {}
