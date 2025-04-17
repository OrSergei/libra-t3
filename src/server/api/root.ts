
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { BookRouter } from "./rooters/bookroute";

import {loanRouter} from "./rooters/loanroute"
import { userRouter } from "./rooters/userrouter";
import {readerRouter} from "./rooters/readersroute"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({

    /*тут трсп  */
    book: BookRouter,
    loan: loanRouter,
    user: userRouter,
    reader: readerRouter


    
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
