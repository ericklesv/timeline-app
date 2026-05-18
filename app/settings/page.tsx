"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  BellRing,
  CheckCircle2,
  Send,
  Shield,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { settingsService, type TelegramSettingsDTO } from "@/services/settings";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [settings, setSettings] = useState<TelegramSettingsDTO | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [toast, setToast] = useState<{
    type: "ok" | "err";
    msg: string;
  } | null>(null);

  useEffect(() => {
    settingsService.get().then(setSettings);
  }, []);

  function showToast(t: { type: "ok" | "err"; msg: string }) {
    setToast(t);
    setTimeout(() => setToast(null), 3200);
  }

  async function save(patch: Partial<TelegramSettingsDTO> & { botToken?: string }) {
    setSaving(true);
    try {
      const next = await settingsService.save(patch);
      setSettings(next);
      setTokenInput("");
      showToast({ type: "ok", msg: "Configurações salvas." });
    } catch {
      showToast({ type: "err", msg: "Erro ao salvar." });
    } finally {
      setSaving(false);
    }
  }

  async function test() {
    setTesting(true);
    try {
      const r = await settingsService.test();
      if (r.ok) showToast({ type: "ok", msg: "Mensagem de teste enviada!" });
      else
        showToast({
          type: "err",
          msg: `Falha: ${r.error ?? "verifique as credenciais"}`,
        });
    } finally {
      setTesting(false);
    }
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-dim">
        Carregando…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 px-5 sm:px-8 py-4 flex items-center gap-3 border-b border-line/60 glass">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-dim hover:text-text text-sm transition-colors"
        >
          <ArrowLeft size={15} /> Voltar
        </Link>
        <div className="ml-auto text-xs text-text-mute">Configurações</div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-1"
        >
          <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim">
            Integrações
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Telegram <span className="text-text-dim">·</span>{" "}
            <span className="text-text-dim font-normal">central de alertas</span>
          </h1>
          <p className="text-sm text-text-dim">
            Receba resumo diário, lembretes 30 min antes e alertas de eventos
            importantes direto no seu Telegram.
          </p>
        </motion.div>

        {/* Connection */}
        <section className="card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Shield size={16} />
            </div>
            <div>
              <div className="text-sm font-semibold">Conexão</div>
              <p className="text-xs text-text-dim">
                Crie um bot via{" "}
                <span className="text-text">@BotFather</span> no Telegram e cole
                o token + seu chat ID abaixo.
              </p>
            </div>
            <div className="ml-auto">
              <StatusPill
                ok={settings.hasToken && Boolean(settings.chatId)}
                label={
                  settings.hasToken && settings.chatId
                    ? "Configurado"
                    : "Pendente"
                }
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="token">Bot token</Label>
              <Input
                id="token"
                type="password"
                placeholder={
                  settings.hasToken
                    ? `••• ${settings.botToken}`
                    : "123456:ABC-DEF…"
                }
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
              />
              <p className="text-[11px] text-text-mute mt-1">
                Deixe em branco para manter o atual.
              </p>
            </div>
            <div>
              <Label htmlFor="chat">Chat ID</Label>
              <Input
                id="chat"
                placeholder="ex: 123456789"
                value={settings.chatId}
                onChange={(e) =>
                  setSettings({ ...settings, chatId: e.target.value })
                }
              />
              <p className="text-[11px] text-text-mute mt-1">
                Envie /start ao seu bot, depois pegue o id em
                api.telegram.org/bot&lt;token&gt;/getUpdates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              onClick={() =>
                save({
                  chatId: settings.chatId.trim(),
                  ...(tokenInput.trim() ? { botToken: tokenInput.trim() } : {}),
                })
              }
              disabled={saving}
            >
              {saving ? "Salvando…" : "Salvar"}
            </Button>
            <Button
              variant="subtle"
              onClick={test}
              disabled={testing || !settings.hasToken || !settings.chatId}
            >
              <Send size={14} /> {testing ? "Enviando…" : "Enviar teste"}
            </Button>
          </div>
        </section>

        {/* Notifications */}
        <section className="card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-bg-elev border border-line flex items-center justify-center text-accent">
              <BellRing size={16} />
            </div>
            <div>
              <div className="text-sm font-semibold">Notificações</div>
              <p className="text-xs text-text-dim">
                Controle o que o bot envia automaticamente.
              </p>
            </div>
          </div>

          <Toggle
            label="Ativar bot"
            description="Liga / desliga todas as notificações automáticas."
            checked={settings.enabled}
            onChange={(v) => save({ enabled: v })}
          />

          <div className="hairline" />

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="digest">Horário do resumo diário</Label>
              <Input
                id="digest"
                type="time"
                value={settings.digestTime}
                onChange={(e) =>
                  setSettings({ ...settings, digestTime: e.target.value })
                }
                onBlur={() => save({ digestTime: settings.digestTime })}
              />
            </div>
            <div>
              <Label htmlFor="rem">Lembrete (minutos antes)</Label>
              <Input
                id="rem"
                type="number"
                min={5}
                max={240}
                value={settings.reminderMinutes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    reminderMinutes: Math.max(
                      5,
                      Math.min(240, Number(e.target.value) || 30)
                    ),
                  })
                }
                onBlur={() =>
                  save({ reminderMinutes: settings.reminderMinutes })
                }
              />
            </div>
          </div>

          <div className="hairline" />

          <Toggle
            label="Alertar eventos urgentes"
            description="Envia mensagem destacada para itens marcados como urgentes."
            checked={settings.notifyUrgent}
            onChange={(v) => save({ notifyUrgent: v })}
          />
          <Toggle
            label="Alertar eventos importantes"
            description="Envia mensagem destacada para itens marcados como importantes."
            checked={settings.notifyImportant}
            onChange={(v) => save({ notifyImportant: v })}
          />
        </section>

        <section className="card p-5 space-y-2 text-xs text-text-dim leading-relaxed">
          <div className="text-[11px] uppercase tracking-wider text-text-mute font-medium">
            Como funciona
          </div>
          <p>
            O servidor verifica seus compromissos <b>a cada minuto</b>. Quando
            chega a hora do resumo, ele envia a lista do dia. Para cada
            compromisso com horário, envia um lembrete{" "}
            <b>{settings.reminderMinutes} min antes</b>. Eventos urgentes /
            importantes recebem mensagem própria a partir do horário do resumo.
          </p>
          <p>
            Os dados são armazenados localmente em <code>data/</code> e podem
            ser migrados para Supabase trocando apenas <code>lib/serverStore</code>.
          </p>
        </section>
      </main>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed bottom-5 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm shadow-soft",
            toast.type === "ok"
              ? "bg-ok/10 border-ok/30 text-ok"
              : "bg-danger/10 border-danger/30 text-danger"
          )}
        >
          {toast.type === "ok" ? (
            <CheckCircle2 size={15} />
          ) : (
            <XCircle size={15} />
          )}
          {toast.msg}
        </motion.div>
      )}
    </div>
  );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium border",
        ok
          ? "bg-ok/10 text-ok border-ok/30"
          : "bg-bg-elev text-text-dim border-line"
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          ok ? "bg-ok shadow-[0_0_6px_#22c55e]" : "bg-text-mute"
        )}
      />
      {label}
    </span>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <p className="text-xs text-text-dim mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "shrink-0 relative w-10 h-6 rounded-full transition-colors border",
          checked
            ? "bg-accent border-accent"
            : "bg-bg-elev border-line hover:border-line"
        )}
        aria-pressed={checked}
      >
        <span
          className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-[0_2px_6px_rgba(0,0,0,0.4)]",
            checked ? "left-5" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}
