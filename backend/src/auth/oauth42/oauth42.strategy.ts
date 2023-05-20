import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback} from 'passport-42';


@Injectable() 
export class QuaranteDeuxStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
          clientID: "u-s4t2ud-10131ceadfdb4d81f3911ed929c914aca95fa32de82f937dd74a3d4fde175f7a",
          clientSecret: "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",
          callbackURL: 'http://localhost:5000/auth/callback',
        });
      }

      async validate(accessToken: string,refreshToken: string,profile: any, done: VerifyCallback,): Promise<any> {
        const user = profile;
        done(null, user);
      }
}