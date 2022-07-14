import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Diary } from 'src/apis/diary/entities/diary.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  password: string;

  @Column()
  adminPassword: string;

  @Column({ nullable: true })
  @Field(() => String)
  image?: string;

  @Column({ default: 0 })
  @Field(() => Int)
  userCount: number;

  @Column({ default: 0 })
  @Field(() => Int)
  hit: number;

  @OneToMany(() => Diary, (diary) => diary.room)
  @Field(() => [Diary])
  diaries: Diary[];

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
