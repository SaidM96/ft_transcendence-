import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { ChatGateWay } from './chat.gateway';
import { JwtStrategy } from 'src/auth/jwtStrategy/jwt.strategy';

@Module({
  controllers: [ChatController],
  providers: [ChatService, UserService, PrismaService, ChatGateWay, JwtStrategy]
})
export class ChatModule {}
