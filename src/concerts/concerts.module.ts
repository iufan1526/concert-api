import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertDateModel } from './entities/concert-date.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConcertsModel } from './entities/concerts.entity';
import { SeatModel } from './entities/seat.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ConcertDateModel, ConcertsModel, SeatModel]),
        UsersModule,
        AuthModule,
    ],
    controllers: [ConcertsController],
    providers: [ConcertsService],
})
export class ConcertsModule {}
