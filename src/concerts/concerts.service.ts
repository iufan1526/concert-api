import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertsModel } from './entities/concerts.entity';
import { Like, Repository } from 'typeorm';
import { ConcertCate } from './const/cate.enum';
import { ConcertDateModel } from './entities/concert-date.entity';
import { SeatModel } from './entities/seat.entity';
import { UsersService } from 'src/users/users.service';
import { get } from 'http';

@Injectable()
export class ConcertsService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(ConcertsModel)
        private readonly concertRepository: Repository<ConcertsModel>,
        @InjectRepository(ConcertDateModel)
        private readonly concertDateRepository: Repository<ConcertDateModel>,
        @InjectRepository(SeatModel)
        private readonly seatRepository: Repository<SeatModel>,
    ) {}
    /**
     * 공연 등록
     */
    async createConcert(concertDto: CreateConcertDto) {
        const concertObj = this.concertRepository.create({
            title: concertDto.title,
            description: concertDto.description,
            location: concertDto.location,
            cate: ConcertCate[concertDto.cate],
            image: concertDto.image,
        });

        const existConcert = await this.existConcertForTitle(concertObj.title);

        if (existConcert) {
            throw new BadRequestException('이미 존재하는 공연입니다.');
        }

        const resultObj = await this.concertRepository.save({
            owner: {
                id: concertDto.ownerId,
            },
            ...concertDto,
        });

        await this.createConcertDateAndSeat(resultObj, concertDto);

        return resultObj;
    }

    /**
     * 공연 존재여부
     * @param title
     * @returns
     */
    async existConcertForTitle(title: string) {
        const existConcert = await this.concertRepository.exist({
            where: {
                title,
            },
        });

        return existConcert;
    }

    /**
     * 공연 날짜와 좌석 생성
     * @param concert
     * @param concertDto
     */
    async createConcertDateAndSeat(concert: ConcertsModel, concertDto: CreateConcertDto) {
        for (const date of concertDto.date) {
            const existDate = await this.concertDateRepository.exist({
                where: {
                    concert: {
                        id: concert.id,
                    },
                    date,
                },
            });

            if (existDate) {
                throw new BadRequestException('해당 공연에 이미 동일한 일정이 존재합니다.');
            }

            const saveDate = await this.concertDateRepository.save({
                concert: {
                    id: concert.id,
                },
                date,
            });

            for (let i = 0; concertDto.seatCount > i; i++) {
                const saveSeat = await this.seatRepository.save({
                    price: concertDto.price,
                    concert: { id: concert.id },
                    concertDate: saveDate,
                });
            }
        }
    }

    /**
     * 공연 목록 조회
     */
    async getConcerts(search: string) {
        const concerts = await this.concertRepository.find({
            where: {
                title: Like(`%${search}%`),
            },
        });

        return concerts;
    }

    /**
     * 공연 상세 조회
     * @param id
     */
    async getConcert(id: number) {
        const concert = await this.concertRepository.findOne({
            where: {
                id,
            },
            relations: {
                owner: true,
                concertDate: true,
            },
        });

        let reservationDate: string[] = [];
        for (const date of concert.concertDate) {
            const existSeat = await this.seatRepository.exist({
                where: {
                    concertDate: {
                        id: date.id,
                    },
                    reservation: false,
                },
            });

            if (existSeat) {
                reservationDate.push(`${date.date} 예매가 가능합니다!!`);
            }
        }

        if (reservationDate.length > 0) {
            return {
                concert,
                reservationDate,
            };
        }

        return concert;
    }

    /**
     * 공연 좌석 조회
     * @param id
     */
    async getSeats(id: number) {
        const seats = await this.seatRepository.find({
            where: {
                concertDate: {
                    id,
                },
            },
            relations: ['concertDate'],
        });

        return seats;
    }

    /**
     * 예매하기
     * @param concertId
     * @param dateId
     */
    async reserveConcert(concertId: number, dateId: number, userId: number) {
        const existSeat = await this.existSeats(concertId, dateId);

        if (!existSeat) {
            throw new NotFoundException('현재 해당 일정에 예약가능한 좌석이 존재하지 않습니다.');
        }

        // 현재 날짜 좌석 가져오기
        const getSeats = await this.getSeats(dateId);
        // 해당 좌석 가격
        const seatPrice = getSeats[0].price;
        // 예매하는 유저정보
        const getUser = await this.usersService.findUserForId(userId);

        if (getUser.point < seatPrice) {
            throw new BadRequestException('돈이 부족해서 예매를 할수가 없습니다.');
        }

        // 예약가능 좌석 한개 가져오기
        const isFlaseReservationSeat = await this.findIsFlaseReservation(dateId);

        await this.seatRepository.update(
            { id: isFlaseReservationSeat.id },
            {
                reservation: true,
                user: {
                    id: getUser.id,
                },
            },
        );
        const updatePoint = getUser.point - seatPrice;

        // 포인트 차감
        await this.usersService.updateUserPoint(userId, updatePoint);

        const date = isFlaseReservationSeat.concertDate.date;
        const concertLocation = isFlaseReservationSeat.concert.location;

        return {
            concertLocation,
            date,
            seatPrice,
        };
    }

    /**
     * 좌석 존재여부
     * @param concertId
     * @param dateId
     */
    async existSeats(concertId: number, dateId: number) {
        const existSeat = await this.seatRepository.exist({
            where: {
                concert: {
                    id: concertId,
                },
                concertDate: {
                    id: dateId,
                },
                reservation: false,
            },
        });

        return existSeat;
    }

    /**
     * 예약 가능한 좌석 한개 가져오기
     */
    async findIsFlaseReservation(dateId: number) {
        const getSeat = await this.seatRepository.findOne({
            where: {
                concertDate: {
                    id: dateId,
                },
                reservation: false,
            },
            relations: ['concertDate', 'concert'],
        });

        return getSeat;
    }

    /**
     * 예약 정보 반환
     */
    async getResultConcertInfo(dateId: number) {
        return await this.concertDateRepository.findOne({
            select: {},
            where: {
                id: dateId,
            },
            relations: ['concert', 'seats'],
        });
    }

    /**
     * 예약 정보조회
     * @param userId
     */
    getReservations(userId: number) {
        return this.seatRepository.find({
            where: {
                user: {
                    id: userId,
                },
            },
            order: {
                updatedAt: 'DESC',
            },
            relations: ['concert', 'concertDate'],
        });
    }
}
