import { SidebarNav } from "@/components/global/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

const sidebarNavItems = [
  {
    title: "General",
    href: "/settings/general",
  },
  {
    title: "Profile",
    href: "/settings/profile",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="from-cream via-softPink/10 to-softBlue/10 -m-8 min-h-screen bg-gradient-to-br p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="font-handwritten text-brown text-6xl font-bold drop-shadow-sm">Settings ✨</h1>
          <p className="text-brown/70 font-cute text-lg">Manage your account and make it uniquely yours! 🌸</p>
        </div>
        <Separator className="from-peach/30 via-softPink/30 to-softBlue/30 my-6 h-0.5 bg-gradient-to-r" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <div className="border-softPink/20 rounded-3xl border-2 bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <SidebarNav items={sidebarNavItems} />
            </div>
          </aside>
          <div className="flex-1 lg:max-w-2xl">
            <div className="border-softPink/20 rounded-3xl border-2 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
