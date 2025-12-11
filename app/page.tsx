import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-zinc-800 selection:text-zinc-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="text-xl font-semibold tracking-tighter cursor-pointer">Reacts Supabase</div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white cursor-pointer hover:bg-white/10"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-white cursor-pointer text-black hover:bg-zinc-200">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-400 backdrop-blur-xl">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            v22.97 Public Beta is live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent">
            Build your next idea, faster.
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            The complete starter kit for your next project. Includes
            authentication, dashboard, and a beautiful landing page out of the
            box.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="h-12 px-8 text-base cursor-pointer bg-white text-black hover:bg-zinc-200 w-full sm:w-auto"
              >
                Start Building Free
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 text-white w-full sm:w-auto"
              >
                View on GitHub
              </Button>
            </Link>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-500">
        <p>
          &copy; {new Date().getFullYear()} Rohithreacts  All rights reserved.
        </p>
      </footer>
    </div>
  );
}
