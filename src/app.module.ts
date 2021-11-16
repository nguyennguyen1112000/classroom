import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { GoogleModule } from './google/google.module';
import { UserToClassModule } from './user-to-class/user-to-class.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    ClassroomsModule,
    AuthModule,
    GoogleModule,
    UserToClassModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
