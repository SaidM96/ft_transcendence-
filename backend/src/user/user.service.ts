import { FriendDto, LoginDto, findUserDto } from './dto/user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient  } from '@prisma/client';
import { PrismaService,  } from 'prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}

    async findAllUsers(){
        const resuslt = await this.prisma.client.user.findMany();
        return resuslt;
    }
    async findUser(login:string) {
        return await this.prisma.client.user.findUnique({where:{login:login}});
    }

    async createUser(loginDto:LoginDto){
        const user =  await this.prisma.client.user.create({
            data:{
                login: loginDto.login,
                username: loginDto.username,
                email:  loginDto.email,
            }
        });
        await this.prisma.client.status.create({
            data:{
                user:{
                    connect:{
                        UserId:user.UserId,
                    }
                }
            }
        });
        return user;
    }

    async deleteUser(login:string){
        return await this.prisma.client.user.delete({where:{login:login}})
    }


    // friendship
    async IsfriendOf(loginA:string, loginB:string){
        return await this.prisma.client.friend.findFirst({
            where:{
                loginA:loginA,
                loginB:loginB,
            }
        });
    }

    async createFriendship(friendDto:FriendDto){

        const {loginA, loginB} = friendDto;
        const userA = await this.findUser(loginA)
        const userB = await this.findUser(loginB)
        if (!userA || !userB)
            return new NotFoundException(`cannot find ${loginA} or ${loginB}`);
        //check if userA added userB
        const frienda = await this.IsfriendOf(loginA, loginB);
        if (frienda)
            return {message:`${loginA} and ${loginB} is already friends!`};
        // if userA friendOf userB  
        const friend = await this.IsfriendOf(loginB, loginA);
        if (friend)
        {
            if (!friend.isFriends)
                return await this.prisma.client.friend.update({
                    where:{
                        FriendshipId:friend.FriendshipId,
                    },
                    data:{
                        isFriends:true
                    }
                });
            else
                return {message:`${loginA} and ${loginB} is already friends!`};
        }
        // last case , let's create new friendship
        return  await this.prisma.client.friend.create({
            data: {
                userA:{
                    connect:{
                        UserId:userA.UserId,
                    }
                },
                loginA: loginA, 
                userB:{
                    connect:{
                        UserId:userB.UserId,
                    }
                },
                loginB:loginB,
                isFriends: false,
            }
        });
    }

    async getUserFriends(login:string){
        const user = await  this.findUser(login);
        if(!user)
            return new NotFoundException();
        // list of friendship that added user(login)
        const friendAddedUser = await this.prisma.client.friend.findMany({
            where:{
                loginA:login,
            },
        });
        // list of friendship that addedBy user(login)
        const friendAddedbyUser = await this.prisma.client.friend.findMany({
            where:{
                loginB:login,
                isFriends:true,
            },
        });
        return [...friendAddedUser, ...friendAddedbyUser];
    }

    // delete a friend 
    async removeFriend(login:string, removedLogin:string){
        const user = await  this.findUser(login);
        const removedUser = await  this.findUser(removedLogin);
        if(!user || !removedUser)
            return new NotFoundException();

        const friendshipA = await this.IsfriendOf(login, removedLogin);
        if (friendshipA)
        {
            if (friendshipA.isFriends)
            {
                return await this.prisma.client.friend.update({
                    where:{
                        FriendshipId:friendshipA.FriendshipId,
                    },
                    data:{
                        loginA:removedLogin,
                        loginB:login,
                        isFriends:false,
                    },
                });
            }
            else
                return await this.prisma.client.friend.delete({
                    where:{
                        FriendshipId:friendshipA.FriendshipId,
                    },
                });
        }
        const friendshipB = await this.IsfriendOf(removedLogin, login);
        if (friendshipB && friendshipB.isFriends)
            return await this.prisma.client.friend.update({
                where:{
                    FriendshipId:friendshipB.FriendshipId,
                },
                data:{
                    isFriends:false,
                },
            });
        return {message:`${login} and ${removedLogin} are not friends!`}
    }

    // block user
    async blockUser(login:string, blocked:string){
        const user = await  this.findUser(login);
        const blockedUser = await  this.findUser(blocked);
        if(!user || !blockedUser)
            return new NotFoundException();
        const block = await this.prisma.client.block.findFirst({
            where:{
                blockedById:user.UserId,
                blockedId:blockedUser.UserId,
            }
        });
        if (!block)
        {
            return await this.prisma.client.block.create({
                data:{
                    blockBy:{
                        connect:{
                            UserId:user.UserId,
                        },
                    },
                    blockByLogin:login,
                    blocked:{
                        connect:{
                            UserId:blockedUser.UserId,
                        },
                    },
                    blockedLogin:blocked,
                },
            })
        }
        else
            return {message:`${login} is already blo9 ${blocked}`};
    }

    // remove block
    async removeBlock(login:string, blocked:string){
        const user = await  this.findUser(login);
        const blockedUser = await  this.findUser(blocked);
        if(!user || !blockedUser)
            return new NotFoundException();
        const block = await this.prisma.client.block.findFirst({
            where:{
                blockedById:user.UserId,
                blockedId:blockedUser.UserId,
            }
        });
        if (block)
            return await this.prisma.client.block.delete({
                where:{
                    BlockId:block.BlockId,
                }
            })
        else
            return {message:`${login} had not blo9 ${blocked}`};
    }

    // get list of blocked users by  a user
    async getBlockedList(login:string){
        const user = await  this.findUser(login);
        if(!user)
            return new NotFoundException();
        return await this.prisma.client.block.findMany({
            where:{
                blockedById:user.UserId,
            }
        })
    }
// status
    // modify status of user
}

