import { Module, NestModule } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { graphqlUploadExpress } from "graphql-upload";
import { Connection } from "typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RoomModule } from "./apis/room/room.module";
import { DiaryLikeModule } from "./apis/diary-like/diary-like.module";
import { CommentModule } from "./apis/comment/comment.module";
import { DiaryModule } from "./apis/diary/diary.module";

@Module({
  imports: [
    RoomModule,
    DiaryLikeModule,
    CommentModule,
    DiaryModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.HOST,
      port: 3306,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + "/apis/**/*.entity.*"],
      synchronize: true,
      logging: true,
      retryAttempts: 30,
      retryDelay: 5000,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "src/commons/graphql/schema.gql",
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
