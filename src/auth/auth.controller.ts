import { Body, Controller, Post, Headers, UseGuards, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { BaseTokenGuard, RefreshTokenGuard } from './guard/bearer-token.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * 로그인
     */
    @Post('login')
    @UseGuards(BasicTokenGuard)
    loginUser(@Req() request: Request) {
        return this.authService.loginUser(request['userId']);
    }

    /**
     * access 토큰 재발급
     * @param request
     * @returns
     */
    @Post('token/access')
    @UseGuards(RefreshTokenGuard)
    createAccessToken(@Req() request: Request) {
        return this.authService.rotateToken(request['token'], false);
    }

    /**
     * refresh 토큰 재발급
     * @param request
     * @returns
     */
    @Post('token/refresh')
    @UseGuards(RefreshTokenGuard)
    createRefreshToken(@Req() request: Request) {
        return this.authService.rotateToken(request['token'], true);
    }
}
