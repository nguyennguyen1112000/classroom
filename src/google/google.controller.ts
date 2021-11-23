import { Body, Controller, Post, Res } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleAuthDto } from './dto/google-login.dto';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post()
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    try {     
      const response = await this.googleService.googleLogin(googleAuthDto);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
}
