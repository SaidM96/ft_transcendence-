import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback} from 'passport-42';


@Injectable() 
export class QuaranteDeuxStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
          clientID: "u-s4t2ud-6f968b7e5f1f18f8927e0139e0d4acfe4793233914f338b0b22c52bdbac0776a",
          clientSecret: "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",
          callbackURL: 'http://localhost:5000/auth/callback',
        
        });
      }

      async validate(accessToken: string,refreshToken: string,profile: any, done: VerifyCallback,): Promise<any> {
        const user = profile;
        done(null, user);
      }
}