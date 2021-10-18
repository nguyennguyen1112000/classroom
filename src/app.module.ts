import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ClassroomsModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
