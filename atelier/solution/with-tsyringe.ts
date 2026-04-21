// Bonus étape 3 — même design, mais le wiring est fait par un container.
// Nécessite : npm install tsyringe reflect-metadata
// et `import "reflect-metadata"` au tout début du point d'entrée.

import "reflect-metadata";
import { container, inject, injectable } from "tsyringe";
import type { SubscriberRepository, MailSender, Logger, Clock, Subscriber } from "./newsletter-service";

const TOKENS = {
  Repo: Symbol("SubscriberRepository"),
  Mailer: Symbol("MailSender"),
  Logger: Symbol("Logger"),
  Clock: Symbol("Clock"),
} as const;

@injectable()
export class NewsletterService {
  constructor(
    @inject(TOKENS.Repo) private readonly repo: SubscriberRepository,
    @inject(TOKENS.Mailer) private readonly mailer: MailSender,
    @inject(TOKENS.Logger) private readonly logger: Logger,
    @inject(TOKENS.Clock) private readonly clock: Clock,
  ) {}

  async sendDaily(): Promise<void> {
    const subs = await this.repo.findAll();
    const active = subs.filter((s: Subscriber) => !s.unsubscribed);
    for (const sub of active) await this.mailer.send(sub.email, "Hello!");
    this.logger.info(`[${this.clock.now().toISOString()}] sent ${active.length} emails`);
  }
}

// --- wiring (équivalent du composition root) ---
export function registerProd() {
  container.register<SubscriberRepository>(TOKENS.Repo, { useValue: { findAll: async () => [] } });
  container.register<MailSender>(TOKENS.Mailer, { useValue: { send: async () => {} } });
  container.register<Logger>(TOKENS.Logger, { useValue: { info: console.log } });
  container.register<Clock>(TOKENS.Clock, { useValue: { now: () => new Date() } });
}

// --- utilisation ---
// registerProd();
// const service = container.resolve(NewsletterService);
// await service.sendDaily();

// Remarque : les tests restent écrits avec `new NewsletterService(fakeRepo, ...)`.
// Le container est un détail d'assemblage, pas une dépendance du métier.
