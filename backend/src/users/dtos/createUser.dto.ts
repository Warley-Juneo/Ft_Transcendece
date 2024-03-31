import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
	
	@IsNotEmpty()
	login: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	first_name: string;

	@IsNotEmpty()
	last_name: string;

	@IsNotEmpty()
	nickname: string;

	avatar: string; //trocar aqui para o tipo File

	avatar_name: string;
}