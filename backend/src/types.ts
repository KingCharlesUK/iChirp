import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import { SessionData } from "express-session";

export type MyContext = {
    em: EntityManager<IDatabaseDriver<Connection>>;
    req: Request & { session: SessionData };
    res: Response;
};