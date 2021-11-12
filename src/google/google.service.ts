import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserRole } from 'src/users/decorator/user.enum';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleService {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  async googleLogin(data) {
    if (!data.user) throw new BadRequestException();

    let user = await this.usersService.findByGoogleId(data.user.id);
    if (user) return this.authService.login(user);
    user = await this.usersService.findOne(data.user.email);
    if (user)
      throw new ForbiddenException(
        'Tài khoản đã tồn tại, nhưng tài khoản Google chưa được liên kết với tài khoản của bạn',
      );
    try {
      const newUser = new User();
      newUser.firstName = data.user.firstName;
      newUser.lastName = data.user.lastName;
      newUser.email = data.user.email;
      newUser.googleId = data.user.id;
      await this.usersService.create(newUser);
      return this.authService.login(newUser);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
