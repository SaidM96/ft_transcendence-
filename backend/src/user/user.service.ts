import { BlockDto, FriendDto, LoginDto, UpdateStats, UpdateStatus, UpdateUserDto, findUserDto, storeMatchDto } from './dto/user.dto';
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

    async findUser(findUser:findUserDto) {
        const {login} = findUser;
        return await this.prisma.client.user.findFirst({where:{login:login}});
    }

    async findUserById(id:string) {
        return await this.prisma.client.user.findUnique({where:{UserId:id}});
    }

    async createUser(loginDto:LoginDto){
        const user =  await this.prisma.client.user.create({
            data:{
                login: loginDto.login,
                username: loginDto.username,
                email:  loginDto.email,
                bioGra: "",
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
        
        await this.prisma.client.stats.create({
            data:{
                user:{
                    connect:{
                        UserId:user.UserId,
                    },
                },
            }
        });
        return user;
    }

    async deleteUser(findUser:findUserDto){
        const {login} = findUser;
        const user = await this.findUser(findUser);
        if (!user)
            return new NotFoundException();
        return await this.prisma.client.user.delete({where:{login:login}})
    }

    async updateUser(updateUser:UpdateUserDto){
        const {login, username, bioGra, avatar, enableTwoFa } = updateUser;
        let user = await this.findUser({login:login});
        if (!user)
            return new NotFoundException();
        if (bioGra !== undefined)
        {
            user = await this.prisma.client.user.update({
                where:{
                    login:user.login,
                },
                data:{
                    bioGra:bioGra,
                }
            });
        }
        if (avatar !== undefined)
        {
            user = await this.prisma.client.user.update({
                where:{
                    login:user.login,
                },
                data:{
                    avatar:avatar,
                }
            });
        }
        if (username !== undefined)
        {
            user = await this.prisma.client.user.update({
                where:{
                    login:user.login,
                },
                data:{
                    username:username,
                }
            });
        }
        if (enableTwoFa !== undefined)
        {
            user = await this.prisma.client.user.update({
                where:{
                    login:user.login,
                },
                data:{
                    enableTwoFa:enableTwoFa,
                }
            });
        }
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
        const userA = await this.findUser({login:loginA})
        const userB = await this.findUser({login:loginB})
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

    async getUserFriends(findUser:findUserDto){
        const {login} = findUser;
        const user = await  this.findUser(findUser);
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
    async removeFriend(friendDto:FriendDto){
        
        const {loginA, loginB} = friendDto;
        const login = loginA;
        const removedLogin = loginB;
        const user = await  this.findUser({login:login});
        const removedUser = await  this.findUser({login:removedLogin});
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
    async blockUser(blockDto:BlockDto){
        const login = blockDto.login;
        const blocked = blockDto.blockedLogin;
        const user = await  this.findUser({login:login});
        const blockedUser = await  this.findUser({login:blocked});
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
        const user = await  this.findUser({login:login});
        const blockedUser = await  this.findUser({login:blocked});
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
    async getBlockedList(findUser:findUserDto){
        const user = await  this.findUser(findUser);
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
    async modifyStatusUser(updateStatus:UpdateStatus){
        const {login, isOnline, inGame} = updateStatus;
        const user = await this.findUser({login});
        if (!user)
            return new NotFoundException();
        const status = await this.prisma.client.status.findFirst({
            where:{
                userId:user.UserId,
            },
        });
        if (!status)
            return new NotFoundException();
        return await this.prisma.client.status.update({
            where:{
                statusId:status.statusId,
            },
            data:{
                isOnline:isOnline,
                inGame:inGame,
            },
        });
    }

    // get status of user
    async getStatusUser(findUser:findUserDto){
        const user = await  this.findUser(findUser);
        if(!user)
            return new NotFoundException();
        return await this.prisma.client.status.findUnique({
            where:{
                userId:user.UserId,
            },
        });
    }

// stats
    // modify stats of user
    async modifyStatsUser(updateStats:UpdateStats){
        const {login, wins, losses, ladder} = updateStats;
        const user = await this.findUser({login});
        if (!user)
            return new NotFoundException();
        const stats = await this.prisma.client.stats.findFirst({
            where:{
                userId:user.UserId,
            },
        });
        if (!stats)
            return new NotFoundException();
        return await this.prisma.client.stats.update({
            where:{
                StatsId:stats.StatsId,
            },
            data:{
                wins:wins,
                losses:losses,
                ladder:ladder,
            },
        });
    }

    // get stats of user
    async getStatsUser(findUser:findUserDto){
        const user = await  this.findUser(findUser);
        if(!user)
            return new NotFoundException();
        return await this.prisma.client.stats.findUnique({
            where:{
                userId:user.UserId,
            },
        });
    }
// match
    
    //store New finished match
    async storeMatch(matchDto:storeMatchDto){
        const {loginA, loginB, scoreA, scoreB, winner} = matchDto;
        const userA = await  this.findUser({login:loginA});
        const userB = await  this.findUser({login:loginB});
        if(!userA || !userB)
            return new NotFoundException();
        return await this.prisma.client.match.create({
            data:{
                userA:{
                    connect:{
                        UserId:userA.UserId,
                    },
                },
                scoreA:scoreA,
                userB:{
                    connect:{
                        UserId:userB.UserId,
                    },
                },
                scoreB:scoreB,
                winner:winner,
            }
        })
    }

    // get user's matchs history 
    async getHistoryUserMatchs(findUser:findUserDto){
        const user = await  this.findUser(findUser);
        if(!user)
            return new NotFoundException();
        const matchsA =  await this.prisma.client.match.findMany({
            where:{
                userAId:user.UserId,
            },
        });
        const matchsB =  await this.prisma.client.match.findMany({
            where:{
                userBId:user.UserId,
            },
        });
        return {...matchsA, ...matchsB};
    }

    // get history match one vs one
    async getHistoryOneVsOne(friendDto:FriendDto){
        const {loginA, loginB} = friendDto;
        const userA = await  this.findUser({login:loginA});
        const userB = await  this.findUser({login:loginB});
        if(!userA || !userB)
            return new NotFoundException();
        const matchsA = await this.prisma.client.match.findMany({
            where:{
                userAId:userA.UserId,
                userBId:userB.UserId,
            },
        });

        const matchsB = await this.prisma.client.match.findMany({
            where:{
                userAId:userB.UserId,
                userBId:userA.UserId,
            },
        });
        return {...matchsA, ...matchsB};
    }


}

