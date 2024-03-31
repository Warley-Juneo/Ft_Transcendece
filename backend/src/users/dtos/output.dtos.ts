
export class UserProfileDto {
  login: string;
  email: string;

  first_name: string;
  last_name: string;
  nickname: string;
  avatar: string; //trocar aqui para o tipo File

  wins: number;
  loses: number;
  draws: number;
  ladder: number;

  constructor(obj: any) {
	this.login = obj.login;
    this.avatar = obj.avatar;
    this.first_name = obj.first_name;
    this.last_name = obj.last_name;
    this.nickname = obj.nickname;
    this.wins = obj.wins;
    this.loses = obj.loses;
    this.draws = obj.draws;
    this.ladder = obj.position;
  }

  // _statusConnection?:  boolean; // podemos colocar um enum aqui para ter mais status de conexão
}

export class UserResumeDto {
  id:              string;
  nickname:        string;
  avatar:          string;
  avatar_name:     string;
  is_active:       boolean;
  twoFA:           boolean;
  match_status:    string;

  constructor(obj: any) {
	  this.id = obj.id;
	  this.nickname = obj.nickname;
	  this.avatar = obj.avatar;
    this.avatar_name = obj.avatar_name;
	  this.is_active = obj.is_active;
	  this.twoFA = obj.twoFA;
    this.match_status = obj.match_status;
  }
}

export class UserMatchesDto {
  opponent:        string;
  opponent_avatar: string;
  opponent_score:  number;
  my_score:        number;
  status:          string;

  constructor(obj: any) {
	this.opponent = obj.player_2.nickname;
    this.opponent_avatar = obj.player_2.avatar;
    this.opponent_score = obj.score_p2;
    this.my_score = obj.score_p1;

    if (obj.draws == true){
      this.status = "DRAW";
    }
	else {
		this.opponent_score < this.my_score ? this.status = "WINNER" : this.status = "LOSER";
	}
  }
}

export class UserLadderDto {
  id:        string;
  avatar:    string;
  nickname:  string;

  points:     number;
  matches:   number;
  wins:      number;
  loses:     number;
  draws:     number;
  ladder:    number;

  constructor(obj: any) {
	this.id = obj.id;
	this.avatar = obj.avatar;
	this.nickname = obj.nickname;
	this.points = obj.points;

	this.wins = obj._count.match_wins;
	this.loses = obj._count.match_loses;

	this.matches = obj._count.match_as_player_1 + obj._count.match_as_player_2;
	this.ladder = obj.ladder;
	this.draws = this.matches - (this.wins + this.loses);
  }
}

// export class OutputLadderDto {
//   ladder: UserLadderDto[];
// }
