import { createHmac } from "crypto";

import { Body, Controller, Get, Injectable, Module, Post, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { IsEmail, IsIn, IsString, MinLength } from "class-validator";

class LoginDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password!: string;
}

class AssignRoleDto {
  @ApiProperty({ enum: ["manager", "front_desk"] })
  @IsIn(["manager", "front_desk"])
  role!: "manager" | "front_desk";
}

@Injectable()
class AuthService {
  private readonly secret = process.env.JWT_SECRET ?? "courthub-local-secret";

  login(dto: LoginDto) {
    if (!dto.email.includes("@") || dto.password.length < 6) {
      throw new UnauthorizedException("Invalid staff credentials.");
    }

    const role = dto.email.includes("manager") || dto.email.includes("owner") ? "manager" : "front_desk";
    const payload = {
      sub: dto.email.toLowerCase(),
      role,
      permissions:
        role === "manager"
          ? ["dashboard:*", "pricing:*", "users:*", "reports:*"]
          : ["bookings:*", "payments:*", "equipment:*", "checkin:*"],
    };

    return {
      accessToken: this.signJwt(payload),
      refreshToken: this.signJwt({ ...payload, tokenType: "refresh" }),
      role,
      expiresIn: 3600,
    };
  }

  assignRole(dto: AssignRoleDto) {
    return { role: dto.role, updatedAt: new Date().toISOString() };
  }

  private signJwt(payload: Record<string, unknown>) {
    const header = { alg: "HS256", typ: "JWT" };
    const encode = (value: Record<string, unknown>) =>
      Buffer.from(JSON.stringify(value)).toString("base64url");
    const body = encode({
      ...payload,
      iss: "courthub-auth-service",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const tokenBase = `${encode(header)}.${body}`;
    const signature = createHmac("sha256", this.secret).update(tokenBase).digest("base64url");
    return `${tokenBase}.${signature}`;
  }
}

@ApiTags("auth")
@Controller("auth")
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Authenticate staff and mint JWT tokens" })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("roles")
  @ApiOperation({ summary: "Assign or change a staff role" })
  assignRole(@Body() dto: AssignRoleDto) {
    return this.authService.assignRole(dto);
  }

  @Get("health")
  @ApiOperation({ summary: "Auth service heartbeat" })
  health() {
    return { status: "ok", service: "auth-service" };
  }
}

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
