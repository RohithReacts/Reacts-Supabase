import { Navbar } from "@/components/templates/navbar";
import { User } from "@supabase/supabase-js";

interface HeaderProps {
  user?: User | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <div>
      <Navbar user={user} />
    </div>
  );
}
