import { BaseModel } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ConcertsModel } from './concerts.entity';
import { SeatModel } from './seat.entity';

@Entity()
export class ConcertDateModel extends BaseModel {
    @Column({
        nullable: false,
    })
    date: Date;

    @ManyToOne(() => ConcertsModel, (concert) => concert.concertDate)
    concert: ConcertsModel;

    @OneToMany(() => SeatModel, (seat) => seat.concertDate, {
        cascade: true,
    })
    seats: SeatModel[];
}
