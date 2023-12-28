import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { SeatModel } from './seat.entity';

@Entity()
export class ConcertsModel extends BaseModel {
    /**
     * 공연 제목
     */
    @Column({
        nullable: false,
    })
    @IsString()
    title: string;

    /**
     * 공연 설명
     */
    @Column({
        nullable: false,
    })
    @IsString()
    description: string;

    /**
     * 공연 지역
     */
    @Column({
        nullable: false,
    })
    @IsString()
    location: string;

    /**
     * 공연 가격
     */
    @Column({
        nullable: false,
    })
    @IsNumber()
    price: number;

    @ManyToMany(() => UsersModel, (user) => user.concerts)
    users: UsersModel[];

    @OneToMany(() => SeatModel, (seat) => seat.concert)
    seats: SeatModel[];
}
