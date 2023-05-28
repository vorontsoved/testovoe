import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/database/entities/user.entity';
import { Token } from 'src/database/entities/tokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Token])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
