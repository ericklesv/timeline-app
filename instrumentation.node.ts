import cron from "node-cron";
import { runTick } from "@/lib/telegramScheduler";

const g = globalThis as unknown as { __timelineCron?: boolean };

export function start() {
  if (g.__timelineCron) return;
  g.__timelineCron = true;

  cron.schedule("* * * * *", async () => {
    try {
      await runTick(new Date());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[timeline-cron] tick failed:", err);
    }
  });

  // eslint-disable-next-line no-console
  console.log("[timeline-cron] scheduled (every minute)");
}

start();
