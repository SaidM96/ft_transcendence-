import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ChannelDto, DeleteMemberChannelDto, MemberChannelDto, channeDto, deleteChannelDto, getConvDto, msgChannelDto, sendMsgDto, updateChannelDto, updateMemberShipDto } from './Dto/chat.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { findUserDto } from 'src/user/dto/user.dto';
@Injectable()
export class ChatService {
    constructor(private readonly userService:UserService,
        private  prisma:PrismaService){}
    // check if two users had already a conversation ,
    // if not  i create new conv after that i create new msg
    // and assing it  to conv that it s belong to
    async addNewMessage(msgDto:sendMsgDto){
        const {sender, receiver, content} = msgDto;
        // check if sender or receiver exist in  database 
        const userA = await this.userService.findUser({login:sender});
        const userB = await this.userService.findUser({login:receiver});
        if (!userA || !userB)
            throw new NotFoundException();
        if (userA.login == userB.login)
            throw new NotFoundException("user cant send msg to himself");
        // know we check if sender and receiver have already an conversation
        const convA = await this.prisma.client.conversation.findFirst({
            where:{
                loginA:userA.login,
                loginB:userB.login,
            },
        });

        const convB = await this.prisma.client.conversation.findFirst({
            where:{
                loginA:userB.login,
                loginB:userA.login,
            },
        });

        // set fromUserA  to true to know who send msg 
        if (convA)
        {
            return await this.prisma.client.message.create({
                data:{
                    content:content,
                    fromUserA:true,
                    conversation:{
                        connect:{
                            ConvId:convA.ConvId,
                        },
                    },
                },
            });
        }
        if (convB)
        {
            return await this.prisma.client.message.create({
                data:{
                    content:content,
                    fromUserA:false,
                    conversation:{
                        connect:{
                            ConvId:convB.ConvId,
                        },
                    },
                },
            });
        }

        // else userA and  userB first time they had a conversation so we create new one
        const conv =  await this.prisma.client.conversation.create({
            data:{
                userA:{
                    connect:{
                        UserId:userA.UserId,
                    },
                },
                loginA:userA.login,
                userB:{
                    connect:{
                        UserId:userB.UserId,
                    },
                },
                loginB:userB.login,
            },
        });

        return await this.prisma.client.message.create({
            data:{
                content:content,
                fromUserA:true,
                conversation:{
                    connect:{
                        ConvId:conv.ConvId,
                    },
                },
            },
        });
    }

    // get conversation between two users
    async getConv(loginA:string, loginB:string){
        const conv = await this.prisma.client.conversation.findFirst({
            where:{
                loginA:loginA,
                loginB:loginB,
            },
        });
        if (conv)
            return await this.prisma.client.message.findMany({
                where:{
                    conversationId:conv.ConvId,
                },
            });
        return null;
    }

    async getConversation(getConv:getConvDto){
        const {loginA, loginB} = getConv;
        // check if sender or receiver exist in  database 
        const userA = await this.userService.findUser({login:loginA});
        const userB = await this.userService.findUser({login:loginB});
        if ((!userA || !userB))
            throw new NotFoundException();
        if ((userA.login == userB.login))
            throw new NotFoundException();
        const convA = await this.getConv(loginA,loginB);
        if (convA)
            return convA;
        const convB = await this.getConv(loginB, loginA);
        if (convB)
            return convB;
    }

// channel

