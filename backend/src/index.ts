import express from 'express';
import session from 'express-session';
import { MikroORM } from '@mikro-orm/core';
import mikroConfig from './mikro-orm.config';
import cors, { CorsOptions } from 'cors';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user';

declare module 'express-session' {
    export interface SessionData {
        userId: number;
    }
}

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    orm.getMigrator().up();
    const corsOptions: CorsOptions = {
        credentials: true,
        origin: 'https://studio.apollographql.com'
    };

    const app = express();
    app.use(cors(corsOptions));
    app.set('trust proxy', 1);

    const RedisStore = connectRedis(session);
    const redis = new Redis('localhost:6379');

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redis,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'none',
                secure: false
            },
            rolling: true,
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: corsOptions });

    app.listen(4000, () => {
        console.log('Server is running on port 3000');
    });
}

main().catch(err => console.error(err));
