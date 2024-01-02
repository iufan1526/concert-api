import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { SeatModel } from './seat.entity';
import { ConcertCate } from '../const/cate.enum';
import { emptyValidationMessage } from 'src/common/validation-message/empty-validation.message';
import { ConcertDateModel } from './concert-date.entity';

@Entity()
export class ConcertsModel extends BaseModel {
    /**
     * 공연 제목
     */
    @Column({
        nullable: false,
    })
    @IsString({
        message: emptyValidationMessage,
    })
    title: string;

    /**
     * 공연 설명
     */
    @Column({
        nullable: false,
    })
    @IsString({
        message: emptyValidationMessage,
    })
    description: string;

    /**
     * 공연 지역
     */
    @Column({
        nullable: false,
    })
    @IsString({
        message: emptyValidationMessage,
    })
    location: string;

    /**
     * 공연 가격
     */
    // @Column({
    //     nullable: false,
    // })
    // @IsNumber(
    //     {},
    //     {
    //         message: emptyValidationMessage,
    //     },
    // )
    // price: number;

    /**
     * 공연 카테고리
     */
    @Column({
        nullable: false,
        enum: Object.values(ConcertCate),
    })
    cate: ConcertCate;

    /**
     * 공연 이미지
     */
    @Column()
    @IsString({
        message: emptyValidationMessage,
    })
    image: string;

    /**
     * 사용자
     */
    @ManyToMany(() => UsersModel, (user) => user.concerts)
    users: UsersModel[];

    /**
     * 공연 생성 관리자
     */
    @ManyToOne(() => UsersModel, (user) => user.ownerConcert, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    owner: UsersModel;

    /**
     * 좌석 정보
     */
    @OneToMany(() => SeatModel, (seat) => seat.concert, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    seats: SeatModel[];

    /**
     * 공연 일자 정보
     */
    @OneToMany(() => ConcertDateModel, (concertDate) => concertDate.concert, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    concertDate: ConcertDateModel[];
}
