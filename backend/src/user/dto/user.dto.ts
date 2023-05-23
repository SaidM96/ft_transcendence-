import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LoginDto {
    @IsString()
    login:      string;
    @IsString()
    username:   string;
    @IsString()
    email:      string;
}


export class findUserDto {
    @IsString()
    login:      string;
}

export class FriendDto {
    @IsString()
    loginA: string;
    @IsString()
    loginB: string;
}

export class BlockDto {
    @IsString()
    login: string;
    @IsString()
    blockedLogin: string;
}

export class UpdateUserDto {
    @IsString()
    login:      string;
    @IsString()
    username:string;
}

export class UpdateStatus {
    @IsString()
    login:string;
    @IsBoolean()
    isOnline: boolean;
    @IsBoolean()
    inGame: boolean;
}

export class UpdateStats{
    @IsString()
    login:string;
    @IsNumber()
    wins: number;
    @IsNumber()
    losses: number;
    @IsNumber()
    ladder: number;
}


export class storeMatchDto {
    @IsString()
    loginA:string;
    @IsString()
    loginB:string;
    @IsNumber()
    scoreA: number;
    @IsNumber()
    scoreB: number;
    @IsBoolean()
    winner: boolean;
}