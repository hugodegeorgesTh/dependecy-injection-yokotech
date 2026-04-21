// Wiring manuel — "Composition Root"
// Le SEUL endroit où on instancie les implémentations concrètes.

import { OrderService, type Db, type Mailer, type Logger, type Order } from "./2-after";

// Implémentations prod
class PostgresDb implements Db {
  async save(order: Order) { /* vraie requête SQL */ }
}
class SendgridMailer implements Mailer {
  async send(to: string, body: string) { /* API Sendgrid */ }
}
class DatadogLogger implements Logger {
  info(msg: string) { /* envoi Datadog */ }
}

// Composition : on assemble une seule fois, au démarrage
export function buildOrderService(): OrderService {
  return new OrderService(
    new PostgresDb(),
    new SendgridMailer(),
    new DatadogLogger(),
  );
}

// En test/staging, on appellerait buildOrderService avec d'autres impls,
// ou on construirait directement OrderService avec des fakes.
