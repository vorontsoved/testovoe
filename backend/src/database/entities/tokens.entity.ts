import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user.entity";

@Entity()
export class Token {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    refresh_token: string;

    @OneToOne(() => Users, user => user.id)
    @JoinColumn()
    user_id: number;
}
