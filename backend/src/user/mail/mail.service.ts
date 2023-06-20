import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize the transporter with your email service provider settings
    this.transporter = nodemailer.createTransport({
      // Configure your email service provider details
      // For example, for Gmail:
      service: 'Gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: 'your-email@gmail.com',
      to,
      subject,
      html,
    });
  }
}