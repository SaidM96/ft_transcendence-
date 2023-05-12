import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { JwtMiddleware } from './auth/jwtStrategy/jwt.middelware';
import { JwtService } from '@nestjs/jwt';
import cookieParser from 'cookie-parser';
import { RefreshJwtMiddleware } from './auth/jwtStrategy/refresh.middleware';
import { UserService } from './user/user.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [AuthModule, UserModule, ChatModule,],
  controllers: [AppController],
  providers: [AppService, JwtService, UserService, PrismaService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser,JwtMiddleware)
      .exclude(
        { path: '/auth/42', method: RequestMethod.ALL},
        { path: '/auth/callback', method: RequestMethod.ALL },
      )
      .forRoutes({path:'*', method: RequestMethod.ALL});
      // consumer.apply(cookieParser,RefreshJwtMiddleware)
      // .exclude(
      //   { path: '/auth/42', method: RequestMethod.ALL},
      //   { path: '/auth/callback', method: RequestMethod.ALL },
      // )
      // .forRoutes({path:'*', method: RequestMethod.ALL});
  }
}
