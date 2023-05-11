import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { JwtMiddleware } from './auth/jwtStrategy/jwt.middelware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, UserModule, ChatModule,],
  controllers: [AppController],
  providers: [AppService, JwtService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: '/auth/42', method: RequestMethod.ALL},
        { path: '/auth/callback', method: RequestMethod.ALL },
      )
      .forRoutes({path:'*', method: RequestMethod.ALL});
  }
}
