import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
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
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await db.file.findMany({ where: { userId } });
  }),
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findUnique({
        where: { id: input.id, userId },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({ where: { id: input.id, userId } });

      return file;
    }),
});

export type Approuter = typeof appRouter;
