import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Token } from "./tokens.entity";
import { News } from "./news.entity";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    @OneToOne(() => Token, token => token.user_id, { onDelete: 'CASCADE' })
    @OneToMany(() => News, news => news.ownerId)
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    login: string;

    @Column()
    password_hash: string;

    @Column()
    salt: string;

}
