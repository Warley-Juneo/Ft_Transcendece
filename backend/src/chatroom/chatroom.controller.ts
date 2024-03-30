import { Controller, Body, Post, Req, Get, Delete, Query } from '@nestjs/common';
import { ChangePasswordDto, CreateChatroomDto, InputChatroomDto, RemovePasswordDto } from './dto/input.dto';
import { ChatroomService } from './chatroom.service';
import { CreateDirectChatroomDto, ChatUserDto } from './dto/input.dto';
import { ChatroomsDto, OutputDirectMessageDto, UniqueChatroomDto } from './dto/output.dto';

@Controller('chatroom')
export class ChatroomController {
	constructor(private readonly chatroomService: ChatroomService) { }

	@Get('find-all-public')
	async findAllPublicChatrooms(): Promise<ChatroomsDto> {
		return await this.chatroomService.findAllPublicChatrooms();
	}

	@Get('find-public')
	async findPublicChatroom(@Query() dto: InputChatroomDto): Promise<UniqueChatroomDto> {
		return await this.chatroomService.findPublicChatroom(dto);
	}

	@Get('find-private')
	async	findPrivateChatroom(@Req() request): Promise<ChatroomsDto> {
		return await this.chatroomService.findPrivateChatroom(request.user.sub);
	}

	@Post('change-password-group')
	async	changePassword(@Req() request, @Body() dto: ChangePasswordDto): Promise<any> {
		return await this.chatroomService.changePassword(request.user.sub, dto);
	}

	@Post('remove-password-group')
	async	removePassword(@Req() request, @Body() dto: RemovePasswordDto): Promise<any> {
		return await this.chatroomService.removePassword(request.user.sub, dto);
	}

	@Post('open-group')
	async	openChatroom(@Req() request, @Body() dto: InputChatroomDto): Promise<UniqueChatroomDto> {
		return await this.chatroomService.openChatroom(request.user.sub, dto);
	}

	@Post('open-direct')
	async openDirectChatroom(@Body() dto: CreateDirectChatroomDto): Promise<OutputDirectMessageDto[]> {
		return await this.chatroomService.openDirectChatroom(dto);
	}

}
