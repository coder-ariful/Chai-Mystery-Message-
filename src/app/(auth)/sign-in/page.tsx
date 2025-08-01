'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button className="bg-amber-600 px-3 py-1 m-4 rounded cursor-pointer cursor-black" onClick={() => signIn()}>Sign in</button>
        </>
    )
}