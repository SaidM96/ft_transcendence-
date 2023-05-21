import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback} from 'passport-42';


@Injectable() 
export class QuaranteDeuxStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
          clientID: "u-s4t2ud-67fe30e64bd18fb0b593eed41b17ae642c878b799287dcdeec00fbc58a9214fa",
          clientSecret: "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",
          callbackURL: 'http://localhost:5000/auth/call',
        });
      }

      async validate(accessToken: string,refreshToken: string,profile: any, done: VerifyCallback,): Promise<any> {
        const user = profile;
        done(null, user);
      }
}