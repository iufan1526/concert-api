import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { AccessTokenGuard, OwnerAccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreateConcertDto } from './dto/create-concert.dto';

@Controller('concerts')
export class ConcertsController {
    constructor(private readonly concertsService: ConcertsService) {}

    /**
     * 공연 등록
     * @param req
     * @param concertDto
     * @returns
     */
    @Post()
    @UseGuards(OwnerAccessTokenGuard)
    createConcert(@Req() req: Request, @Body() concertDto: CreateConcertDto) {
        return this.concertsService.createConcert({
            ...concertDto,
            ownerId: req['userId'],
        });
    }

    /**
     * 공연 목록조회
     * @returns
     */
    @Get()
    getConcerts(@Query('search') search: string) {
        return this.concertsService.getConcerts(search);
    }

    /**
     * 공연 상세 조회
     * @param id
     */
    @Get('/:id')
    getConcert(@Param('id', ParseIntPipe) id: number) {
        return this.concertsService.getConcert(id);
    }

    /**
     * 좌석정보 조회
     */
    @Get('/seats/:id')
    getSeats(@Param('id', ParseIntPipe) id: number) {
        return this.concertsService.getSeats(id);
    }

    /**
     * 예매하기
     * @param parmas
     * @param reqeust
     * @returns
     */
    @Patch('/:id/:dateId')
    @UseGuards(AccessTokenGuard)
    reserveConcert(@Param() parmas: any, @Req() reqeust: Request) {
        const { id, dateId } = parmas;

        return this.concertsService.reserveConcert(id, dateId, reqeust['userId']);
    }

    @Get('/reservations/user')
    @UseGuards(AccessTokenGuard)
    getReservations(@Req() request: Request) {
        return this.concertsService.getReservations(request['userId']);
    }
}
