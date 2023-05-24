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
    @IsString()
    userLogin:string;
    @IsString()
    channelName:string;
    @IsOptional()
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