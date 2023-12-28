import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';
import { EXIST_USER_EMAIL, EXIST_USER_NICKNAME } from './const/user-response-message.const';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
    ) {}

    /**
     * 사용자 회원가입
     */
    async signupUser(userDto: CreateUserDto) {
        const existNickname = await this.usersRepository.exist({
            where: {
                nickname: userDto.nickname,
            },
        });
        if (existNickname) {
            throw new BadRequestException(EXIST_USER_NICKNAME);
        }

        const existEmail = await this.usersRepository.exist({
            where: {
                email: userDto.email,
            },
        });
        if (existEmail) {
            throw new BadRequestException(EXIST_USER_EMAIL);
        }

        return this.usersRepository.save({
            ...userDto,
        });
    }
}
