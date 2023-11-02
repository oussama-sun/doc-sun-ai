import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");
  // check if the user is synced to the db.
  const userdb = await db.user.findUnique({ where: { id: user.id } });
  if (!userdb) redirect("/auth-callback?origin=dashboard");
  return <div>{user.email}</div>;
};

export default Page;
