import { Injectable } from "@nestjs/common";
import { AddChatUserDto, CreateChatroomDto, CreateDirectChatroomDto, CreateDirectMessageDto, InputChatroomMessageDto, WebsocketDto, WebsocketWithTimeDto } from "./dto/input.dto";
import { PrismaService } from "src/database/prisma.service";
import { DirectChatRoom, DirectMessage } from "@prisma/client";
import { response } from "express";
import { DirectChatRoomDto } from "./dto/output.dto";

@Injectable()
export class ChatroomRepository {
	constructor(private readonly prisma: PrismaService) { }

	async createChatroom(userId: string, dto: CreateChatroomDto): Promise<void> {
		let exist = await this.prisma.chatRoom.findUnique(
			{
				where: {
					name: dto.name,
				},
			}
		);

		if (exist) {
			return;
		}

		let chat = await this.prisma.chatRoom.create({
			data: {
				name: dto.name,
				type: dto.type,
				password: dto.password,
				photoUrl: dto.photoUrl,
				owner_id: userId,
				members: {
					connect: [
						{ id: userId },
					],
				},
				admin: {
					connect: [
						{ id: userId },
					],
				},
			},
		});
	}

	async deleteChatroom(name: string): Promise<any> {

		let response = await this.prisma.chatRoom.delete({
			where: {
				name: name,
			},
		});

		return true;
	}

	async updateChatroom(where_filter: any, data_filter: any): Promise<any> {
		let chat = await this.prisma.chatRoom.update({
			where: where_filter,
			data: data_filter,
		});
		return chat;
	}

	async openChatroom(name: string): Promise<any> {
		let chat = await this.prisma.chatRoom.findUnique({
			where: {
				name: name,
			},
			select: {
				id: true,
				name: true,
				photoUrl: true,
				owner: {
					select: {
						id: true,
						nickname: true,
						avatar: true,
					},
				},
				admin: {
					select: {
						id: true,
						nickname: true,
					},
				},
				members: {
					select: {
						id: true,
						nickname: true,
						avatar: true,
					},
				},
				banned_member: {
					select: {
						id: true,
						nickname: true,
						avatar: true,
						is_active: true,
					},
				},
				kicked_chatroom: {
					select: {
						userId: true,
						chatroom: true,
						kicked_time: true,
					},
				},
				message: {
					select: {
						id: true,
						content: true,
						img_url: true,
						user: {
							select: {
								nickname: true,
								avatar: true,
							},
						},
						createdAt: true,
					}
				}
			},
		});
		return chat;
	}

	async kickChatroom(data_filter: any): Promise<any> {

		let chat = await this.prisma.kickedChatroom.create({
			data: data_filter,
		});
		return chat;
	}


	async cleanKickedUserChatroom(where_filter: any): Promise<any> {
		await this.prisma.kickedChatroom.deleteMany({
			where: where_filter,
		});

		let chat = await this.prisma.kickedChatroom.findMany();

		return chat;
	}

	async findKickedUserChatroom(userId: string, chatroomId: string): Promise<any[]> {
		let chat = await this.prisma.kickedChatroom.findMany({
			where: {
				userId: {
					some: {
						id: userId,
					},
				},
				chatroom: {
					some: {
						id: chatroomId,
					},
				},
			},
			select: {
				userId: true,
				chatroom: true,
				kicked_time: true,
			},
		})

		return chat;
	}

	async muteChatroom(data_filter: any): Promise<any> {

		let chat = await this.prisma.muttedChatroom.create({
			data: data_filter,
		});
		return chat;
	}

	async cleanMuttedUserChatroom(where_filter: any): Promise<any> {
		await this.prisma.muttedChatroom.deleteMany({
			where: where_filter,
		});

		let chat = await this.prisma.muttedChatroom.findMany();

		return chat;
	}

	async findMutedUserChatroom(userId: string, chatroomId: string): Promise<any[]> {
		let chat = await this.prisma.muttedChatroom.findMany({
			where: {
				userId: {
					some: {
						id: userId,
					},
				},
				chatroom: {
					some: {
						id: chatroomId,
					},
				},
			},
			select: {
				userId: true,
				chatroom: true,
				mutted_time: true,
			},
		})

		return chat;
	}

