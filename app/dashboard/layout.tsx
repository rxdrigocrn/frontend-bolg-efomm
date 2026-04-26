"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Users,
  LogOut,
  Menu, // Ícone para abrir
  X,    // Ícone para fechar
  User,
  Tags,
  Info,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  // Estado para controlar o menu mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fecha a sidebar automaticamente quando a rota muda (no mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    void logout().finally(() => {
      router.push("/login");
    });
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      
      {/* OVERLAY (Aparece apenas no mobile quando o menu está aberto) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:shadow-sm
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo Área */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Link href="/noticias">
              <img src="/img/logo.jpg" alt="Logo" className="w-8 h-8 object-cover rounded-lg" />
            </Link>
            <h1 className="text-lg font-bold tracking-tight text-blue-950">
              Jornal Canal 16
            </h1>
          </div>
          {/* Botão fechar (apenas mobile) */}
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-[10px]">
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
              <div className="pt-4 pb-2 border-t border-slate-50 mt-4">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-[10px]">
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
              <SidebarItem
                icon={<Info size={18} strokeWidth={2.5} />}
                label="Gerência"
                active={pathname.includes("/sobre")}
                onClick={() => router.push("/dashboard/sobre")}
              />
            </>
          )}
        </nav>

        {/* Perfil e Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 mb-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} className="w-9 h-9 object-cover rounded-full" alt="Avatar" />
              ) : (
                user?.nome?.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-800">{user?.nome}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border border-slate-200 shadow-sm"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Mobile/Desktop */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-30">
          
          <div className="flex items-center gap-4">
            {/* Botão Hambúrguer - Visível apenas no mobile */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <h2 className="text-sm lg:text-base font-semibold text-slate-700 capitalize">
              {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
             {/* Aqui você pode colocar notificações ou busca mobile */}
          </div>
        </header>

        {/* Área renderizada das páginas */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
};

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 group
      ${
        active
          ? "bg-blue-900 text-white shadow-md shadow-blue-900/20"
          : "text-slate-600 hover:bg-blue-50 hover:text-blue-900"
      }`}
    >
      <div className={`${active ? "text-blue-300" : "text-slate-400 group-hover:text-blue-600"} transition-colors`}>
        {icon}
      </div>
      <span className="truncate">{label}</span>
    </button>
  );
}