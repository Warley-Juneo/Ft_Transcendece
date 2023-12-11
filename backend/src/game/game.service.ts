import { Injectable } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { UserMatchDto } from './dtos/output.dto';
import { DisconnectDto, InputUserDto } from './dtos/input.dto';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class GameService {
	constructor(private readonly gameRepository: GameRepository) { }

	async getStatusMatch(player_1, player_2) {
		if (player_1 === player_2) {
			return "EMPATE";
		} else if (player_1 > player_2) {
			return "VITÓRIA";
		} else {
			return "DERROTA";
		}
	}

	async userMatchs(dto: InputUserDto): Promise<UserMatchDto[]> {
		let matches = await this.gameRepository.userMatchs(dto.user_id);
		let outpuDto: UserMatchDto[] = [];

		for (const obj of matches) {
			let match_dto = new UserMatchDto;
			if (dto.user_id == obj.player_1.id) {
				match_dto.id = obj.id;
				match_dto.opponent = obj.player_2.nickname;
				match_dto.opponent_avatar = obj.player_2.avatar;
				match_dto.opponent_score = obj.score_p2;
				match_dto.my_score = obj.score_p1;
				match_dto.status = await this.getStatusMatch(obj.score_p1, obj.score_p2);
			}
			else {
				match_dto.id = obj.id;
				match_dto.opponent = obj.player_1.nickname;
				match_dto.opponent_avatar = obj.player_1.avatar;
				match_dto.opponent_score = obj.score_p1;
				match_dto.my_score = obj.score_p2;
				match_dto.status = await this.getStatusMatch(obj.score_p2, obj.score_p1);
			}
			outpuDto.push(match_dto);
		}
		return outpuDto;
	}

	async userPhoto(file: any, nickname: string): Promise<string> {

		try {
			const uploadFolder = path.resolve(__dirname, '..', 'uploads');
			if (!fs.existsSync(uploadFolder)) {
				fs.mkdirSync(uploadFolder); // Crie a pasta 'uploads', se ela não existir
			}
			const extension = path.extname(file.originalname);
			const FilePath = path.resolve(uploadFolder, `${nickname}${extension}`);

			fs.writeFileSync(FilePath, file.buffer);
			return `Foto do usuário salva com sucesso em: ${FilePath}`;
		} catch (error) {
			console.error('Erro ao salvar a foto:', error);
			throw new Error('Erro ao salvar a foto'); // Lançar uma exceção para o cliente
		}
	}

	async numberOfUserMatchWins(userId: string): Promise<number> {
		return this.gameRepository.numberOfUserMatchWins(userId);
	}

	async numberOfUserMatchLoses(userId: string): Promise<number> {
		return this.gameRepository.numberOfUserMatchLoses(userId);
	}

	async numberOfUserMatchDraws(userId: string): Promise<number> {
		return this.gameRepository.numberOfUserMatchDraws(userId);
	}

	async disconnect(data: DisconnectDto): Promise<void> {
		return this.gameRepository.updateStatusUser(data);
	}
}
