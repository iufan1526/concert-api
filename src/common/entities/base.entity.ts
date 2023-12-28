import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseModel {
    /**
     * 테이블 id
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * 데이터 생성일
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * 데이터 수정일
     */
    @UpdateDateColumn()
    updatedAt: Date;
}
