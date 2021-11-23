import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [GoogleController],
  providers: [GoogleService]
})
export class GoogleModule {}

