import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UsersRepositoryInterface } from './interface/users.repository.interface';
import { User, Match } from '@prisma/client';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserResumeDto } from './dtos/output.dtos';
import { AddFriendDto, UpdateCoinsDto, UpdateProfileDto } from './dtos/input.dtos';

@Injectable()
export class UsersRepository implements UsersRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: CreateUserDto): Promise<User> {
    //CREATE USER INTO USER MODEL
    let response = await this.prisma.user.create({
      data: {
        login: user.login,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        nickname: user.nickname,
        avatar: user.avatar,
        avatar_name: user.avatar_name,
      },
    });
    return response;
  }

  // async updateAvatar(userId: string, dto: UpdateProfileDto): Promise<User> {
  //   let response = await this.prisma.user.update({
  //       where: {
  //         id: userId,
  //       },
  //       data: {
  //         avatar: dto.avatar,

  //       },
  //     });
  //   return response;
  // }

  async updateUser(where_filter: any, data_filter: any): Promise<User> {
    let response = await this.prisma.user.update({
      where: where_filter,
      data: data_filter,
    });
    return response;
  }

  async updateCoins(userId: string, dto: UpdateCoinsDto): Promise<User> {
	let response = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          coins: dto.coins,
        },
      });
    return response;
  }

  async findAllUsers(): Promise<any> {
    let response = this.prisma.user.findMany({
      orderBy: {
        points: 'desc',
      },
      select: {
        id: true,
        avatar: true,
        nickname: true,
        is_active: true,
		match_status: true,
		avatar_name: true,
      },
    });
    return response;
  }

  async findUserAuth(userEmail: string): Promise<User> {
    let response = await this.prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
    return response;
  }

  async findUser(userId: string): Promise<User> {
    let response = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return response;
  }

  async findUserByNickname(userNickname: string): Promise<User> {
    let response = await this.prisma.user.findUnique({
      where: {
        nickname: userNickname,
      },
    });
    return response;
  }

  async findUserWithFriends(userId: string): Promise<any> {
    let response = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        friends: true,
      }
    });
    return response;
  }

  async findOnlineUsers(userId: string): Promise<any> {
    let response = await this.prisma.user.findMany({
      where: {
        is_active: true,
        id: {
          not: {
            equals: userId,
          },
        },
      },
      select: {
        id: true,
        avatar: true,
        nickname: true,
        is_active: true,
		avatar_name: true,
      }
    });
    return response;
  }

  async addFriend(userId: string, dto: AddFriendDto): Promise<any> {

    try {
      let friend = await this.prisma.user.findUniqueOrThrow({
        where: {
          nickname: dto.nick_name,
        },
      });

      if (!friend) {
        return null;
      }
      let status1 = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          friends: {
            connect: [
              {id: friend.id}
            ]
          }
        }
      });

      let status2 = await this.prisma.user.update({
        where: {
          id: friend.id,
        },
        data: {
          friends: {
            connect: [
              {id: userId}
            ]
          }
        }
      });

      let user = await this.findUserWithFriends(userId);

      return user.friends;

    } catch(error) {
      return null;
    }
  }

  async deleteFriend(userId: string, dto: AddFriendDto): Promise<any> {

    try {
      let friend = await this.prisma.user.findUniqueOrThrow({
        where: {
          nickname: dto.nick_name,
        },
      });

      let response1 = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          friends: {
            disconnect: [
              {id: friend.id}
            ]
          }
        }
      });

      let response2 = await this.prisma.user.update({
        where: {
          id: friend.id,
        },
        data: {
          friends: {
            disconnect: [
              {id: userId}
            ]
          }
        }
      });

      let user = await this.findUserWithFriends(userId);

      return user.friends;

    } catch(error) {
      return null;
    }
  }

  async ladder(): Promise<any> {
    let response = await this.prisma.user.findMany({
      select: {
        id: true,
        avatar: true,
        nickname: true,
        points: true,
		avatar_name: true,
        _count: {
          select: {
            match_as_player_1: true,
            match_as_player_2: true,
            match_wins: true,
            match_loses: true,
          },
        },
      },
      orderBy: {
        points: 'desc',
      },
    });
    return response;
  }

  async findUserBySocket(user_socket: string): Promise<string> {
    let user = await this.prisma.user.findUnique({
      where: {
        socket: user_socket,
      },
    });
    return user.id;
  }

  async uploadAvatar(avatar: string, userId: string): Promise<any> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: avatar,
      },
    });
    return user;
  }
}
