import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ChatroomRepository } from './chatroom.repository';
import { DirectChatRoom } from '@prisma/client';
import { ChangePasswordDto, CreateChatroomDto, CreateDirectChatroomDto, CreateDirectMessageDto, DeleteChatroomDto, InputChatroomDto, InputChatroomMessageDto, RemovePasswordDto, WebsocketDto, WebsocketWithTimeDto } from './dto/input.dto';
import { ChatroomsDto, DirectChatRoomDto, OutputDirectMessageDto, OutputMessageDto, OutputValidateDto, UniqueChatroomDto } from './dto/output.dto';
import * as bcrypt from 'bcrypt';
import { map } from 'rxjs';
import { itxClientDenyList } from '@prisma/client/runtime/library';

@Injectable()
export class ChatroomService {
	constructor(private readonly chatroomRepository: ChatroomRepository,
		private readonly userService: UsersService) { }

	async validate(dto: OutputValidateDto): Promise<OutputValidateDto> {

		if (dto.owner_id && dto.validate_owner_id) {
			if ((dto.owner_id !== dto.validate_owner_id)) {
				throw new UnauthorizedException('Only the owner can delete the chat');
			}
		}
		if (dto.owner_id && dto.exclued_owner_id) {
			if ((dto.owner_id == dto.validate_owner_id)) {
				throw new UnauthorizedException('The owner can not be excluded');
			}
		}

		if (dto.password) {

			if (!await bcrypt.compare(dto.validate_password, dto.password)) {
				throw new UnauthorizedException('Password incorrect')
			}
			if (dto.new_password != dto.confirm_password) {
				throw new BadRequestException('Invalid password confirmation.')
			}
		}

		if (dto.validate_member_id) {
			let member = '';
			for (const obj of dto.members) {
				if (dto.validate_member_id == obj.id) {
					return dto;
				}
			}
			throw new UnauthorizedException('Not a user of this chat');
		}

		if (dto.validate_admin_id) {
			let member = '';
			for (const obj of dto.admin) {
				if (dto.validate_admin_id == obj.id) {
					return dto;
				}
			}
			throw new UnauthorizedException('Not a admin of this chat');
		}
		return dto;
	}

	async createChatroom(userId: string, dto: CreateChatroomDto): Promise<ChatroomsDto> {
		if (dto.type == "protected") {
			if (dto.password == '') {
				throw new BadRequestException('Invalid password');
			}
			console.log("dto: ", dto.password);
			const saltOrRound = 8;
			const hash = bcrypt.hashSync(dto.password, saltOrRound);
			dto.password = hash;
		}
		await this.chatroomRepository.createChatroom(userId, dto);
		let response = await this.findAllPublicChatrooms();

		return response;
	}

	async upLoadPhoto(imageBuffer:Buffer, chatId: string) {
		const photo = imageBuffer.toString('base64');

		let where_filter = {
			name: chatId,
		};
		let data_filter = {
			photo: photo,
		};
		await this.chatroomRepository.updateChatroom(where_filter, data_filter);
		
	}

	async deleteChatroom(userId: string, dto: DeleteChatroomDto): Promise<any> {

		let chat = await this.findUniqueChatroom(dto.chat_name);

		let data_validation: OutputValidateDto = {} as OutputValidateDto;
		data_validation.validate_owner_id = userId;
		data_validation.owner_id = chat.owner_id;
		await this.validate(data_validation);

		await this.chatroomRepository.deleteChatroom(dto.chat_name);

		let response = await this.findAllPublicChatrooms();

		return response;
	}

	async openChatroom(userId: string, dto: InputChatroomDto): Promise<UniqueChatroomDto> {

		let now: Date = new Date();

		let where_filter = {
			kicked_time: {
				lte: now,
			},
		};
		await this.chatroomRepository.cleanKickedUserChatroom(where_filter);

		let mute_where_filter = {
			mutted_time: {
				lte: now,
			},
		};
		let test = await this.chatroomRepository.cleanMuttedUserChatroom(mute_where_filter);


		let chat: UniqueChatroomDto = await this.findUniqueChatroom(dto.chat_name);
		
		chat.banned.forEach(async element => {
			console.log("banned item: ", element);
		});
		
		chat.kicked.forEach(async element => {
			console.log("kiked item: ", element);
		});
		console.log("cheguei aqui");

		if (chat.banned.find((item) => item.id == userId)) {
			throw new UnauthorizedException("You were banned of this chat!!!")
		}

		if (chat.kicked.find((item) => item.userId.find((item) => item.id == userId))) {
			console.log("eu fui kikado");
			throw new UnauthorizedException("Você foi temporariamente kickado desse chat!!!")
		}


		if (chat.type == "protected") {
			if (!await bcrypt.compare(dto.password, chat.password)) {
				throw new UnauthorizedException('Password incorrect')
			}
		}
		if (chat.type == "private") {
			if (!chat.members.find((item) => item.id == userId)) {
				throw new UnauthorizedException("You are not a member of this group")
			}
		}
		return chat;
	}

