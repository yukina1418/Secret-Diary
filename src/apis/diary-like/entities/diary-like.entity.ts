import { ObjectType, Field } from '@nestjs/graphql';
import { Diary } from 'src/apis/diary/entities/diary.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
@Index(['fkDiaryId', 'data'], { unique: true })
export class DiaryLike {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column('uuid')
  @Field(() => String)
  fkDiaryId: string;

  @Column()
  @Field(() => String)
  data: string;

  @ManyToOne((type) => Diary)
  @JoinColumn({ name: 'fkDiaryId' })
  diary: Diary;

  @Column('timestamptz')
  @CreateDateColumn()
  createAt: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updateAt: Date;
}
