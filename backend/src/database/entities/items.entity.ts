import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Items {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column()
  quantity: number;
}
