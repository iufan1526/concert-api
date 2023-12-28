import { IsEmail, IsNumber, IsString, Length, isNumber } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import {
    USER_DEFAULT_POINT,
    USER_EMAIL_MAX_LENGTH,
    USER_EMAIL_MIN_LENGTH,
    USER_NICKNAME_MAX_LENGTH,
    USER_NICKNAME_MIN_LENGTH,
    USER_PASSWORD_MAX_LENGTH,
    USER_PASSWORD_MIN_LENGTH,
} from '../const/user.const';
import { ConcertsModel } from 'src/concerts/entities/concerts.entity';

@Entity()
export class UsersModel extends BaseModel {
    /**
     * 사용자 닉네임
     */
    @Column({
        nullable: false,
    })
    @IsString()
    @Length(USER_NICKNAME_MIN_LENGTH, USER_NICKNAME_MAX_LENGTH)
    nickname: string;

    /**
     * 사용자 이메일
     */
    @Column({
        nullable: false,
    })
    @IsEmail()
    @Length(USER_EMAIL_MIN_LENGTH, USER_EMAIL_MAX_LENGTH)
    email: string;

    /**
     * 사용자 비밀번호
     */
    @Column({
        nullable: false,
    })
    @IsString()
    @Length(USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH)
    password: string;

    /**
     * 사용자 포인트
     */
    @Column({
        default: USER_DEFAULT_POINT,
    })
    @IsNumber()
    point: number;

    @ManyToMany(() => ConcertsModel, (concert) => concert.users)
    @JoinTable()
    concerts: ConcertsModel[];
}
