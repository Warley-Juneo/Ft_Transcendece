import { ConsoleLogger, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { UserResumeDto, UserProfileDto, UserLadderDto } from './dtos/output.dtos';
import { CreateUserDto } from './dtos/createUser.dto';
import { GameService } from 'src/game/game.service';
import { AddFriendDto, ProfileDto, UpdateCoinsDto, UpdateProfileDto, UpdateTwoFADto } from './dtos/input.dtos';
import * as fs from 'fs';
import * as path from 'path';
const sharp = require('sharp');


@Injectable()
export class UsersService {
	constructor(private readonly userRepository: UsersRepository,
		private readonly gameService: GameService) { }


	async createUser(dto: CreateUserDto): Promise<User> {
		let pathfile = path.join(process.cwd(), "src/", "avatarUploads/", "standard.jpg")
		const fileContent = fs.readFileSync(pathfile, 'base64');
		dto.avatar = fileContent;
		let user = await this.userRepository.createUser(dto);
		return user;
	}


	async resizeImageTo18KB(imagePath: string): Promise<void> {
		try {
			const buffer = await fs.promises.readFile(imagePath);
			const resizedBuffer = await sharp(buffer).resize({ width: 384, height: 384 }).toBuffer();
			await fs.promises.writeFile(imagePath, resizedBuffer);

		} catch (error) {
			throw error;
		}
	}

	async uploadAvatar(fileName: string, userId: string): Promise<Buffer> {
		try {
			const pathToImage = path.join(process.cwd(), "src", "avatarUploads", fileName);

			await this.resizeImageTo18KB(pathToImage);

			const avatarBase64 = await fs.promises.readFile(pathToImage, 'base64');
			const user = await this.userRepository.uploadAvatar(avatarBase64, userId);

			await fs.promises.unlink(pathToImage);

			return Buffer.from(user.avatar, 'base64');
		} catch (error) {
			throw error;
		}
	}

	// TODO: Create this Route. Add photo upload
	async uploadPhoto(user_id: string, avatar: string): Promise<void> {
		const base64Data = avatar.replace(/^data:image\/png;base64,/, "");
		const uploadDir = path.resolve(__dirname, '..', 'uploads');
		const uploadPhotoPath = path.resolve(__dirname, '..', 'uploads', `${user_id}.png`);

		try {
			if (!fs.existsSync(uploadDir)) {
				await fs.promises.mkdir(uploadDir, { recursive: true });
			}
			await fs.promises.writeFile(uploadPhotoPath, base64Data, 'base64');
		} catch (error) {
			throw new Error(`\n\nError saving file: ${error.message}`); //TODO: change to custom error
		}
	}

	async updatetwoFA(user_id: string, dto: UpdateTwoFADto): Promise<UserResumeDto> {

		let where_filter = {
			id: user_id,
		}
		
		let data_filter: any = {
			twoFA: dto.twoFA,
		};

		let user = await this.userRepository.updateUser(user_id, data_filter);

		return new UserResumeDto(user);
	}
	
	async updateProfile(user_id: string, dto: UpdateProfileDto): Promise<UserResumeDto> {
		
		let user: User;

		let where_filter = {
			id: user_id,
		}

		let data_filter = {
			avatar_name: dto.avatar_name,
		} 	
		user = await this.userRepository.updateUser(where_filter, data_filter);

		return new UserResumeDto(user);
	}

	async updateCoins(userId: string, dto: UpdateCoinsDto): Promise<UserResumeDto> {
		const user = await this.userRepository.updateCoins(userId, dto);
		return new UserResumeDto(user);
	}

	async fillUserResumeDto(Data: any): Promise<UserResumeDto[]> {
		let outputUsersResumeDto: UserResumeDto[] = [];

		for (const obj of Data) {
			outputUsersResumeDto.push(new UserResumeDto(obj));
		};
		return outputUsersResumeDto;
	}

	async addFriend(userId: string, nick_name: AddFriendDto): Promise<UserResumeDto[]> {
		let friends = await this.userRepository.addFriend(userId, nick_name);
		return friends ? await this.fillUserResumeDto(friends) : null;
	}

	async deleteFriend(userId: string, nick_name: AddFriendDto): Promise<UserResumeDto[]> {
		let friends = await this.userRepository.deleteFriend(userId, nick_name);
		return friends ? await this.fillUserResumeDto(friends) : null;
	}

	async findUserAuth(userEmail: string): Promise<User> {
		return await this.userRepository.findUserAuth(userEmail);
	}

	async findUser(userId: string): Promise<User> {
		return await this.userRepository.findUser(userId);
	}

	async findFriends(userId: string): Promise<UserResumeDto[]> {
		let user = await this.userRepository.findUserWithFriends(userId);
		return user ? await this.fillUserResumeDto(user.friends) : null;
	}

	async findUserAll(): Promise<UserResumeDto[]> {
		let users = await this.userRepository.findAllUsers();
		return users ? await this.fillUserResumeDto(users) : null;
	}

	async findOnlineUsers(userId: string): Promise<UserResumeDto[]> {
		let users = await this.userRepository.findOnlineUsers(userId);
		return users ? await this.fillUserResumeDto(users) : null;
	}

	async findProfile(dto: ProfileDto): Promise<UserProfileDto> {
		let user = await this.userRepository.findUserByNickname(dto.nick_name);
		let wins = await this.gameService.numberOfUserMatchWins(user.id);
		let loses = await this.gameService.numberOfUserMatchLoses(user.id);
		let draws = await this.gameService.numberOfUserMatchDraws(user.id);
		let ladder = await this.userRepository.findAllUsers();

		const position = ladder.findIndex(u => u.id === user.id) + 1;
		let objaux = { ...user, wins, loses, draws, position }
		return new UserProfileDto(objaux);
	}

	async ladder(): Promise<UserLadderDto[]> {
		let ladder = await this.userRepository.ladder();
		let outputLadderDto: UserLadderDto[] = [];

		for (const obj of ladder) {
			const position = ladder.findIndex(u => u.nickname === obj.nickname) + 1;
			const objAux = { ...obj, ladder: position }
			outputLadderDto.push(new UserLadderDto(objAux));
		};
		return outputLadderDto;
	}

	async userSocketConnect(userId: string): Promise<any> {

		let where_filter = {
			id: userId,
		};
		let data_filter: any = {
			is_active: true,
			match_status: "NONE",
		};
		let user = await this.userRepository.updateUser(where_filter, data_filter);
	}

	async userSocketDisconnect(userId: string): Promise<any> {

		let where_filter = {
			id: userId,
		};
		let data_filter: any = {
			is_active: false,
			match_status: "NONE",
		};
		let user = await this.userRepository.updateUser(where_filter, data_filter);
	}

}
