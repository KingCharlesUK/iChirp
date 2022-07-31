import { Options } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { Chirps } from './entities/Chirps';
import { Users } from './entities/Users';

const config: Options = {
    migrations: {
        path: path.join(__dirname, './migrations'),
        glob: '!(*.d).{js,ts}',
        snapshot: false
    },
    entities: [Users, Chirps],
    allowGlobalContext: true,
    dbName: 'ichirp',
    type: 'postgresql',
    password: 'keyboard cat',
    debug: true
};
export default config as Parameters<typeof MikroORM.init>[0];