	async changePassword(userId: string, dto: ChangePasswordDto): Promise<any> {

		let chat = await this.findUniqueChatroom(dto.chat_name);

		if (!dto.new_password || !dto.new_password) {
			throw new BadRequestException('Invalid password.')
		}
		let data_validation: OutputValidateDto = {} as OutputValidateDto;
		data_validation.validate_password = dto.old_password;
		data_validation.password = chat.password;
		data_validation.new_password = dto.new_password;
		data_validation.confirm_password = dto.confirm_password;
		data_validation.owner_id = chat.owner_id;
		data_validation.validate_owner_id = userId;
		await this.validate(data_validation);

		const saltOrRound = 8;
		const hash = await bcrypt.hashSync(dto.new_password, saltOrRound);

		let where_filter = {
			name: chat.name,
		};
		let data_filter = {
			password: hash,
		};
		await await this.chatroomRepository.updateChatroom(where_filter, data_filter);
	}

	async removePassword(userId: string, dto: RemovePasswordDto): Promise<any> {

		let chat = await this.findUniqueChatroom(dto.chat_name);

		if (!dto.password || !dto.password) {
			throw new BadRequestException('Invalid password.')
		}
		let data_validation: OutputValidateDto = {} as OutputValidateDto;
		data_validation.validate_password = dto.password;
		data_validation.password = chat.password;
		data_validation.new_password = ""; // necessario para validate function
		data_validation.confirm_password = ""; // necessario para validate function
		data_validation.owner_id = chat.owner_id;
		data_validation.validate_owner_id = userId;
		await this.validate(data_validation);

		let where_filter = {
			name: chat.name,
		};
		
		let data_filter
		if (chat.type == "private") {
			data_filter = {
				password: "",
			};
		}
		if (chat.type == "protected") {
			data_filter = {
				password: "",
				type: "public"
			};
		}

		await await this.chatroomRepository.updateChatroom(where_filter, data_filter);
	}

	async addAdmChatroom(userId: string, dto: WebsocketDto): Promise<UniqueChatroomDto> {

		let chat = await this.findUniqueChatroom(dto.chat_name);

		if (chat.owner_id != userId) {
			if (!chat.admin.find((item) => item.id == userId)) {
				throw new UnauthorizedException("You are not adm of this group")
			}
			if (!chat.members.find((item) => item.id == dto.other_id)) {
				throw new UnauthorizedException("You can not add a adm that is not a member of this group")
			}
		}

		let where_filter = {
			name: chat.name,
		};
		let data_filter = {
			admin: {
				connect: {
					id: dto.other_id,
				},
			},
			banned_member: {
				disconnect: {
					id: dto.other_id,
				},
			},
		};
		await this.chatroomRepository.updateChatroom(where_filter, data_filter);

		let response = await this.findUniqueChatroom(dto.chat_name);
		response.password = '';

		return response;
	}

	async removeAdmChatroom(userId: string, dto: WebsocketDto): Promise<UniqueChatroomDto> {

		let chat = await this.findUniqueChatroom(dto.chat_name);

		if (chat.owner_id == dto.other_id) {
			throw new UnauthorizedException("You can not remove the owner from adm")
		}

		if (chat.owner_id != userId) {
			if (!chat.admin.find((item) => item.id == userId)) {
				throw new UnauthorizedException("You are not adm of this group");
			}
			if (chat.admin.find((item) => item.id == dto.other_id)) {
				throw new UnauthorizedException("You can not ban a adm from this group");
			}
		}

		let where_filter = {
			name: chat.name,
		};
		let data_filter = {
			admin: {
				disconnect: {
					id: dto.other_id,
				},
			},
		};
		await this.chatroomRepository.updateChatroom(where_filter, data_filter);

		let response = await this.findUniqueChatroom(dto.chat_name);
		response.password = '';

		return response;
	}

