import { notFound, redirect } from "next/navigation";

import { getSession } from "~/auth/server";
import { LoginForm } from "~/components/login";

export default async function Login() {
  const session = await getSession();

  if (session) {
    if (session.user.role === "admin") {
      redirect("/dashboard");
    } else {
      redirect(notFound());
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
