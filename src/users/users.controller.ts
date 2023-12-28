import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(UsersModel)
        private readonly usersModel: Repository<UsersModel>,
    ) {}

    @Post()
    testCreateUser() {
        return this.usersModel.save({
            nickname: '김승태',
            email: 'iufan@naver.com',
            password: 'qwe123123213',
        });
    }
}
