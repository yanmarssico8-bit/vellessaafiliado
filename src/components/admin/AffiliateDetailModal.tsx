import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  ExternalLink,
  Flame,
  Instagram,
  Link2,
  Mail,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  TrendingUp,
  User,
  X,
  Edit2,
  Trash2,
  Pause,
  Play,
  Activity,
  BarChart2,
  FileText,
} from "lucide-react";
import { type DynamicModule, isSuperAdmin } from "@/lib/affiliate-store";

interface AffiliateDetailModalProps {
  affiliate: {
    id: string;
    rawId?: string;
    name: string;
    email: string;
    phone?: string;
    instagram?: string;
    level: string;
    role?: string;
    status?: string;
    date?: string;
    createdAt?: string;
    lastLoginAt?: string;
    loginCount?: number;
    completedLessonIds?: string[];
    lastLessonWatchedTitle?: string;
    lastLessonWatchedAt?: string;
    // Telemetria expandida
    watchProgressPerLesson?: Record<string, number>;
    watchSecondsPerLesson?: Record<string, number>;
    lessonStartedAt?: Record<string, string>;
    downloadedMaterials?: { materialId: string; materialName: string; format: string; downloadedAt: string }[];
    clickedLinks?: { linkId: string; linkLabel: string; linkUrl: string; clickedAt: string }[];
    onboardingCompleted?: boolean;
    trafficExperience?: "yes" | "no";
    trafficInvestment?: string;
    trafficWillingness?: "yes" | "no";
    trafficBudget?: string;
    onboardingAnswers?: Record<string, any>;
  };
  modulesList: DynamicModule[];
  onClose: () => void;
  onEdit?: (affiliate: any) => void;
  onToggleStatus?: (affiliate: any) => void;
  onDelete?: (affiliate: any) => void;
}

