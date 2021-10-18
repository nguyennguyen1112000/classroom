import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ClassroomsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
