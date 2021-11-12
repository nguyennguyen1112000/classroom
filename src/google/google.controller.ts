import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const response = await this.googleService.googleLogin(req);
      const userParam = Buffer.from(JSON.stringify(response.user)).toString('base64');
      res.redirect(
        `${process.env.WEBBASE_URL}/signin?access_token=${response.access_token}&user=${userParam}`,
      );
    } catch (error) {
      console.log(error.message);
      res.redirect(process.env.WEBBASE_URL);
    }
  }
}