    // create new channel
    async createNewChannel(channelDto:ChannelDto){
        const {channelName, nickname,isPrivate , LoginOwner, ispassword, password} = channelDto;
        let pass =  "0000";
        if (ispassword)
        {
            pass = await bcrypt.hashSync(password,10)
        }
        // check if loginOwner exist in database;
        const user = await this.userService.findUser({login:LoginOwner});
        if (!user)
            throw new NotFoundException();
        // check if there already an channel with same channelName
        const ch = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (ch)
            throw new NotFoundException(`there is already a channel with name ${channelName} `)
        // create new channel
        const channel = await this.prisma.client.channel.create({
            data:{
                channelName:channelName,
                LoginOwner:LoginOwner,
                ispassword:ispassword,
                password:pass,
                isPrivate:isPrivate,
            },
        });

        // now creating an MembershipChannel for the owner
        const memerShip = await this.prisma.client.membershipChannel.create({
            data:{
                nickname:nickname,
                isOwner:true,
                isAdmin:true,
                channel:{
                    connect:{
                        ChannelId:channel.ChannelId,
                    },
                },
                channelName:channel.channelName,
                login:user.login,
                user:{
                    connect:{
                        UserId:user.UserId,
                    },
                },

            },
        });
        return channel;
    }

    // delete a channel
    async deleteChannel(deleteChannel:deleteChannelDto){
            const {channelName, LoginOwner} = deleteChannel;
            const user = await this.userService.findUser({login:LoginOwner});
            if (!user)
                throw new NotFoundException(`no such user with Login: ${LoginOwner}`)
            const channel = await this.prisma.client.channel.findFirst({
                where:{
                    channelName:channelName,
                },
            });
            if (!channel)
                throw new NotFoundException(`no such channel: ${channelName}`);
            if (channel.LoginOwner !== LoginOwner)
                throw new NotFoundException(` ${LoginOwner} is not Owner of channel: ${channelName}`);
            return await this.prisma.client.channel.delete({
                where:{
                    ChannelId:channel.ChannelId,
                },
            });
        }

    // update channel : turne it public or private , change Owner , or password
    async updateChannel(updateCh:updateChannelDto){
        const {userLogin, channelName, isPrivate, newLoginOwner, ispassword, newPassword} = updateCh;

        const user = await this.userService.findUser({login:userLogin});
        if (!user)
            throw new NotFoundException(`no such user with Login: ${userLogin}`);

        let channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (!channel)
            throw new NotFoundException(`no such channel: ${channelName}`);
        if (channel.LoginOwner !== userLogin)
            throw new NotFoundException(`only owner can update his channel`);

        if (isPrivate !== undefined)
        {
            channel = await this.prisma.client.channel.update({
                where:{
                    ChannelId:channel.ChannelId,
                },
                data:{
                    isPrivate:isPrivate,
                },
            });
        }
        if (newLoginOwner !== undefined)
        {
            channel = await this.prisma.client.channel.update({
                where:{
                    ChannelId:channel.ChannelId,
                },
                data:{
                    LoginOwner:newLoginOwner,
                },
            });

            // !!!!!!!!!!!  dont forget to update memberShip 
            // of newLoginOwner to set it isOwner and IsAdmin
            
        }
        if (ispassword !== undefined)
        {
            channel = await this.prisma.client.channel.update({
                where:{
                    ChannelId:channel.ChannelId,
                },
                data:{
                    ispassword:ispassword,
                },
            });
        }
        if (newPassword !== undefined && channel.ispassword)
        {
            const pass = await bcrypt.hashSync(newPassword,10); 
            channel = await this.prisma.client.channel.update({
                where:{
                    ChannelId:channel.ChannelId,
                },
                data:{
                    password:pass,
                },
            });
        }
        return channel;
    }
 
