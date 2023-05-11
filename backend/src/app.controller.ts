import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtGuard } from './auth/jwtStrategy/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get()
  @UseGuards(JwtGuard)
  async protectedRoute(@Req() req: any) {
    // req.user contains the authenticated user object
    return { message: `Hello, ${req.user.username}!` };
  }
}
