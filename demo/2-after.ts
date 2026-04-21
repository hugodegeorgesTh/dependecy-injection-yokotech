// APRÈS — DI par constructeur, dépendances sur des interfaces

export type Order = { id: string; email: string; total: number };

export interface Db {
  save(order: Order): Promise<void>;
}

export interface Mailer {
  send(to: string, body: string): Promise<void>;
}

export interface Logger {
  info(msg: string): void;
}

export class OrderService {
  constructor(
    private readonly db: Db,
    private readonly mailer: Mailer,
    private readonly logger: Logger,
  ) {}

  async checkout(order: Order): Promise<void> {
    await this.db.save(order);
    await this.mailer.send(order.email, `Merci pour votre commande ${order.id}`);
    this.logger.info(`order ${order.id} placed`);
  }
}

// Les dépendances sont maintenant :
// - Explicites (dans la signature du constructeur)
// - Abstraites (on dépend d'interfaces, pas d'implémentations concrètes)
// - Injectables (on peut fournir n'importe quelle implémentation)