    // create new MemberChannel
    async createMemberChannel(memberChannelDto:MemberChannelDto){
        const {nickname, channelName, login, password} = memberChannelDto;
        const user = await this.userService.findUser({login:login});
        if (!user)
            throw new NotFoundException();

        // check if there already an channel with same channelName
        const channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (!channel)
            throw new NotFoundException(`no such channel with the name ${channelName}`)

        // check if user is already on that channel
        const memberShip = await this.prisma.client.membershipChannel.findFirst({
            where:{
                userId:user.UserId,
                channelId:channel.ChannelId,
            },
        });
        if (memberShip)
            throw new NotFoundException(`${nickname} is already a member of channel: ${channelName}`);
        if (channel.ispassword)
        {
            if (password !== undefined)
            {
                const bool = await  bcrypt.compare(channel.password,password)
                if (!bool)
                    throw new NotFoundException(`uncorrect password`);
            }
            else
                throw new NotFoundException(`channel require a password to join`);
        }
        // create new memberShip
        return await this.prisma.client.membershipChannel.create({
            data:{
                nickname:nickname,
                channel:{
                    connect:{
                        ChannelId:channel.ChannelId,
                    },
                },
                channelName:channel.channelName,
                login:user.login,
                user:{
                    connect:{
                        UserId:user.UserId
                    },
                },
            },
        });
    }

    // delete a memberShip
    async  deleteMemberShip(deleteMember:DeleteMemberChannelDto){
        const {channelName, login, loginDeleted} = deleteMember;
        const user = await this.userService.findUser({login:login});
        if (!user)
            throw new NotFoundException(`no such user with Login: ${login}`);
        const userDeleted = await this.userService.findUser({login:loginDeleted});
        if (!user)
            throw new NotFoundException(`no such user with Login: ${loginDeleted}`);
        const channel = await this.prisma.client.channel.findFirst({
                where:{
                    channelName:channelName,
                },
            });
        if (!channel)
            throw new NotFoundException(`no such channel: ${channelName}`);
        const LoginMember = await this.prisma.client.membershipChannel.findFirst({
            where:{
                login:login,
                channelName:channelName,
            },
        });
        const memberDeleted = await this.prisma.client.membershipChannel.findFirst({
            where:{
                login:loginDeleted,
                channelName:channelName,
            },
        });

        if (!memberDeleted || !LoginMember)
            throw new NotFoundException(`no such member on channel: ${channelName}`);
        if ((LoginMember.isAdmin  && !memberDeleted.isAdmin) || LoginMember.isOwner)
            return await this.prisma.client.membershipChannel.delete({
                where:{
                    MembershipId:memberDeleted.MembershipId,
                },
            });
        throw new NotFoundException(`cannot delete memberShip of  ${loginDeleted}`);
    }

    // update memberShip , you can mute , blacklist , change nickName , set member an admin
    async updateMemberShip(updateMember:updateMemberShipDto){
        const {userLogin, channelName, loginMemberAffected , isMute, isBlacklist, isOwner, isAdmin, nickname } = updateMember;

        const user = await this.userService.findUser({login:userLogin});
        const userAffected = await this.userService.findUser({login:loginMemberAffected});
        if (!userAffected)
            throw new NotFoundException(`no such user with Login: ${userAffected}`);

        const channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (!channel)
            throw new NotFoundException(`no such channel with the name ${channelName}`)

        const userMemberShip = await this.prisma.client.membershipChannel.findFirst({
            where:{
                login:userLogin,
                channelName:channel.channelName,
            },
        });
        let userAffectedMemberShip = await this.prisma.client.membershipChannel.findFirst({
            where:{
                login:loginMemberAffected,
                channelName:channel.channelName,
            },
        });

        if (!userAffectedMemberShip)
            throw new NotFoundException(`${loginMemberAffected} are not member`);

        if (isOwner !== undefined)
        {
            if (isOwner)
            {
                await this.prisma.client.channel.update({
                    where:{
                        ChannelId:channel.ChannelId,
                    },
                    data:{
                        LoginOwner:userAffected.login,
                    },
                });
                if (user && userMemberShip)
                {
                    await this.prisma.client.membershipChannel.update({
                        where:{
                            MembershipId:userMemberShip.MembershipId,
                        },
                        data:{
                            isOwner:false
                        }
                    })
                }
            }
            userAffectedMemberShip = await this.prisma.client.membershipChannel.update({
                where:{
                    MembershipId:userAffectedMemberShip.MembershipId,
                },
                data:{
                    isOwner:isOwner,
                },
            });
        }
        if (!user)
            throw new NotFoundException(`no such user with Login: ${userLogin}`);
        if (!userMemberShip)
            throw new NotFoundException(`${userLogin} are not member`);
        if  (!userMemberShip.isAdmin && userAffectedMemberShip.isOwner)
            throw new NotFoundException(`${userLogin} is not admin, or ${loginMemberAffected} is owner `);
        if (isMute !== undefined)
        {
            userAffectedMemberShip = await this.prisma.client.membershipChannel.update({
                where:{
                    MembershipId:userAffectedMemberShip.MembershipId,
                },
                data:{
                    isMute:isMute,
                },
            });
        }

        if (isBlacklist !== undefined)
        {
            userAffectedMemberShip = await this.prisma.client.membershipChannel.update({
                where:{
                    MembershipId:userAffectedMemberShip.MembershipId,
                },
                data:{
                    isBlacklist:isBlacklist,
                },
            });
        }


        if (isAdmin !== undefined)
        {
            userAffectedMemberShip = await this.prisma.client.membershipChannel.update({
                where:{
                    MembershipId:userAffectedMemberShip.MembershipId,
                },
                data:{
                    isAdmin:isAdmin,
                },
            });
        }

        if (nickname)
        {
            userAffectedMemberShip = await this.prisma.client.membershipChannel.update({
                where:{
                    MembershipId:userAffectedMemberShip.MembershipId,
                },
                data:{
                    nickname:nickname,
                },
            });
        }
        return userAffectedMemberShip;
    }

