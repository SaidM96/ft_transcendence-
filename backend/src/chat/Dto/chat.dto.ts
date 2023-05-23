import { IsBoolean, IsOptional, IsString } from "class-validator";

export class sendMsgDto {
    @IsString()
    sender:string;
    @IsString()
    receiver:string;
    @IsString()
    content:string;
}


export class getConvDto {
    @IsString()
    loginA:string;
    @IsString()
    loginB:string;
}

export class ChannelDto {
    @IsString()
    channelName:string;
    @IsString()
    nickname:string;
    @IsString()
    LoginOwner:string;
    @IsBoolean()
    ispassword:boolean;
    @IsString()
    @IsOptional()
    password:string;
}

export class MemberChannelDto {
    @IsString()
    nickname:string;
    @IsString()
    channelName:string;
    @IsString()
    login:string;
}

export class msgChannelDto {
    @IsString()
    login:string;
    @IsString()
    content:string;
    @IsString()
    channelName:string;
}

