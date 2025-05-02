
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { BookRouter } from "./rooters/bookroute";

import {loanRouter} from "./rooters/loanroute"
import { userRouter } from "./rooters/userrouter";
import {readerRouter} from "./rooters/readersroute"
import { reviewRouter } from "./rooters/bookReviewsroute";
import { showRouter } from "./rooters/bookShowroute";
import { paidUserRouter } from "./rooters/paidBooksroute";

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
    reader: readerRouter,
    reviews: reviewRouter,

    show: showRouter,
    payments: paidUserRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;


export const createCaller = createCallerFactory(appRouter);
