import { IsBoolean, IsNumber } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ConcertsModel } from './concerts.entity';
import { ConcertDateModel } from './concert-date.entity';

@Entity()
export class SeatModel extends BaseModel {
    /**
     * 공연 좌석 번호
     */
    // @Column({
    //     name: 'seat_number',
    //     nullable: false,
    // })
    // @IsNumber()
    // seatNumber: number;

    /**
     * 공연 좌석 가격
     */
    @Column({
        nullable: false,
    })
    @IsNumber()
    price: number;

    /**
     * 공연 좌석 예약 여부
     */
    @Column({
        nullable: false,
        default: false,
    })
    @IsBoolean()
    reservation: boolean;

    @ManyToOne(() => ConcertsModel, (concert) => concert.seats)
    concert: ConcertsModel;

    @ManyToOne(() => ConcertDateModel, (concertDate) => concertDate.seats)
    concertDate: ConcertDateModel;
}
