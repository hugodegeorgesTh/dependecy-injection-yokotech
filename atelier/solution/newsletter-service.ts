export type Subscriber = { email: string; unsubscribed: boolean };

export interface SubscriberRepository {
  findAll(): Promise<Subscriber[]>;
}

export interface MailSender {
  send(to: string, body: string): Promise<void>;
}

export interface Logger {
  info(msg: string): void;
}

export interface Clock {
  now(): Date;
}

export class NewsletterService {
  constructor(
    private readonly repo: SubscriberRepository,
    private readonly mailer: MailSender,
    private readonly logger: Logger,
    private readonly clock: Clock,
  ) {}

  async sendDaily(): Promise<void> {
    const subs = await this.repo.findAll();
    const active = subs.filter(s => !s.unsubscribed);

    for (const sub of active) {
      await this.mailer.send(sub.email, "Hello!");
    }

    this.logger.info(`[${this.clock.now().toISOString()}] sent ${active.length} emails`);
  }
}
