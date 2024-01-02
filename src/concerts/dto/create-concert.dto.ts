import { PickType } from '@nestjs/mapped-types';
import { ConcertsModel } from '../entities/concerts.entity';

export class CreateConcertDto extends PickType(ConcertsModel, [
    'title',
    'description',
    'location',
    'image',
    'cate',
]) {
    date: Date[];

    userId: number;

    seatCount: number;

    price: number;

    ownerId: number;
}
