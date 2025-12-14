import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { Header } from "@/components/templates/header";
import { SalesTable } from "@/components/dashboard/sales-table";
import { Footer } from "@/components/templates/footer";
import AboutPage from "@/components/templates/about";
import Connect from "@/components/templates/connect";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <Header user={user} />

      <main className="px-20 py-8 mt-16 space-y-16">
        {/* Sales Section */}
        <section>
          <SalesTable />
        </section>

        {/* About Section */}
        <section>
          <AboutPage />
        </section>

        {/* Connect Section */}
        <section>
          <Connect />
        </section>
      </main>

      <Footer />
    </div>
  );
}
