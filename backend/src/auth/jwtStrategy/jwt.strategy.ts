import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import {  Injectable } from '@nestjs/common';
import { Request } from "express";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'said@123',
        })
    }
    async validate(payload:any){
        return {login: payload.login, id: payload.sub };
    }
}
