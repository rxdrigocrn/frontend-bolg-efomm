"use client";

import { useRouter, usePathname } from "next/navigation";
import { 
  Home, 
  FileText, 
  Users, 
  LogOut, 
  Bell, 
  Search,
  Newspaper,
  User,
  Tags
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-white border-r border-slate-200/80 flex flex-col shadow-sm relative z-10">
        
        {/* Logo Área */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-900 p-1.5 rounded-lg shadow-sm">
              <Newspaper className="text-white w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-blue-950">
              Canal 16
            </h1>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Menu Principal
          </p>
          
          <SidebarItem
            icon={<Home size={18} strokeWidth={2.5} />}
            label="Dashboard"
            active={pathname === "/dashboard"}
            onClick={() => router.push("/dashboard")}
          />

          <SidebarItem
            icon={<FileText size={18} strokeWidth={2.5} />}
            label="Notícias"
            active={pathname.includes("/posts")}
            onClick={() => router.push("/dashboard/posts")}
          />
          
          <SidebarItem
            icon={<User size={18} strokeWidth={2.5} />}
            label="Meu Perfil"
            active={pathname.includes("/profile")}
            onClick={() => router.push("/dashboard/profile")}
          />

          {user?.role === "PRESIDENTE" && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Administração
                </p>
              </div>
              <SidebarItem
                icon={<Users size={18} strokeWidth={2.5} />}
                label="Equipe"
                active={pathname.includes("/users")}
                onClick={() => router.push("/dashboard/users")}
              />
              <SidebarItem
                icon={<Tags size={18} strokeWidth={2.5} />}
                label="Tags"
                active={pathname.includes("/tags")}
                onClick={() => router.push("/dashboard/tags")}
              />
            </>
          )}
        </nav>

        {/* Perfil do Usuário na Sidebar */}
        <div className="p-4 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-3 p-2 rounded-xl mb-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-900 font-bold">
              {user?.nome?.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-800">
                {user?.nome}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={() => {
              void logout().finally(() => {
                router.push("/login");
              });
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors border border-slate-200/60"
          >
            <LogOut size={16} /> Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-20">
          
          {/* Busca (Fictícia, mas dá cara de SaaS) */}
          <div className="flex items-center text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-sm transition-all w-64">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Ações */}
          <div className="flex items-center gap-4 text-slate-500">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Área renderizada das páginas */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 group
      ${active 
        ? "bg-blue-900 text-white shadow-md shadow-blue-900/20" 
        : "text-slate-600 hover:bg-blue-50/80 hover:text-blue-900"
      }`}
    >
      <div className={`${active ? "text-blue-300" : "text-slate-400 group-hover:text-blue-600"} transition-colors`}>
        {icon}
      </div>
      {label}
    </button>
  );
}