import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './otp.service';
import { OtpVerification } from './entities/otp-verification.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([OtpVerification]), MailModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}