export function formatRelativeTime(dateString?: string): { text: string; color: string } {
  if (!dateString) return { text: "Nunca acessou", color: "text-muted-foreground" };
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return { text: "Agora mesmo", color: "text-emerald-400" };
  }
  if (diffHours < 24) {
    return {
      text: `Hoje às ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
      color: "text-emerald-400",
    };
  }
  if (diffDays === 1) {
    return { text: "Ontem", color: "text-blue-400" };
  }
  if (diffDays < 7) {
    return { text: `Há ${diffDays} dias`, color: "text-blue-400" };
  }
  if (diffDays < 30) {
    return { text: `Há ${diffDays} dias`, color: "text-amber-400" };
  }
  return { text: `Inativo há mais de 30 dias`, color: "text-rose-400" };
}

export function AffiliateDetailModal({
  affiliate,
  modulesList,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
}: AffiliateDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "activity">("overview");

  // Trava de rolagem no body da página
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Coleta todas as aulas cadastradas
  const allLessons = modulesList.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title, moduleId: m.id }))
  );

  const completedIds = affiliate.completedLessonIds || [];
  const completedCount = allLessons.filter((l) => completedIds.includes(l.id)).length;
  const totalCount = allLessons.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const lastAccess = formatRelativeTime(affiliate.lastLoginAt);
  const loginCount = affiliate.loginCount || 1;

  // Mensagem personalizada de WhatsApp para mentoria
  const cleanPhone = (affiliate.phone || "").replace(/\D/g, "");
  const firstName = affiliate.name.split(" ")[0];
  let mentorMessage = "";
  if (affiliate.trafficExperience === "yes") {
    mentorMessage = `Olá ${firstName}! Aqui é da equipe de suporte e escala da Vellessa. Vi no seu cadastro que você já investe em tráfego pago (${affiliate.trafficInvestment || "ativo"}). Temos criativos validados e estratégias de alta conversão na Logzz prontos para sua operação. Como posso te apoiar hoje?`;
  } else if (affiliate.trafficExperience === "no" && affiliate.trafficWillingness === "yes") {
    mentorMessage = `Olá ${firstName}! Aqui é da equipe Vellessa. Notei que você tem interesse em começar a anunciar com tráfego pago (${affiliate.trafficBudget || "orçamento inicial"}). Quer receber nosso direcionamento rápido para seus primeiros testes sem queimar verba?`;
  } else if (progressPct >= 70) {
    mentorMessage = `Olá ${firstName}! Aqui é da equipe Vellessa. Vi que você já concluiu ${progressPct}% das aulas da Academia! Meus parabéns! Gostaria de uma mentoria rápida para otimizar suas campanhas na Logzz?`;
  } else if (progressPct > 0) {
    mentorMessage = `Olá ${firstName}! Aqui é da equipe Vellessa. Notei que você já iniciou o treinamento da Academia Vellessa (${progressPct}% concluído). Posso te ajudar a tirar alguma dúvida da aula para acelerar seus resultados?`;
  } else {
    mentorMessage = `Olá ${firstName}! Aqui é da equipe Vellessa. Vi que você se cadastrou na nossa plataforma de afiliados. Precisa de algum apoio para dar o primeiro passo e começar a faturar?`;
  }

  const waLink = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith("55") ? cleanPhone : "55" + cleanPhone}?text=${encodeURIComponent(
        mentorMessage
      )}`
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-3xl border border-white/10 bg-card shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. HEADER FIXO */}
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-4 shrink-0 bg-card/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-gradient text-lg font-bold text-primary-foreground shadow-gold shrink-0">
              {affiliate.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">{affiliate.name}</h2>
                <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-bold text-gold border border-gold/30">
                  {affiliate.level}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                <span>{affiliate.email}</span>
                <span>·</span>
                <span className="font-mono text-gold">{affiliate.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ABAS DE NAVEGAÇÃO */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-0 border-b border-border/40 shrink-0 bg-card/95 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-t-xl border-b-2 transition ${
              activeTab === "overview"
                ? "border-gold text-gold bg-gold/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" /> Visão Geral
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-t-xl border-b-2 transition ${
              activeTab === "activity"
                ? "border-gold text-gold bg-gold/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="h-3.5 w-3.5" /> Atividade Detalhada
            {((affiliate.downloadedMaterials?.length || 0) + (affiliate.clickedLinks?.length || 0)) > 0 && (
              <span className="ml-1 rounded-full bg-gold/20 text-gold text-[9px] font-bold px-1.5 py-0.5">
                {(affiliate.downloadedMaterials?.length || 0) + (affiliate.clickedLinks?.length || 0)}
              </span>
            )}
          </button>
        </div>

        {/* 2. CORPO ROLÁVEL COM SCROLLBAR ELEGANTE */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 overscroll-contain custom-scrollbar">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* 4 Cards de Métricas de Engajamento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Card 1: Progresso das Aulas */}
            <div className="rounded-2xl border border-white/10 bg-muted/20 p-4 space-y-2">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-gold" /> Progresso de Aulas
              </span>
              <p className="text-xl font-bold text-foreground">
                {progressPct}%
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gold-gradient h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">
                {completedCount} de {totalCount} aulas
              </p>
            </div>

            {/* Card 2: Último Acesso */}
            <div className="rounded-2xl border border-white/10 bg-muted/20 p-4 space-y-1.5">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gold" /> Último Acesso
              </span>
              <p className={`text-sm font-semibold truncate ${lastAccess.color}`}>
                {lastAccess.text}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {affiliate.lastLoginAt
                  ? new Date(affiliate.lastLoginAt).toLocaleDateString("pt-BR")
                  : "Sem histórico"}
              </p>
            </div>

            {/* Card 3: Frequência & Sessões */}
            <div className="rounded-2xl border border-white/10 bg-muted/20 p-4 space-y-1.5">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-gold" /> Total de Acessos
              </span>
              <p className="text-xl font-bold text-foreground">
                {loginCount} {loginCount === 1 ? "sessão" : "sessões"}
              </p>
              <span
                className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  loginCount >= 10
                    ? "bg-emerald-500/10 text-emerald-400"
                    : loginCount >= 3
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {loginCount >= 10 ? "Alta Frequência" : loginCount >= 3 ? "Regular" : "Iniciante"}
              </span>
            </div>

            {/* Card 4: Data de Cadastro */}
            <div className="rounded-2xl border border-white/10 bg-muted/20 p-4 space-y-1.5">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gold" /> Cadastrado em
              </span>
              <p className="text-sm font-semibold text-foreground">
                {affiliate.date ||
                  (affiliate.createdAt
                    ? new Date(affiliate.createdAt).toLocaleDateString("pt-BR")
                    : "—")}
              </p>
              <p className="text-[10px] text-muted-foreground">Membro da Comunidade</p>
            </div>
          </div>

          {/* Card de Qualificação de Tráfego Pago & Onboarding */}
          <div className="rounded-2xl border border-white/10 bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gold" /> Qualificação de Tráfego Pago
              </span>
              {affiliate.onboardingCompleted || (affiliate.phone && affiliate.phone.trim().length >= 10) ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Onboarding Concluído
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400">
                  <Clock className="h-3 w-3" /> Onboarding Pendente
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-card/60 border border-white/5 p-3 space-y-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Experiência com Tráfego
                </p>
                <p className="font-semibold text-foreground">
                  {affiliate.trafficExperience === "yes"
                    ? "Já investe em tráfego pago"
                    : affiliate.trafficExperience === "no"
                    ? "Nunca investiu em tráfego pago"
                    : "Não informado / Pendente"}
                </p>
              </div>

              <div className="rounded-xl bg-card/60 border border-white/5 p-3 space-y-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {affiliate.trafficExperience === "yes"
                    ? "Volume Investido / Mês"
                    : "Disposição / Orçamento de Teste"}
                </p>
                <p className="font-semibold text-gold">
                  {affiliate.trafficExperience === "yes"
                    ? affiliate.trafficInvestment || "Não especificado"
                    : affiliate.trafficWillingness === "yes"
                    ? `Disposto(a) a investir (${affiliate.trafficBudget || "A definir"})`
                    : affiliate.trafficWillingness === "no"
                    ? "Não tem interesse agora (Foco Orgânico)"
                    : "Pendente"}
                </p>
              </div>
            </div>

            {affiliate.phone && (
              <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground border-t border-white/5">
                <span className="flex items-center gap-1.5 font-mono text-foreground">
                  <Phone className="h-3.5 w-3.5 text-emerald-400" /> {affiliate.phone}
                </span>
                <span className="text-[10px] text-muted-foreground">WhatsApp Cadastrado</span>
              </div>
            )}
          </div>

          {/* Barra de Ação Rápida: Mentoria WhatsApp */}
          {cleanPhone ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Apoio Direto no WhatsApp
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Envie uma mensagem contextualizada para impulsionar os resultados de {affiliate.name.split(" ")[0]}.
                  </p>
                </div>
              </div>
              <a
                href={waLink!}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-4 py-2 text-xs shadow-md transition shrink-0"
              >
                <MessageCircle className="h-4 w-4" /> Enviar Mensagem de Apoio
              </a>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-muted/10 p-3.5 text-xs text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground/60" />
              <span>Afiliado(a) não possui número de WhatsApp cadastrado no perfil.</span>
            </div>
          )}

          {/* Trilha de Aulas e Módulos: Raio-X Detalhado */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                Raio-X da Trilha de Capacitação
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {completedCount} concluídas de {totalCount} aulas
              </span>
            </div>

            {modulesList.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                Nenhum módulo cadastrado na plataforma ainda.
              </p>
            ) : (
              <div className="space-y-3 divide-y divide-border/20">
                {modulesList.map((m, mIdx) => {
                  const modLessons = m.lessons;
                  const modCompleted = modLessons.filter((l) => completedIds.includes(l.id)).length;
                  const modTotal = modLessons.length;
                  const modPct = modTotal > 0 ? Math.round((modCompleted / modTotal) * 100) : 0;

                  return (
                    <div key={m.id} className="pt-3 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                            Módulo {mIdx + 1}
                          </span>
                          <h4 className="text-sm font-semibold text-foreground">{m.title}</h4>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">
                          {modCompleted}/{modTotal} ({modPct}%)
                        </span>
                      </div>

                      <div className="grid gap-1.5 pl-2">
                        {modLessons.map((l) => {
                          const isDone = completedIds.includes(l.id);
                          return (
                            <div
                              key={l.id}
                              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition border ${
                                isDone
                                  ? "bg-emerald-950/20 border-emerald-500/20 text-foreground"
                                  : "bg-muted/20 border-transparent text-muted-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                {isDone ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                                )}
                                <span className={`font-medium ${isDone ? "text-foreground" : ""}`}>
                                  {l.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                                <span>{l.duration}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                                    isDone
                                      ? "bg-emerald-500/10 text-emerald-400"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {isDone ? "Concluída" : "Pendente"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-6">
              {/* 4 Mini Cards de Métricas da Atividade */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Card 1: Aulas Iniciadas */}
                <div className="rounded-2xl border border-white/10 bg-muted/20 p-4 space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                    <Play className="h-3.5 w-3.5 text-gold" /> Aulas Iniciadas
                  </span>
                  <p className="text-xl font-bold text-foreground">
                    {Object.keys(affiliate.lessonStartedAt || {}).length}
                    <span className="text-xs text-muted-foreground font-normal ml-1">/ {totalCount}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {completedCount} aulas concluídas
                  </p>
                </div>

                {/* Card 2: Downloads Realizados */}
                <div className="rounded-2xl border border-white/10 bg-muted/20 p-4 space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5 text-emerald-400" /> Materiais Baixados
                  </span>
                  <p className="text-xl font-bold text-foreground">
                    {affiliate.downloadedMaterials?.length || 0}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {(affiliate.downloadedMaterials?.length || 0) > 0 ? "Ativo em downloads" : "Nenhum download"}
                  </p>
                </div>

                {/* Card 3: Cliques em Links */}
                <div className="rounded-2xl border border-white/10 bg-muted/20 p-4 space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5 text-blue-400" /> Links Clicados
                  </span>
                  <p className="text-xl font-bold text-foreground">
                    {affiliate.clickedLinks?.length || 0}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Páginas e referências
                  </p>
                </div>

                {/* Card 4: Onde Parou */}
                <div className="rounded-2xl border border-white/10 bg-muted/20 p-4 space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gold" /> Onde Parou
                  </span>
                  <p className="text-xs font-semibold text-foreground truncate" title={affiliate.lastLessonWatchedTitle || "Nenhuma aula assistida"}>
                    {affiliate.lastLessonWatchedTitle || "Nenhuma aula"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {affiliate.lastLessonWatchedAt
                      ? new Date(affiliate.lastLessonWatchedAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
                      : "Sem registro"}
                  </p>
                </div>
              </div>

              {/* Seção 1: Progresso Detalhado e Minutagem por Aula */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <Play className="h-4 w-4 text-gold" /> Progresso Detalhado das Aulas
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono">
                    {completedCount} de {totalCount} concluídas ({progressPct}%)
                  </span>
                </div>

                <div className="space-y-3 divide-y divide-border/20">
                  {modulesList.map((m, mIdx) => (
                    <div key={m.id} className="pt-3 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gold">
                          Módulo {mIdx + 1}: {m.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {m.lessons.filter((l) => completedIds.includes(l.id)).length}/{m.lessons.length}
                        </span>
                      </div>

                      <div className="grid gap-2 pl-2">
                        {m.lessons.map((l) => {
                          const isDone = completedIds.includes(l.id);
                          const pct = isDone
                            ? 100
                            : Math.min(100, affiliate.watchProgressPerLesson?.[l.id] || 0);
                          const startedAt = affiliate.lessonStartedAt?.[l.id];
                          const watchedSec = affiliate.watchSecondsPerLesson?.[l.id];

                          return (
                            <div
                              key={l.id}
                              className="rounded-xl border border-white/5 bg-card/60 p-3 space-y-2"
                            >
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  {isDone ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                  ) : pct > 0 ? (
                                    <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                                  )}
                                  <span className={`font-medium truncate ${isDone ? "text-foreground font-semibold" : pct > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                                    {l.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                                  <span className="text-muted-foreground">{l.duration}</span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      isDone
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : pct > 0
                                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {isDone ? "100% Concluída" : pct > 0 ? `${pct}% Assistido` : "Não iniciada"}
                                  </span>
                                </div>
                              </div>

                              {/* Barra de progresso visual */}
                              <div className="w-full bg-muted/40 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    isDone
                                      ? "bg-emerald-400"
                                      : pct > 0
                                      ? "bg-amber-400"
                                      : "bg-transparent"
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>

                              {(startedAt || watchedSec) && (
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5 font-mono">
                                  <span>
                                    {startedAt
                                      ? `Iniciada em: ${new Date(startedAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}`
                                      : "Não registrada"}
                                  </span>
                                  {watchedSec ? (
                                    <span>Tempo assistido: ~{Math.floor(watchedSec / 60)}m {watchedSec % 60}s</span>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção 2: Histórico de Materiais Baixados */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <Download className="h-4 w-4 text-emerald-400" /> Materiais Baixados
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono">
                    {affiliate.downloadedMaterials?.length || 0} registro(s)
                  </span>
                </div>

                {(affiliate.downloadedMaterials || []).length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 p-6 text-center space-y-1">
                    <Download className="h-6 w-6 text-muted-foreground/40 mx-auto" />
                    <p className="text-xs text-muted-foreground">Nenhum material baixado por este afiliado até o momento.</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {[...(affiliate.downloadedMaterials || [])].reverse().map((d, idx) => (
                      <div
                        key={`${d.materialId}-${d.downloadedAt}-${idx}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-card/60 p-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                            <Download className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{d.materialName}</p>
                            <span className="inline-block uppercase font-mono text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                              {d.format || "Arquivo"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 text-[11px] font-mono text-muted-foreground">
                          <p>{new Date(d.downloadedAt).toLocaleDateString("pt-BR")}</p>
                          <p className="text-[10px] text-muted-foreground/70">{new Date(d.downloadedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Seção 3: Histórico de Links Clicados */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-blue-400" /> Links de Apoio Clicados
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono">
                    {affiliate.clickedLinks?.length || 0} clique(s)
                  </span>
                </div>

                {(affiliate.clickedLinks || []).length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 p-6 text-center space-y-1">
                    <Link2 className="h-6 w-6 text-muted-foreground/40 mx-auto" />
                    <p className="text-xs text-muted-foreground">Nenhum clique em links registrado até o momento.</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {[...(affiliate.clickedLinks || [])].reverse().map((c, idx) => (
                      <div
                        key={`${c.linkId}-${c.clickedAt}-${idx}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-card/60 p-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
                            <Link2 className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{c.linkLabel || "Link Oficial"}</p>
                            <a
                              href={c.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-gold hover:underline truncate max-w-[260px] sm:max-w-md"
                            >
                              {c.linkUrl} <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                            </a>
                          </div>
                        </div>
                        <div className="text-right shrink-0 text-[11px] font-mono text-muted-foreground">
                          <p>{new Date(c.clickedAt).toLocaleDateString("pt-BR")}</p>
                          <p className="text-[10px] text-muted-foreground/70">{new Date(c.clickedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. FOOTER FIXO (Sempre Visível) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-4 border-t border-border/40 shrink-0 bg-card/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 flex-wrap">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(affiliate);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Editar Cadastro
              </button>
            )}
            {onToggleStatus && !isSuperAdmin(affiliate.email) && (
              <button
                type="button"
                onClick={() => {
                  onToggleStatus(affiliate);
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  affiliate.status === "Suspenso" || affiliate.status === "suspended"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                }`}
              >
                {affiliate.status === "Suspenso" || affiliate.status === "suspended" ? (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    Reativar Acesso
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    Suspender Acesso
                  </>
                )}
              </button>
            )}
            {onDelete && !isSuperAdmin(affiliate.email) && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(affiliate);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-2 text-xs font-semibold hover:bg-muted transition text-foreground cursor-pointer text-center"
          >
            Fechar Raio-X
          </button>
        </div>
      </div>
    </div>
  );
}
