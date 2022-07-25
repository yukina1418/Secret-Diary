import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { DiaryLike } from 'src/apis/diary-like/entities/diary-like.entity';
import { Room } from 'src/apis/room/entities/room.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @Column()
  @Field(() => String)
  title: string;

  @Column({ type: 'text' })
  @Field(() => String)
  contents: string;

  @Column({ default: 0 })
  @Field(() => Int)
  likeCount: number;

  // @Column({ nullable: true })
  // @Field(() => String)
  // image?: string;

  @OneToMany(() => Comment, (comment) => comment.diary)
  @Field(() => [Comment])
  comments: Comment[];

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
