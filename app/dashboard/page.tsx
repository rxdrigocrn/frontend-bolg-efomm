"use client";

import { useEffect } from "react";
import { usePostStore } from "@/store/postStore";
import { useAuthStore } from "@/store/authStore";
import { useLogsStore } from "@/store/logsStore";
import { FileText, CheckCircle2, PenTool, Plus } from "lucide-react";

export default function DashboardHome() {
  const { posts, fetchPosts } = usePostStore();
  const { user } = useAuthStore();
  const { logs, fetchLogs, loading, error } = useLogsStore();

  useEffect(() => {
    fetchPosts();
    if (user?.role === "PRESIDENTE") {
      fetchLogs({ limit: 10 });
    }
  }, []);

  const total = posts?.length || 0;
  const publicados = posts?.filter((p) => p.publicado).length || 0;
  const rascunhos = total - publicados;

  return (
    <div className="space-y-8 fade-in">
      
      {/* Cabeçalho de Boas-vindas */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Olá, {user?.nome?.split(' ')[0] || "Redator"}! 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Aqui está o resumo das atividades do jornal de hoje.
          </p>
        </div>

       {/*
        <button className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm">
          <Plus size={16} />
          Nova Matéria
        </button>
        */}
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Total de Publicações" 
          value={total} 
          icon={<FileText size={20} />} 
          trend=""
          trendLabel="esta semana"
          color="blue"
        />
        <MetricCard 
          title="Matérias Publicadas" 
          value={publicados} 
          icon={<CheckCircle2 size={20} />} 
          trend="Ativos no site"
          color="emerald"
        />
        <MetricCard 
          title="Rascunhos Pendentes" 
          value={rascunhos} 
          icon={<PenTool size={20} />} 
          trend="Aguardando revisão"
          color="amber"
        />
      </div>

      {/* Seção de Conteúdo (Logs) — apenas para PRESIDENTE */}
      {user?.role === "PRESIDENTE" && (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6 mt-8">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Atividade Recente</h3>

          <div className="rounded-xl bg-slate-50/50 p-4">
            {loading && (
              <div className="py-8 text-center text-sm text-slate-500">Carregando logs...</div>
            )}

            {!loading && logs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
                <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                  <FileText className="text-slate-400" size={24} />
                </div>
                <p className="text-sm font-medium text-slate-600">Nenhuma atividade recente.</p>
                <p className="text-xs text-slate-400 mt-1">Aguarde novas entradas de log.</p>
              </div>
            )}

            {!loading && logs.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Data</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Ação</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Entidade</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Mensagem</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Autor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {logs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                            {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">
                            {log.action || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {log.entityType || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {log.summary || log.message || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                            {log.user?.nome || log.user?.email || log.user?.id || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {error && <div className="text-xs text-rose-600 mt-3">{error}</div>}
          </div>
        </div>
      )}

    </div>
  );
}

function MetricCard({ title, value, icon, trend, trendLabel, color }: any) {
  // Mapa de cores para os ícones
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600"
  }[color as string] || "bg-slate-50 text-slate-600";

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-4xl font-bold mt-2 text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl transition-colors ${colorStyles} group-hover:scale-110 duration-300`}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className={`font-medium ${trend.includes('+') ? 'text-emerald-600' : 'text-slate-500'}`}>
            {trend}
          </span>
          {trendLabel && <span className="text-slate-400">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}