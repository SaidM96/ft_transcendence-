import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback} from 'passport-42';


@Injectable() 
export class QuaranteDeuxStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
          clientID: "u-s4t2ud-72ec237227a83be433af3e3cbfaea2210f57b917aa24ffdcf9e3b2114c1f7df2",
          clientSecret: "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",
          callbackURL: 'http://localhost:5000/auth/callback',
        });
      }

      async validate(accessToken: string,refreshToken: string,profile: any, done: VerifyCallback,): Promise<any> {
        const user = profile;
        done(null, user);
      }
}