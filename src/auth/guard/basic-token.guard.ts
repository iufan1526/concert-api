import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BasicTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const rowToken = req.headers['authorization'];

        if (!rowToken) {
            throw new UnauthorizedException('로그인 토큰이 정상적이지 않습니다.');
        }

        /**
         * 1)토큰을 추출한다.
         * 2)토큰을 가져와서 디코드 한다.
         * 3)이 유저의 정보가 맞는지 디비로 확인한다. email + password
         * 4)확인이 완료되면 req.user 의 해당 유저의 정보를 넣고 리턴한다.
         */
        const token = this.authService.extractToken(rowToken, false);

        const decodeToken = this.authService.dcodedToken(token);

        const user = await this.usersService.findUser(decodeToken);

        req.userId = user.id;

        return true;
    }
}
