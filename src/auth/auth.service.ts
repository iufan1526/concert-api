import { Global, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';

@Injectable()
@Global()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}
    /**
     * 토큰 추출하기
     */
    extractToken(token: string, isBearer: boolean) {
        const splitToken = token.split(' ');

        const tokenType = isBearer ? 'Bearer' : 'Basic';

        if (splitToken.length !== 2 || tokenType !== splitToken[0]) {
            throw new UnauthorizedException('코인이 정상적이지 않습니다.');
        }

        return splitToken[1];
    }

    /**
     * base64형식의 토큰을 디코드 한다.
     * @param token
     * @returns
     */
    dcodedToken(token: string) {
        const decodeToken = Buffer.from(token, 'base64').toString('utf-8');

        const split = decodeToken.split(':');

        if (split.length !== 2) {
            throw new UnauthorizedException('코인이 정상적이지 않습니다.');
        }

        const email = split[0];
        const password = split[1];

        return {
            email,
            password,
        };
    }

    /**
     * 로그인 요청
     */
    loginUser(userId: Pick<UsersModel, 'id'>) {
        return {
            accessToken: this.signToken(userId, false),
            refreshToken: this.signToken(userId, true),
        };
    }

    /**
     * jwt토큰발급
     */
    signToken(userId: Pick<UsersModel, 'id'>, isRefresh: boolean) {
        const payload = {
            id: userId,
            tokenType: isRefresh ? 'refresh' : 'access',
        };

        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: isRefresh ? 3600 : 300,
        });
    }

    /**
     * token 검증
     * @param token
     * @returns
     */
    verifyToken(token: string) {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET_KEY,
            });
        } catch (e) {
            throw new UnauthorizedException('토큰이 만료되었습니다.');
        }
    }

    /**
     * 토큰 재발급
     * @param token
     * @param isRefresh
     * @returns
     */
    rotateToken(token: string, isRefresh: boolean) {
        const decodeToken = this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET_KEY,
        });

        if (decodeToken.tokenType !== 'refresh') {
            throw new UnauthorizedException('토큰발급은 refresh토큰만 가능합니다.');
        }

        return this.signToken(decodeToken.id, isRefresh);
    }
}
