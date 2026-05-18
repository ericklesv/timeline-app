"use client";

import { motion } from "framer-motion";
import { useNow } from "@/hooks/useNow";
import { greetingFor, fmtLongDate } from "@/lib/date";

export function Greeting({ count }: { count: number }) {
  const now = useNow(60_000);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
      className="flex flex-col gap-1"
    >
      <div className="text-[11px] tracking-[0.18em] text-text-dim uppercase">
        {fmtLongDate(now)}
      </div>
      <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight">
        {greetingFor(now)} <span className="text-text-dim">👋</span>
      </h1>
      <p className="text-sm text-text-dim">
        {count === 0
          ? "Você não tem compromissos hoje. Aproveite o dia."
          : count === 1
          ? "Você possui 1 compromisso hoje."
          : `Você possui ${count} compromissos hoje.`}
      </p>
    </motion.div>
  );
}
