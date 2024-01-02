import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersModel } from './entities/users.entity';
import { successUserCreate } from 'src/users/response/users.response';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * 사용자 회원가입
     */
    @Post()
    async signupUser(@Body() body: CreateUserDto) {
        const createdUser: UsersModel = await this.usersService.signupUser(body);

        return successUserCreate(createdUser.nickname);
    }

    /**
     * 사용자 조회
     * @param request
     * @returns
     */
    @Get('user')
    @UseGuards(AccessTokenGuard)
    getUser(@Req() request: Request) {
        return this.usersService.findUserForId(+request['userId']);
    }
}
