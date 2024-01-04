import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';
import { EXIST_USER_EMAIL, EXIST_USER_NICKNAME } from './const/user-response-message.const';
import * as bcrypt from 'bcrypt';

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

        const hashedPassword = await this.hashPassword(userDto.password);

        return await this.usersRepository.save({
            ...userDto,
            password: hashedPassword,
        });
    }

    /**
     * 비밀번호 해시화
     * @param password
     */
    async hashPassword(password: string) {
        const hashedPassword = await bcrypt.hash(password, +process.env.HASH_ROUND);

        return hashedPassword;
    }

    /**
     * id, password로 유저 찾기
     * @param user
     * @returns
     */
    async findUser(user: Pick<UsersModel, 'email' | 'password'>) {
        const findUserInfo = await this.usersRepository.findOne({
            where: {
                email: user.email,
            },
        });

        if (!findUserInfo) {
            throw new BadRequestException('존재하지 않는 사용자입니다.');
        }

        const passwordCompare = await bcrypt.compare(user.password, findUserInfo.password);

        if (!passwordCompare) {
            throw new BadRequestException('비밀번호가 일치하지 않습니다.');
        }

        return findUserInfo;
    }

    /**
     * 사용자Id로 사용자 정보 찾기
     */
    async findUserForId(userId: number) {
        const findUserInfo = await this.usersRepository.findOne({
            select: {
                id: true,
                nickname: true,
                point: true,
                isAdmin: true,
            },
            where: {
                id: userId,
            },
        });

        return findUserInfo;
    }

    /**
     * 예매후 포인트 차감
     */
    async updateUserPoint(userId: number, point: number) {
        await this.usersRepository.update({ id: userId }, { point });
    }
}
