import Link from "next/link";
import React from "react";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

// import { SignInLink } from "./signin-link";
import { Navbar } from "./navBar";

export async function MyApp({ children }: { children: React.ReactNode }){
    const session = await auth()

    return (
        <HydrateClient>

        <header>{ session ? <Navbar session={session} /> : 
            <>
                <Link href={"/"} className="btn">
                    Home
                </Link>
                {/* <SignInLink /> */}
            </>
        }</header>

        <main >
            { children }
        </main>
        </HydrateClient>
    )
}