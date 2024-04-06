import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, Req, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserResumeDto, UserProfileDto, UserLadderDto } from './dtos/output.dtos';
import { AddFriendDto, ProfileDto, UpdateCoinsDto, UpdateProfileDto, UpdateTwoFADto } from './dtos/input.dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { multerConfig } from './multer.config';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return await this.service.createUser(dto);
  }

  @Post('updateProfile')
  async updateProfile(@Req() request, @Body() dto: UpdateProfileDto): Promise<UserResumeDto> {
    return await this.service.updateProfile(request.user.sub, dto);
  }

  @Post('update-twoFA')
  async updateTwoFA(@Req() request, @Body() dto: UpdateTwoFADto) : Promise<UserResumeDto> {
    return await this.service.updatetwoFA(request.user.sub, dto);
  }
  @Post('updateCoins')
  async updateCoins(@Req() request, @Body() dto: UpdateCoinsDto): Promise<UserResumeDto> {
	return await this.service.updateCoins(request.user.sub, dto);
  }

  @Post('add_friend')
  async addFriend(@Req() request, @Body() dto: AddFriendDto): Promise<UserResumeDto[]> {
    return await this.service.addFriend(request.user.sub, dto);
  }

  @Post('delete_friend')
  async deleteFriend(@Req() request, @Body() dto: AddFriendDto): Promise<UserResumeDto[]> {
    return await this.service.deleteFriend(request.user.sub, dto);
  }

  @Get('friends')
  async findFriends(@Req() request): Promise<UserResumeDto[]> {
	return await this.service.findFriends(request.user.sub);
  }

  @Get('find-all')
  async findUserAll(): Promise<UserResumeDto[]> {
    return await this.service.findUserAll();
  }

  @Get('online')
  async findOnlineUsers(@Req() request): Promise<UserResumeDto[]> {
    return await this.service.findOnlineUsers(request.user.sub);
  }

  @Get('profile')
  async findProfile(@Query() dto: ProfileDto): Promise<UserProfileDto> {
    return await this.service.findProfile(dto);
  }

//   @Get('matches')
//   async findUserMatches(@Req() request): Promise<UserMatchesDto[]> {
//     return  this.service.findUserMatches(request.user.sub);
//   }

  @Get('ladder')
  async ladder(): Promise<UserLadderDto[]> {
    return this.service.ladder();
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async uploadAvatar(@UploadedFile(
    // new ParseFilePipe({
    //   validators: [
    //     new MaxFileSizeValidator({ maxSize: 35 * 1024 }),
    //     new FileTypeValidator({ fileType: 'image/' }),
    //     new AvatarSizeValidationPipe(),
    //   ]
    // })
  ) file: Express.Multer.File, @Req() request, @Res() res: Response) {

    // if file diferente de img retorna erro
    if (file.mimetype != 'image/png' && file.mimetype != 'image/jpeg') {
      return;
    } 
    
    let buffer = await this.service.uploadAvatar(file.originalname, request.user.sub);

    // Set appropriate response headers
		res.set({
		  'Content-Type': file.mimetype, // Set the appropriate MIME type
		  'Content-Length': buffer.length.toString(),
		});

		// Send the buffer as the response
    res.send(buffer);
	  } catch (error) {
		  console.error('Error retrieving file:', error);
		  // res.status(500).send('Internal Server Error');
	  }

}

