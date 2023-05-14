import { IsNotEmpty } from "class-validator";

export class LoginDto {
    
    login:      string;
    username:   string;
    email:      string;
    // photo:      string;
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