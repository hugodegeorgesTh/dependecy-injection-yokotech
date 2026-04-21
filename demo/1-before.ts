// AVANT — couplage fort, intestable, inflexible

type Order = { id: string; email: string; total: number };

class PostgresClient {
  async save(order: Order): Promise<void> {
    console.log("[PG] INSERT order", order.id);
  }
}

class SendgridMailer {
  async send(to: string, body: string): Promise<void> {
    console.log(`[Sendgrid] to=${to} body=${body}`);
  }
}

class DatadogLogger {
  info(msg: string) {
    console.log(`[DD] ${msg}`);
  }
}

export class OrderService {
  private db = new PostgresClient();
  private mailer = new SendgridMailer();
  private logger = new DatadogLogger();

  async checkout(order: Order): Promise<void> {
    await this.db.save(order);
    await this.mailer.send(order.email, `Merci pour votre commande ${order.id}`);
    this.logger.info(`order ${order.id} placed`);
  }
}

// Problèmes :
// - Pour tester checkout(), il faut une vraie DB Postgres + un vrai compte Sendgrid
// - Impossible de substituer le mailer (ex : passer à SES)
// - Les dépendances sont invisibles depuis l'extérieur de la classe
