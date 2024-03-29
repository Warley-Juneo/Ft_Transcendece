import { Controller, Post, Get, Req, Param, Body, Query } from '@nestjs/common';
import { LandingPageService } from './landingPage.service';
import { OutputLandinPageDto } from './dto/output.dto';
import { Request} from 'express';

@Controller('landing-page')
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  @Get()
  async test(@Req() request): Promise<OutputLandinPageDto> {
    return await this.landingPageService.landingPage(request.user.userEmail);
  }
}
