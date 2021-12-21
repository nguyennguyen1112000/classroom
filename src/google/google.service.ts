import { Injectable, ForbiddenException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { GoogleAuthDto } from './dto/google-login.dto';

@Injectable()
export class GoogleService {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  async googleLogin(googleAuthDto: GoogleAuthDto) {
    const { googleId, email, firstName, lastName, imageUrl } = googleAuthDto;
    let user = await this.usersService.findByGoogleId(googleId);
    if (user) return this.authService.login(user);
    user = await this.usersService.findOne(email);
    if (user)
      throw new ForbiddenException(
        'Tài khoản đã tồn tại, nhưng tài khoản Google chưa được liên kết với tài khoản của bạn',
      );
    try {
      const newUser = new User();
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.email = email;
      newUser.googleId = googleId;
      newUser.imageUrl = imageUrl;
      const user = await this.usersService.create(newUser);
      return this.authService.login(user);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
