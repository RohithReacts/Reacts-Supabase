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
      <nav className="flex items-center justify-between px-6 py-4  border-white/10">
        
        
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="space-y-6 max-w-3xl">
          

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent">
            Build your next idea, faster. 
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            The complete starter kit for your next project. Includes
            authentication, dashboard, and a beautiful landing page out of the
            box.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <Button
                size="lg"
                variant="ghost"
                className="h-12 px-8 text-base cursor-pointer  w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
            <Link href="https://github.com/RohithReacts/Reacts-Supabase" target="_blank">
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

      
    </div>
  );
}
