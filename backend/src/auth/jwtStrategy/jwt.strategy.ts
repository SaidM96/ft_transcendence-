import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import {  ArgumentsHost, Injectable, Catch, ExceptionFilter, UnauthorizedException } from '@nestjs/common';
import { Request } from "express";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req:Request) => {
                  let data = req?.cookies["jwt-cookie"];
                  if(!data){
                      return null;
                  }
                  return data.token
            }]),
            ignoreExpiration: false,
            secretOrKey: 'said@123',
        })
    }

    async validate(payload:any){
        if (payload == null)
          throw new UnauthorizedException();
        return payload;
    }
} 
