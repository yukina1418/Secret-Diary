import { ObjectType, Field } from '@nestjs/graphql';
import { Diary } from 'src/apis/diary/entities/diary.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
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

  @ManyToOne(() => Diary, (diary) => diary.comments)
  @Field(() => Diary)
  diary: Diary;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
