import { IsNotEmpty } from "class-validator";

export class LoginDto {
    
    login:      string;
    username:   string;
    email:      string;
}


export class findUserDto {
    @IsNotEmpty()
    login:      string;
}

export class FriendDto {

    @IsNotEmpty()
    loginA: string;
    @IsNotEmpty()
    loginB: string;
}

export class BlockDto {

    @IsNotEmpty()
    login: string;
    @IsNotEmpty()
    blockedLogin: string;
}


export class UpdateUserDto {
    
}