	async findUniqueChatroom(name: string): Promise<any> {
		let chat = await this.prisma.chatRoom.findUnique({
			where: {
				name: name,
			},
			select: {
				id: true,
				name: true,
				photoUrl: true,
				type: true,
				password: true,
				owner: {
					select: {
						id: true,
						nickname: true,
						avatar: true,
						is_active: true,
					},
				},
				admin: {
					select: {
						id: true,
						nickname: true,
						avatar: true,
						is_active: true,
					},
				},
				members: {
					select: {
						id: true,
						nickname: true,
						avatar: true,
						is_active: true,
					},
				},
				banned_member: {
					select: {
						id: true,
						nickname: true,
						avatar: true,
						is_active: true,
					},
				},
				kicked_chatroom: {
					select: {
						userId: true,
						chatroom: true,
						kicked_time: true,
					},
				},
				mutted_chatroom: {
					select: {
						userId: true,
						chatroom: true,
						mutted_time: true,
					},
				},
				message: {
					select: {
						id: true,
						content: true,
						img_url: true,
						user: {
							select: {
								nickname: true,
								avatar: true,
								id: true,
							},
						},
						createdAt: true,
					},
				},
			},
		});
		return chat;
	}

	async findManyChatroom(where_filter: any): Promise<any> {
		let response = await this.prisma.chatRoom.findMany({
			where: where_filter,
			select: {
				id: true,
				name: true,
				type: true,
				photoUrl: true,
				owner: {
					select: {
						nickname: true,
						id: true,
					},
				},
				members: {
					select: {
						nickname: true,
					},
				},
				banned_member: {
					select: {
						id: true,
						nickname: true,
						avatar: true,
						is_active: true,
					},
				},
				kicked_chatroom: {
					select: {
						userId: true,
						chatroom: true,
						kicked_time: true,
					},
				},
				mutted_chatroom: {
					select: {
						userId: true,
						chatroom: true,
						mutted_time: true,
					},
				},
			},
		});
		return response;
	}

	async createChatroomMessage(dto: InputChatroomMessageDto): Promise<any> {
		let msg = await this.prisma.message.create({
			data: {
				content: dto.content,
				chat_room: {
					connect: {
						id: dto.chatId,
					},
				},
				user: {
					connect: {
						id: dto.user_id,
					},

				},
			},
			select: {
				id: true,
				content: true,
				user: {
					select: {
						id: true,
						nickname: true,
						avatar: true,
						is_active: true,
					},
				},
				createdAt: true,
			},
		});
		return msg;
	}


	async openDirectChatRoom(chat_name: string): Promise<DirectChatRoom> {
		await this.prisma.directChatRoom.create({
			data: {
				name: chat_name,
			},
		});
		let response = await this.prisma.directChatRoom.findUnique({
			where: {
				name: chat_name,
			}
		});

		return response;
	}

	async findDirectChatroom(name: string): Promise<DirectChatRoom> {
		let chat = this.prisma.directChatRoom.findUnique({
			where: {
				name: name,
			},
		});
		return chat;
	}

	async createDirectMessage(chat: string, dto: CreateDirectMessageDto): Promise<any> {

		let msg = await this.prisma.directMessage.create({
			data: {
				direct_chat_room: {
					connect: {
						name: chat,
					},
				},
				user: {
					connect: {
						nickname: dto.my_nickname,
					},
				},
				// img_url: dto.img_url,
				content: dto.content,
			},
			select: {
				id: true,
				content: true,
				direct_chat_room: {
					select: {
						name: true
					},
				},
				user: {
					select: {
						id: true,
						nickname: true,
						avatar: true,
						is_active: true,
					}
				},
				createdAt: true,
			},
		});
		return msg;
	}

	async updateDirectChatroom(chat_name: string, dto: CreateDirectChatroomDto): Promise<any> {

		let response = await this.prisma.directChatRoom.update({
			where: {
				name: chat_name,
			},
			data: {
				blocked: {
					connect: {
						nickname: dto.other_nickname,
					},
				},
			},
		});
		return response;
	}

	async findAllDirectMessage(name: string): Promise<any> {

		let response = await this.prisma.directMessage.findMany({
			where: {
				direct_chat_room_name: name,
			},
			orderBy: {
				createdAt: 'asc',
			},
			select: {
				id: true,
				content: true,
				user: {
					select: {
						id: true,
						nickname: true,
						avatar: true,
						is_active: true,
					},
				},
				createdAt: true,
			},
		});
		return response;
	}
}
