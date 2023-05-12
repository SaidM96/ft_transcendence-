import { LoginDto } from './dto/login.dto';
import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}

    async findAllUsers(){
        const resuslt = await this.prisma.client.user.findMany();
        console.log(resuslt)
        return resuslt;
    }

    async findUser(login:string) : Promise<User | null>{
        return await this.prisma.client.user.findUnique({where:{login:login}});
    }

    async createUser(loginDto:LoginDto): Promise<User | null>{
        return  await this.prisma.client.user.create({
            data:{
                login: loginDto.login,
                username: loginDto.username,
                email:  loginDto.email,
            }
        });
    }
}
