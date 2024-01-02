import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConcertsModule } from './concerts/concerts.module';
import { UsersModel } from './users/entities/users.entity';
import { ConcertsModel } from './concerts/entities/concerts.entity';
import { SeatModel } from './concerts/entities/seat.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ConcertDateModel } from './concerts/entities/concert-date.entity';

@Module({
    imports: [
        JwtModule.register({}),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'kim-db.chnlibxveby8.ap-northeast-2.rds.amazonaws.com',
            port: 3306,
            username: 'root',
            password: 'qq13227974',
            database: 'concert-api',
            entities: [UsersModel, ConcertsModel, SeatModel, ConcertDateModel],
            synchronize: true,
        }),
        UsersModule,
        ConcertsModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
