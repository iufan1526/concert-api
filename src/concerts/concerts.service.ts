import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertsModel } from './entities/concerts.entity';
import { Like, Repository } from 'typeorm';
import { ConcertCate } from './const/cate.enum';
import { ConcertDateModel } from './entities/concert-date.entity';
import { SeatModel } from './entities/seat.entity';

@Injectable()
export class ConcertsService {
    constructor(
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
                await this.seatRepository.save({
                    price: concertDto.price,
                    concert: { id: concert.id },
                    concertDate: { id: saveDate.id },
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
        });

        return seats;
    }
}