    // new messsage channel
    async newMsgChannel(msgDto:msgChannelDto){
        const {login, content, channelName} = msgDto;
        const user = await this.userService.findUser({login:login});
        if (!user)
            throw new NotFoundException(`no such user with Login: ${login}`);

        // check if there already an channel with same channelName
        const channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (!channel)
            throw new NotFoundException(`no such channel with the name ${channelName}`)

        // check if user is already on that channel
        const memberShip = await this.prisma.client.membershipChannel.findFirst({
            where:{
                userId:user.UserId,
                channelId:channel.ChannelId,
            },
        });
        if (!memberShip)
            throw new NotFoundException(`${login} is not a member on channel: ${channelName}`);

        // check if user is muted or blacklisted
        if (memberShip.isMute || memberShip.isBlacklist)
            throw new NotFoundException(`${login} is  a blacklisted or muted member on channel: ${channelName}`);
        return await this.prisma.client.msgChannel.create({
            data:{
                login: user.login,
                content: content,
                channel: {
                    connect: {
                        ChannelId: channel.ChannelId,
                    }
                },
                channelName: channel.channelName,
            },
        });
    }


    // get all channels
    async getAllChannels(){
        return await this.prisma.client.channel.findMany({
            where:{
                isPrivate:false,
            }
        });
    }

    // members of a channel
    async getMembersOfChannel(chDto:channeDto){
        const {channelName} = chDto;
        const channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (!channel)
            throw new NotFoundException(`no such channel with the name ${channelName}`);
        return await this.prisma.client.membershipChannel.findMany({
            where:{
                channelName:channel.channelName,
            },
        });
    }

    // get conversation  channel 
    async getConversationChannel(chDto:channeDto){
        const {channelName} = chDto;
        const channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });

        if (!channel)
            throw new NotFoundException(`no such channel with the name ${channelName}`);
        return await this.prisma.client.msgChannel.findMany({
            where:{
                channelName:channel.channelName,
            },
        });
    }

    // user's memberShips
    async getUserChannels(userDto:findUserDto){
        const {login} = userDto;
        const user = await this.userService.findUser({login:login});
        if (!user)
            throw new NotFoundException(`no such user with Login: ${login}`);
        return await this.prisma.client.membershipChannel.findMany({
            where:{
                login:user.login,
            },
        });
    }



}