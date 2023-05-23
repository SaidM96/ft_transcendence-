import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ChannelDto, MemberChannelDto, getConvDto, msgChannelDto, sendMsgDto } from './Dto/chat.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt'
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
        if ((!userA || !userB) && (userA.login == userB.login))
            throw new NotFoundException();
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
        const {channelName, nickname, LoginOwner, ispassword, password} = channelDto;
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
 
    // create new MemberChannel
    async createMemberChannel(memberChannelDto:MemberChannelDto){
        const {nickname, channelName, login} = memberChannelDto;
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

    // new messsage channel
    async newMsgChannel(msgDto:msgChannelDto){
        const {login, content, channelName} = msgDto;
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

    

    


}