	async addMemberChatroom(userId: string, dto: WebsocketDto): Promise<UniqueChatroomDto> {

		let chat = await this.findUniqueChatroom(dto.chat_name);

		if (chat.type == "private") {
			if (!chat.admin.find((item) => item.id == userId)) {
				throw new UnauthorizedException("You are not adm of this group")
			}
		}

		let where_filter = {
			name: chat.name,
		};
		let data_filter = {
			members: {
				connect: {
					id: dto.other_id,
				},
			},
			banned_member: {
				disconnect: {
					id: dto.other_id,
				},
			},

		};
		await this.chatroomRepository.updateChatroom(where_filter, data_filter);

		let other_where_filter = {
			AND: [
				{
					userId: {
						some: {
							id: dto.other_id,
						},
					},
				},
				{
					chatroom: {
						some: {
							id: dto.chat_id,
						},
					},
				},
			],
		};
		await this.chatroomRepository.cleanKickedUserChatroom(other_where_filter);
		await this.chatroomRepository.cleanMuttedUserChatroom(other_where_filter);

		let response = await this.findUniqueChatroom(dto.chat_name);
		response.password = '';
		return response;
	}

	async banMemberChatroom(userId: string, dto: WebsocketDto): Promise<UniqueChatroomDto> {
		let chat = await this.findUniqueChatroom(dto.chat_name);

		if (chat.owner_id == dto.other_id) {
			throw new UnauthorizedException("You can not ban the owner of the chatroom")
		}

		if (chat.owner_id != userId) {
			if (!chat.admin.find((item) => item.id == userId)) {
				throw new UnauthorizedException("You are not adm of this group");
			}
			if (chat.admin.find((item) => item.id == dto.other_id)) {
				throw new UnauthorizedException("You can not ban a adm from this group");
			}
		}
		let where_filter = {
			name: chat.name,
		};
		let data_filter = {
			banned_member: {
				connect: {
					id: dto.other_id,
				},
			},
			members: {
				disconnect: {
					id: dto.other_id,
				},
			},
			admin: {
				disconnect: {
					id: dto.other_id,
				},
			},
		};
		await this.chatroomRepository.updateChatroom(where_filter, data_filter);

		let response = await this.findUniqueChatroom(dto.chat_name);
		response.password = '';
		return response;

	}

	async kickMemberChatroom(userId: string, dto: WebsocketWithTimeDto): Promise<any> {
		let chat = await this.findUniqueChatroom(dto.chat_name);

		if (chat.owner_id == dto.other_id) {
			throw new UnauthorizedException("You can not ban the owner of the chatroom")
		}

		if (chat.owner_id != userId) {
			if (!chat.admin.find((item) => item.id == userId)) {
				throw new UnauthorizedException("You are not adm of this group");
			}
			if (chat.admin.find((item) => item.id == dto.other_id)) {
				throw new UnauthorizedException("You can not ban a adm from this group");
			}
		}

		// if (!chat.members.find((item) => item.id == dto.other_id)) {
		// 	throw new UnauthorizedException("You can not kick a non member");
		// }

		let kicked = await this.chatroomRepository.findKickedUserChatroom(dto);

		if (kicked.find((item) => item)) {
			throw new UnauthorizedException("User already kicked");
		}

		let now = new Date();
		let time: Date = new Date(now.getTime() + dto.time * 60 * 60 * 1000);

		let data_filter = {
			userId: {
				connect: {
					id: dto.other_id,
				},
			},
			chatroom: {
				connect: {
					id: dto.chat_id,
				},
			},

			kicked_time: time,
		};

		let kick_chat = await this.chatroomRepository.kickChatroom(data_filter);

		let other_where_filter = {
			name: chat.name,
		};
		let other_data_filter = {
			members: {
				disconnect: {
					id: dto.other_id,
				},
			},
		};
		await this.chatroomRepository.updateChatroom(other_where_filter, other_data_filter);

		let response = await this.findUniqueChatroom(dto.chat_name);
		console.log("usuario kikado: ", response);
		response.password = '';
		return response;
	}

	async muteMemberChatroom(userId: string, dto: WebsocketWithTimeDto): Promise<any> {
		
		console.log("\nMUTE USER....\n");
		let chat = await this.findUniqueChatroom(dto.chat_name);

		if (chat.owner_id == dto.other_id) {
			throw new UnauthorizedException("You can not mute the owner of the chatroom")
		}

		if (chat.owner_id != userId) {
			if (!chat.admin.find((item) => item.id == userId)) {
				throw new UnauthorizedException("You are not adm of this group");
			}
			if (chat.admin.find((item) => item.id == dto.other_id)) {
				throw new UnauthorizedException("You can not mute a adm from this group");
			}
		}

		// if (!chat.members.find((item) => item.id == dto.other_id)) {
		// 	throw new UnauthorizedException("You can not mute a non member");
		// }

		let mutted = await this.chatroomRepository.findMutedUserChatroom(dto.other_id, dto.chat_id);

		if (mutted.find((item) => item)) {
			throw new UnauthorizedException("User already mutted");
		}

		let now = new Date();
		let time: Date = new Date(now.getTime() + dto.time * 60 * 60 * 1000);

		let data_filter = {
			userId: {
				connect: {
					id: dto.other_id,
				},
			},
			chatroom: {
				connect: {
					id: dto.chat_id,
				},
			},

			mutted_time: time,
		};

		let mute_chat = await this.chatroomRepository.muteChatroom(data_filter);

		let response = await this.findUniqueChatroom(dto.chat_name);
		response.password = '';
		return response;
	}

