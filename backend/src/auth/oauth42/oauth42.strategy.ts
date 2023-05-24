import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback} from 'passport-42';


@Injectable() 
export class QuaranteDeuxStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
          clientID: "u-s4t2ud-51340767cb8254629829cb51adf1a424ae1c7f4d8ba33071ffa228f9d0a834f3",
          clientSecret: "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",
          callbackURL: 'http://localhost:5000/auth/call',
        });
      }

      async validate(accessToken: string,refreshToken: string,profile: any, done: VerifyCallback,): Promise<any> {
        const user = profile;
        done(null, user);
      }
}