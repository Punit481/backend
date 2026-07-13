import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpVerification } from './entities/otp-verification.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpVerification)
    private otpRepository: Repository<OtpVerification>,
    private mailService: MailService,
  ) {}

  async generateAndSendOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otpRecord = this.otpRepository.create({ email, otp, expiresAt });
    await this.otpRepository.save(otpRecord);

    await this.mailService.sendOtpEmail(email, otp);
  }

  async verifyOtp(email: string, otp: string) {
    const record = await this.otpRepository.findOne({
      where: { email, otp },
      order: { createdAt: 'DESC' },
    });

    if (!record) {
      throw new BadRequestException('Invalid OTP');
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    return true;
  }
}