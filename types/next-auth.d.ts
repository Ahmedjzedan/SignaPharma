import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      role: string
      /** Whether the user is banned. */
      isBanned: boolean
      id: string
    } & DefaultSession["user"]
  }

  interface User {
      role: string
      isBanned: boolean
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: string
    isBanned: boolean
  }
}
