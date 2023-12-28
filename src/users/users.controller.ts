import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * 사용자 회원가입
     */
    @Post()
    signupUser(@Body() body: CreateUserDto) {
        return this.usersService.signupUser(body);
    }
}
