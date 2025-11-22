import { notFound, redirect } from "next/navigation";

import { getSession } from "~/auth/server";

export default async function HomePage() {
  const session = await getSession();

  if (!session) redirect("/login");

  if (session.user.role !== "admin") redirect(notFound());

  return null;
}
