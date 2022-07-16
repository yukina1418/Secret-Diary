import { ObjectType, Field } from '@nestjs/graphql';
import { Room } from 'src/apis/room/entities/room.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Diary extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  account: string;

  @Column()
  password: string;

  @Column({ type: 'text' })
  @Field(() => String)
  contents: string;

  // @Column({ nullable: true })
  // @Field(() => String)
  // image?: string;

  @ManyToOne(() => Room, (room) => room.diaries)
  @Field(() => Room)
  room: Room;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
