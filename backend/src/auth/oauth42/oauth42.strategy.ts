import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback} from 'passport-42';


@Injectable() 
export class QuaranteDeuxStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
          clientID: "u-s4t2ud-d5f8b8c38e94365049ab68de8ffb2a0e41941a16a29953daa646c062dfbd5117",
          clientSecret: "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",
          callbackURL: 'http://localhost:5000/auth/call',
        });
      }

      async validate(accessToken: string,refreshToken: string,profile: any, done: VerifyCallback,): Promise<any> {
        const user = profile;
        done(null, user);
      }
}