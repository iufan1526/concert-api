import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BaseTokenGuard implements CanActivate {
    constructor(
        protected readonly authService: AuthService,
        protected readonly usersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const rowToken = req.headers['authorization'];

        if (!rowToken) {
            throw new UnauthorizedException('토큰이 정상적이지 않습니다.');
        }

        const token = this.authService.extractToken(rowToken, true);
        const verifyToken = this.authService.verifyToken(token);

        req.userId = verifyToken.id;
        req.type = verifyToken.tokenType;
        req.token = token;

        return true;
    }
}

@Injectable()
export class AccessTokenGuard extends BaseTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (req.type !== 'access') {
            throw new UnauthorizedException('액세스 토큰이 아닙니다.');
        }

        return true;
    }
}

@Injectable()
export class RefreshTokenGuard extends BaseTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (req.type !== 'refresh') {
            throw new UnauthorizedException('리프레쉬 토큰이 아닙니다.');
        }

        return true;
    }
}

@Injectable()
export class OwnerAccessTokenGuard extends BaseTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (req.type !== 'access') {
            throw new UnauthorizedException('액세스 토큰이 아닙니다.');
        }

        const userInfo = await this.usersService.findUserForId(req.userId);
        console.log(userInfo);
        if (!userInfo.isAdmin) {
            throw new BadRequestException('관리자만 공연등록이 가능합니다.');
        }

        req.user = userInfo;

        return true;
    }
}
