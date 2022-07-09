import { ObjectType, Field, Int } from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
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

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
