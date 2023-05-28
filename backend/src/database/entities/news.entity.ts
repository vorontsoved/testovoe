import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user.entity";

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    header: string;

    @CreateDateColumn({ type: "timestamp", precision: 3, default: () => "CURRENT_TIMESTAMP(3)" })
    date: Date;
    
    @CreateDateColumn({ nullable: true, type: "timestamp", precision: 3, default: null })
    update_date: Date | null;

    @Column()
    body: string;

    @ManyToOne(() => Users, user => user.id)
    @JoinColumn({ name: 'ownerId' })
    ownerId: number;
}
