import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";

const t = initTRPC.create();

const middlware = t.middleware;

const isAuth = middlware(async (opts) => {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!isAuthenticated()) throw new TRPCError({ code: "UNAUTHORIZED" });

  const user = getUser();

  return opts.next({ ctx: { userId: user.id!, user } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
