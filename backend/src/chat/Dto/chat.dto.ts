import { IsBoolean, IsOptional, IsString, isBoolean } from "class-validator";

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

// create new
export class ChannelDto {
    @IsString()
    channelName:string;
    @IsString()
    nickname:string;
    @IsBoolean()
    isPrivate:boolean;
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
    channelName:string;
    @IsString()
    login:string;
    @IsString()
    nickname:string;
    @IsOptional()
    @IsString()
    password:string;
}

export class msgChannelDto {
    @IsString()
    login:string;
    @IsString()
    content:string;
    @IsString()
    channelName:string;
}

// delete 
export class deleteChannelDto {
    @IsString()
    channelName:string;
    @IsString()
    LoginOwner:string;
}

export class DeleteMemberChannelDto {
    @IsString()
    channelName:string;
    @IsString()
    login:string;
    @IsString()
    loginDeleted:string; 
}

// update channel
export class updateChannelDto {
    @IsString()
    userLogin:string;
    @IsString()
    channelName:string;
    @IsOptional()
    @IsBoolean()
    isPrivate:boolean
    @IsOptional()
    @IsString()
    newLoginOwner:string;
    @IsOptional()
    @IsBoolean()
    ispassword:boolean;
    @IsString()
    @IsOptional()
    newPassword:string;
}

export class updateMemberShipDto{
    @IsOptional()
    @IsString()
    userLogin:string;
    @IsString()
    channelName:string;
    @IsString()
    loginMemberAffected:string;
    @IsOptional()
    @IsBoolean()
    isMute:boolean;
    @IsOptional()
    @IsBoolean()
    isBlacklist:boolean;
    @IsOptional()
    @IsBoolean()
    isOwner:boolean;
    @IsOptional()
    @IsBoolean()
    isAdmin:boolean;  
    @IsOptional()
    @IsString()
    nickname:string;  
}

export class channeDto {
    @IsString()
    channelName:string;
}


// Socket

export class sendMsgSocket {
    @IsString()
    receiver:string;
    @IsString()
    content:string;
}


export class sendChannelMsgSocket {
    @IsString()
    channelName:string;
    @IsString()
    content:string;
}
