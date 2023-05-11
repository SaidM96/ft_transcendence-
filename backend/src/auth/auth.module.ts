import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwtStrategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({secret: 'said@123',signOptions: { expiresIn: '1d' }}),

  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
