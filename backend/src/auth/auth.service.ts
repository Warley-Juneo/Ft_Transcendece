import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto, OtherLoginDto } from 'src/auth/dtos/input.dto';
import { OutputLoginDto } from './dtos/output.dto';
import { CreateUserDto } from 'src/users/dtos/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserApi42(authLoginDto: AuthLoginDto): Promise<string> {
    const clientId = process.env.UID;
    const secret = process.env.SECRET;

	const authRequest = {
		grant_type: 'authorization_code',
		client_id: process.env.UID,
		client_secret: process.env.SECRET,
		code: authLoginDto.authCode,
		redirect_uri: process.env.HOST_URL,
	  };

    const authResponsePromise: Observable<any> = this.httpService.post(
      process.env.API42_USER_AUTH,
      authRequest,
    );

    const authResponseResolved = await lastValueFrom(authResponsePromise);
    const accessToken: string = authResponseResolved.data.access_token;

    return accessToken;
  }

  async getUserInfoApi42(accessToken: string): Promise<any> {
    const userApiInfo: Observable<any> = this.httpService.get(
      process.env.API42_USER_INFO,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const userApiInfoResolved = await lastValueFrom(userApiInfo);

    return userApiInfoResolved.data;
  }

  async verifyUser(userInfo: any): Promise<any> {
    let user: User = await this.usersService.findUserAuth(userInfo.email);
    if (!user) {
      const createUserDto = new CreateUserDto();
      createUserDto.login = userInfo.login;
      createUserDto.email = userInfo.email;
      createUserDto.first_name = userInfo.first_name;
      createUserDto.last_name = userInfo.last_name;
      createUserDto.nickname = userInfo.login;
      createUserDto.avatar = userInfo.avatar;

      user = await this.usersService.createUser(createUserDto);
    }
    return user;
  }

  async jwtSign(user: any): Promise<string> {
    const payload = { sub: user.id, userEmail: user.email };
    let jwt_token = await this.jwtService.signAsync(payload);
    return (jwt_token);
  }

  async mainLogin(authLoginDto: AuthLoginDto): Promise<OutputLoginDto>
  {
    const accessToken: string = await this.validateUserApi42(authLoginDto);
    const userInfo = await this.getUserInfoApi42(accessToken);
    const user = await this.verifyUser(userInfo);
    let jwt_token = await this.jwtSign(user);

    const outputLoginDto = new OutputLoginDto();
    outputLoginDto._access_token = jwt_token;

    return outputLoginDto;
  }


  async otherLogin(dto: OtherLoginDto): Promise<OutputLoginDto> {
	// dto.first_name = 'firtsname';
	// dto.last_name = 'lastName';

    const user = await this.verifyUser(dto);
    let jwt_token = await this.jwtSign(user);

    const outputLoginDto = new OutputLoginDto();
    outputLoginDto._access_token = jwt_token;

    return outputLoginDto;
  }

}
