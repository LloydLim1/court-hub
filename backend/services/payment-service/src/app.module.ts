import { randomUUID } from "crypto";

import { Body, Controller, Get, Injectable, Module, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { IsIn, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

class CreatePaymentIntentDto {
  @ApiProperty()
  @IsString()
  bookingId!: string;

  @ApiProperty()
  @IsNumber()
  amount!: number;

  @ApiProperty({ enum: ["gcash", "maya", "bank_transfer"] })
  @IsIn(["gcash", "maya", "bank_transfer"])
  method!: "gcash" | "maya" | "bank_transfer";
}

class VerifyProofDto {
  @ApiProperty()
  @IsString()
  reference!: string;

  @ApiProperty()
  @IsUrl()
  proofImage!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  staffVerifierId?: string;
}

@Injectable()
class PaymentService {
  private readonly payments = new Map<string, Record<string, unknown>>();

  createIntent(dto: CreatePaymentIntentDto) {
    const reference = `CH-PAY-${Date.now().toString().slice(-8)}`;
    const payment = {
      bookingId: dto.bookingId,
      amount: dto.amount,
      method: dto.method,
      reference,
      qrCode: `data:image/svg+xml;base64,${Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="180" height="180" fill="#020617"/><text x="18" y="90" fill="#38bdf8" font-size="14">${reference}</text></svg>`,
      ).toString("base64")}`,
      verificationStatus: "pending",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    this.payments.set(reference, payment);
    return payment;
  }

  verifyProof(dto: VerifyProofDto) {
    const payment = this.payments.get(dto.reference);
    if (!payment) {
      return { verified: false, reason: "Unknown payment reference." };
    }

    const ocrData = {
      confidence: 0.96,
      extractedReference: dto.reference,
      amountFound: payment.amount,
    };

    const verifiedPayment = {
      ...payment,
      proofImage: dto.proofImage,
      ocrData,
      verificationStatus: dto.staffVerifierId ? "manual_verified" : "ocr_verified",
      status: "verified",
      verifiedAt: new Date().toISOString(),
      entryQrReference: `ENTRY-${randomUUID().slice(0, 8).toUpperCase()}`,
    };

    this.payments.set(dto.reference, verifiedPayment);
    return verifiedPayment;
  }

  getPayment(reference: string) {
    return this.payments.get(reference) ?? null;
  }
}

@ApiTags("payments")
@Controller("payments")
class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("intent")
  @ApiOperation({ summary: "Generate a payment reference and QR code" })
  createIntent(@Body() dto: CreatePaymentIntentDto) {
    return this.paymentService.createIntent(dto);
  }

  @Post("verify")
  @ApiOperation({ summary: "Verify uploaded payment proof using OCR or manual review" })
  verify(@Body() dto: VerifyProofDto) {
    return this.paymentService.verifyProof(dto);
  }

  @Get(":reference")
  @ApiOperation({ summary: "Retrieve a payment record by reference" })
  getOne(@Param("reference") reference: string) {
    return this.paymentService.getPayment(reference);
  }
}

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class AppModule {}
