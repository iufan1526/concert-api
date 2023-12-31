import { IsBoolean, IsEmail, IsNumber, IsString, Length, isNumber } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import {
    USER_DEFAULT_POINT,
    USER_EMAIL_MAX_LENGTH,
    USER_EMAIL_MIN_LENGTH,
    USER_NICKNAME_MAX_LENGTH,
    USER_NICKNAME_MIN_LENGTH,
    USER_PASSWORD_MAX_LENGTH,
    USER_PASSWORD_MIN_LENGTH,
} from '../const/user-model.const';
import { ConcertsModel } from 'src/concerts/entities/concerts.entity';
import { emptyValidationMessage } from 'src/common/validation-message/empty-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { SeatModel } from 'src/concerts/entities/seat.entity';

@Entity()
export class UsersModel extends BaseModel {
    /**
     * 사용자 닉네임
     */
    @Column({
        nullable: false,
    })
    @IsString({
        message: emptyValidationMessage,
    })
    @Length(USER_NICKNAME_MIN_LENGTH, USER_NICKNAME_MAX_LENGTH, {
        message: lengthValidationMessage,
    })
    nickname: string;

    /**
     * 사용자 이메일
     */
    @Column({
        nullable: false,
    })
    @IsEmail(
        {},
        {
            message: emptyValidationMessage,
        },
    )
    @Length(USER_EMAIL_MIN_LENGTH, USER_EMAIL_MAX_LENGTH, {
        message: lengthValidationMessage,
    })
    email: string;

    /**
     * 사용자 비밀번호
     */
    @Column({
        nullable: false,
    })
    @IsString({
        message: emptyValidationMessage,
    })
    @Length(USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH, {
        message: lengthValidationMessage,
    })
    password: string;

    /**
     * 사용자 포인트
     */
    @Column({
        default: USER_DEFAULT_POINT,
    })
    @IsNumber()
    point: number;

    /**
     * 사용자 어드민 여부
     */
    @Column({
        name: 'is_admin',
        default: false,
    })
    @IsBoolean()
    isAdmin: boolean;

    @ManyToMany(() => ConcertsModel, (concert) => concert.users)
    @JoinTable()
    concerts: ConcertsModel[];

    @OneToMany(() => ConcertsModel, (concert) => concert.owner)
    ownerConcert: ConcertsModel[];

    @OneToMany(() => SeatModel, (seats) => seats.user)
    seats: SeatModel[];
}
