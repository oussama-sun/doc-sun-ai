import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    // check if the user is authenticated.
    const user = getKindeServerSession().getUser();
    if (!getKindeServerSession().isAuthenticated() || !user.id || !user.email)
      throw new TRPCError({ code: "UNAUTHORIZED" });
    // check if the user is in the database.
    const userdb = await db.user.findUnique({ where: { id: user.id } });
    // if the user is not in the database, create it.
    if (!userdb) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }
    return { success: true };
  }),
});

export type Approuter = typeof appRouter;
