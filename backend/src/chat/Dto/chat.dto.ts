import { IsString } from "class-validator";

export class sendMsgDto {
    @IsString()
    sender:string;
    @IsString()
    receiver:string;
    @IsString()
    content:string;
}