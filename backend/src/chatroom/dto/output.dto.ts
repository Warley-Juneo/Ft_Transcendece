export class OutputDirectMessageDto {
	id: string;
	content: string;
	img_url: string;
	user: UniqueUserChatrommDto;
	date: Date;

	constructor(obj: any) {
		this.id = obj.id;
		this.content = obj.content;
		this.img_url = obj.img_url;
		this.user = obj.user;
		this.date = obj.createdAt;
	}
}


export class DirectChatRoomDto {
	id:                  string;
  	name:                string;
  	blocked_nickname:    string;

	constructor(obj: any) {
		this.id = obj.id;
		this.name = obj.name,
		this.blocked_nickname = obj.blocked.nickname;
	}
}

// export class OutputDirectMessagesDto {
// 	direct_message: OutputDirectMessageDto[];
// }

export class OutputMessageDto extends OutputDirectMessageDto {
}

export class ChatroomsDto {
	chatrooms: UniqueChatroomDto[];
}

export class UniqueUserChatrommDto {
	id: string;
	nickname: string;
	avatar_name: string;
	avatar: string;
	is_active: boolean;
}

export class KickedChatroomDto {
	userId: 		UniqueUserChatrommDto[];
	chatroom: 		UniqueChatroomDto[];
	kicked_time:	Date;
}

export class MuttedChatroomDto {
	userId: 		UniqueUserChatrommDto[];
	chatroom: 		UniqueChatroomDto[];
	mutted_time:	Date;
}

export class UniqueChatroomDto {
	id: string;
	name: string;
	type: string;
	password: string;
	photoUrl: string;
	owner_nickname: string;
	owner_id: string;
	members: UniqueUserChatrommDto[];
	admin: UniqueUserChatrommDto[];
	banned: UniqueUserChatrommDto[];
	kicked: KickedChatroomDto[];
	mutted: MuttedChatroomDto[];
	message: OutputMessageDto[];

	constructor(obj: any) {
		this.id = obj.id;
		this.name = obj.name;
		this.type = obj.type;
		this.password = obj.password;
		this.photoUrl = obj.photoUrl;
		this.owner_nickname = obj.owner.nickname;
		this.owner_id = obj.owner.id;
		this.members = obj.members;
		this.admin = obj.admin;
		this.banned = obj.banned_member;
		this.mutted = obj.mutted_chatroom
		this.kicked = obj.kicked_chatroom;
		this.message = obj.message;
	}
}

export class OutputValidateDto {

	owner_id:			string;
	validate_owner_id:	string;
	exclued_owner_id:	string;

	members:			UniqueUserChatrommDto[];
	validate_member_id:	string;

	admin:				UniqueUserChatrommDto[];
	validate_admin_id:	string;

	password:			string;
	validate_password:	string;
	new_password:		string;
	confirm_password:	string;
}
