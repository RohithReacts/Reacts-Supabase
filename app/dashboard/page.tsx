import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signout } from "../auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <form action={signout}>
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10 text-zinc-100"
            >
              Sign Out
            </Button>
          </form>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-white/10 bg-white/5 text-zinc-100">
            <CardHeader>
              <CardTitle className="text-lg">Welcome Back</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400">
                You are logged in as{" "}
                <span className="font-semibold text-zinc-100">
                  {user.email}
                </span>
              </p>
              {user.user_metadata?.full_name && (
                <p className="mt-2 text-zinc-400">
                  Name:{" "}
                  <span className="font-semibold text-zinc-100">
                    {user.user_metadata.full_name}
                  </span>
                </p>
              )}
            </CardContent>
          </Card>

        
        </div>
      </div>
    </div>
  );
}
