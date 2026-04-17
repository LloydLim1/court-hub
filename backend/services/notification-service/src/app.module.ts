import { Body, Controller, Get, Injectable, Module, Post } from "@nestjs/common";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { IsIn, IsObject, IsString } from "class-validator";
import { Server } from "socket.io";

class PublishEventDto {
  @ApiProperty({
    enum: [
      "court.status.updated",
      "booking.created",
      "booking.grace_warning",
      "booking.no_show",
      "transition.alert",
      "equipment.status.updated",
    ],
  })
  @IsIn([
    "court.status.updated",
    "booking.created",
    "booking.grace_warning",
    "booking.no_show",
    "transition.alert",
    "equipment.status.updated",
  ])
  type!:
    | "court.status.updated"
    | "booking.created"
    | "booking.grace_warning"
    | "booking.no_show"
    | "transition.alert"
    | "equipment.status.updated";

  @ApiProperty()
  @IsObject()
  payload!: Record<string, unknown>;

  @ApiProperty()
  @IsString()
  source!: string;
}

@Injectable()
class NotificationStreamService {
  private readonly events: Array<Record<string, unknown>> = [];

  add(event: PublishEventDto) {
    const enriched = {
      ...event,
      createdAt: new Date().toISOString(),
    };
    this.events.unshift(enriched);
    return enriched;
  }

  list() {
    return this.events;
  }
}

@WebSocketGateway({
  cors: { origin: "*" },
})
class NotificationGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  afterInit() {
    this.server.emit("gateway.ready", { status: "ok" });
  }

  publish(event: Record<string, unknown>) {
    const type = String(event.type);
    this.server.emit(type, event);
  }
}

@ApiTags("notifications")
@Controller("notifications")
class NotificationController {
  constructor(
    private readonly streamService: NotificationStreamService,
    private readonly gateway: NotificationGateway,
  ) {}

  @Get("events")
  @ApiOperation({ summary: "List recent real-time events" })
  events() {
    return this.streamService.list();
  }

  @Post("publish")
  @ApiOperation({ summary: "Publish a real-time event to all staff and display clients" })
  publish(@Body() dto: PublishEventDto) {
    const event = this.streamService.add(dto);
    this.gateway.publish(event);
    return event;
  }
}

@Module({
  controllers: [NotificationController],
  providers: [NotificationGateway, NotificationStreamService],
})
export class AppModule {}
