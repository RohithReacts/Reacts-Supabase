import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/templates/header";
import { SalesTable } from "@/components/dashboard/sales-table";
import Footer from "@/components/templates/footer";
import AboutPage from "@/components/templates/about";
import Connect from "@/components/templates/connect";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div>
      <Header />
      <div className="p-8 mt-15">
        <SalesTable />
      </div>
      <div>
        <AboutPage/>
      </div>
      <Connect/>
      <Footer/>
    </div>
  );
}