	async findUniqueChatroom(chat_name: string): Promise<UniqueChatroomDto> {

		let chat = await this.chatroomRepository.findUniqueChatroom(chat_name);

		if (!chat) {
			throw new BadRequestException('Chatroom do not exist');
		}

		let outputDto = new UniqueChatroomDto(chat);
		outputDto.message = [];
		for (const obj of chat.message) {
			outputDto.message.push(new OutputMessageDto(obj));
		}
		return outputDto;
	}

	async findAllPublicChatrooms(): Promise<ChatroomsDto> {

		let where_filter = {
			type: { not: "private" },
		};
		return await this.findManyChatroom(where_filter);
	}

	async findPublicChatroom(dto: InputChatroomDto): Promise<UniqueChatroomDto> {
		return this.findUniqueChatroom(dto.chat_name);
	}

	async findPrivateChatroom(userId: string): Promise<ChatroomsDto> {

		let where_filter = {
			members: {
				some: {
					id: userId,
				},
			},
			type: "private",
		};
		return await this.findManyChatroom(where_filter);
	}

	async findManyChatroom(where_filter: any): Promise<ChatroomsDto> {

		let chats = await this.chatroomRepository.findManyChatroom(where_filter);

		let outputDto = new ChatroomsDto;
		outputDto.chatrooms = [];

		for (const obj of chats) {
			obj.members = obj.members.map(user => user.id);
			let dto = new UniqueChatroomDto(obj);
			outputDto.chatrooms.push(new UniqueChatroomDto(obj));
		}

		return outputDto;
	}

	async createChatroomMessage(dto: InputChatroomMessageDto): Promise<OutputMessageDto> {

		let mutted = await this.chatroomRepository.findMutedUserChatroom(dto.user_id, dto.chatId)
		if (mutted.length != 0) {
			throw new UnauthorizedException("Você esta temporariamente mutado!!")
		}
		let msg = await this.chatroomRepository.createChatroomMessage(dto);
		return new OutputMessageDto(msg);
	}

	async getChatroomMessage(dto: CreateDirectChatroomDto): Promise<{ chat: DirectChatRoom, name: string }> {
		let name = dto.other_nickname + dto.my_nickname;
		if (dto.my_nickname.localeCompare(dto.other_nickname) < 0) {
			name = dto.my_nickname + dto.other_nickname;
		}
		let chat: DirectChatRoom = await this.chatroomRepository.findDirectChatroom(name);
		return { chat, name };
	}

	async openDirectChatroom(dto: CreateDirectChatroomDto): Promise<OutputDirectMessageDto[]> {
		let { chat, name } = await this.getChatroomMessage(dto);

		if (!chat) {
			chat = await this.chatroomRepository.openDirectChatRoom(name);
		}
		if (chat.blocked_id) {
			if (chat.blocked_id == dto.my_nickname) {
				throw new UnauthorizedException("O chat foi bloqueado pelo outro tripulante!!")
			}
			else {
				throw new UnauthorizedException("Você bloqueou esse chat!!")
			}
		}

		return await this.findAllDirectMessage(name);
	}

	async createDirectMessage(dto: CreateDirectMessageDto): Promise<OutputDirectMessageDto> {
		let { chat, name } = await this.getChatroomMessage(dto);

		if (!chat) {
			throw new BadRequestException('chat name do not exist.');
		}

		let msg = await this.chatroomRepository.createDirectMessage(name, dto);

		let outpuDto = new OutputDirectMessageDto(msg);
		return outpuDto;
	}

	async directChatroomBlock(dto: CreateDirectChatroomDto): Promise<void> {

		await this.openDirectChatroom(dto);

		let name = dto.other_nickname + dto.my_nickname;
		if (dto.my_nickname.localeCompare(dto.other_nickname) < 0) {
			name = dto.my_nickname + dto.other_nickname;
		};

		let response = await this.chatroomRepository.updateDirectChatroom(name, dto);
	}

	async findAllDirectMessage(name: string): Promise<OutputDirectMessageDto[]> {
		let msg = await this.chatroomRepository.findAllDirectMessage(name);

		let outputDto: OutputDirectMessageDto[] = [];

		for (const obj of msg) {
			outputDto.push(new OutputDirectMessageDto(obj));
		}

		return outputDto;
	}
}
