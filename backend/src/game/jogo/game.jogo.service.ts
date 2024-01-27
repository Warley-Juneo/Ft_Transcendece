// Aqui vamos colocar nossos serviços,
// que é startgame, updategame, checkcoliissionpaddle e checkcollisionwall.

import { Injectable } from "@nestjs/common";
import { GGame } from "./game.jogo.interfaces";
import { User } from "@prisma/client";

@Injectable()
export class JogoService {
  rooms: GGame[] = [];
	
  async startGame(player1: User, player2: User) {
    const game = new GGame(player1, player2);
    this.rooms.push(game);
    return game;
  }
  
  async calculeAngle(game: GGame, curret_paddleleftX: number) {
    game.ball.velocity = game.ball.velocity + 1;

    if (game.ball.positionX == curret_paddleleftX) {
      game.ball.angle = 0;
    }
    else if (game.ball.positionX > curret_paddleleftX) {
      let diff = game.ball.positionX - curret_paddleleftX;
      if (diff <= 2) {
        game.ball.angle = 1;
      }
      else if (diff <= 4) {
        game.ball.angle = 2;
      }
      else if (diff <= 6) {
        game.ball.angle = 3;
      }
      else if (diff <= 8) {
        game.ball.angle = 4;
      }
      else if (diff <= 10) {
        game.ball.angle = 5;
      }
    }
  }

  async verifyCollisionPaddles(game: GGame) {
    let verifyCollisionPaddleLeft = () => {
      let curret_paddleleftX = game.paddleLeft.positionX;
      let diff_paddleLeft_up = game.paddleLeft.positionX - game.paddleLeft.height / 2;
      let diff_paddleLefft_down = game.paddleLeft.positionX + game.paddleLeft.height / 2;
  
      if (game.ball.positionX >= diff_paddleLeft_up && game.ball.positionX <= diff_paddleLefft_down) {
        game.ball.direction = game.ball.direction * -1;
        this.calculeAngle(game, curret_paddleleftX);
        return true;
      }
    }

    let verifyCollisionPaddleRight = () => {
      let curret_paddleRightX = game.paddleRight.positionX;
      let diff_paddleRight_up = game.paddleRight.positionX - game.paddleRight.height / 2;
      let diff_paddleRight_down = game.paddleRight.positionX + game.paddleRight.height / 2;

      if (game.ball.positionX >= diff_paddleRight_up && game.ball.positionX <= diff_paddleRight_down) {
        game.ball.direction = game.ball.direction * -1;
        this.calculeAngle(game, curret_paddleRightX);
        return true;
      }
    }

    if (verifyCollisionPaddleLeft() || verifyCollisionPaddleRight()) {
      return true;
    }
    return false;
  }

  async verifyCollisionWall(game: GGame) {
    let verifyCollisionWallUp = () => {
      if (game.ball.positionY <= 0) {
        game.ball.angle = game.ball.angle * -1;
        return true;
      }
    }

    let verifyCollisionWallDown = () => {
      if (game.ball.positionY >= game.window.height) {
        game.ball.angle = game.ball.angle * -1;
        return true;
      }
    }

    let verifyCollisionWallLeft = () => {
      if (game.ball.positionX <= 0) {
        game.placarRight++;
        return true;
      }
    }

    let verifyCollisionWallRight = () => {
      if (game.ball.positionX >= game.window.width) {
        game.placarLeft++;
        return true;
      }
    }

    if (verifyCollisionWallUp() || verifyCollisionWallDown() || verifyCollisionWallLeft() || verifyCollisionWallRight()) {
      return true;
    }
    return false;
  }

  async moveBall(game: GGame) {
    game.ball.positionX += game.ball.velocity;
    game.ball.positionY += game.ball.angle;
  }

  async movePaddle(game: GGame, player: string, move: string) {
    if (player == "left") {
      if (move == "up") {
        game.paddleLeft.positionY += game.paddleLeft.velocity;
      } else if (move == "down") {
        game.paddleLeft.positionY -= game.paddleLeft.velocity;
      }
    }
    else if (player == "right") {
      if (move == "up") {
        game.paddleRight.positionY += game.paddleRight.velocity;
      } else if (move == "down") {
        game.paddleRight.positionY -= game.paddleRight.velocity;
      }
    }
  }

  async checkScore(game: GGame) {
    if (game.placarLeft == 10 || game.placarRight == 10) {
      return 'left';
    }
    return false;
  }

  async checkWinner(game: GGame) {
    if (game.placarLeft == 10) {
      return game.player1;
    }
    else if (game.placarRight == 10) {
      return game.player2;
    }
  }

  async CheckDisconnectUser(game: GGame, player: User) {
    if (game.player1.user == player) {
      game.player1.status = false;
      return true;
    } else if (game.player2.user == player) {
      game.player2.status = false;
      return true;
    }
  }

  async resetGame(game: GGame) {
    game.ball.positionX = game.window.width / 2;
    game.ball.positionY = game.window.height / 2;
    game.ball.velocity = 5;
    game.ball.direction = 1;
    game.ball.angle = Math.random() < 0.5 ? -1 : 1;
    game.paddleLeft.positionY = game.window.height / 2;
    game.paddleRight.positionY = game.window.height / 2;
  }

  async updateGame(gameID: string) {
    let game = this.rooms.find(game => game.roomID == gameID);
    if (this.verifyCollisionPaddles(game)) {
      this.resetGame(game);
    }
    else if (this.verifyCollisionWall(game)) {
      if (this.checkScore(game)) {
        this.checkWinner(game);
      }
      else {
        this.resetGame(game);
      }
    }

    if (this.CheckDisconnectUser) {

    }
  }
}

  
