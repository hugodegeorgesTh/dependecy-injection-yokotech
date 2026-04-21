import * as fs from "fs";
import {
  NewsletterService,
  type SubscriberRepository,
  type MailSender,
  type Logger,
  type Clock,
  type Subscriber,
} from "./newsletter-service";

class JsonFileSubscriberRepository implements SubscriberRepository {
  constructor(private readonly path: string) {}
  async findAll(): Promise<Subscriber[]> {
    return JSON.parse(fs.readFileSync(this.path, "utf-8"));
  }
}

class HttpMailSender implements MailSender {
  async send(to: string, body: string): Promise<void> {
    await fetch("https://mail.example.com/send", {
      method: "POST",
      body: JSON.stringify({ to, body }),
    });
  }
}

const consoleLogger: Logger = { info: (msg) => console.log(msg) };
const systemClock: Clock = { now: () => new Date() };

async function main() {
  const service = new NewsletterService(
    new JsonFileSubscriberRepository("./subscribers.json"),
    new HttpMailSender(),
    consoleLogger,
    systemClock,
  );
  await service.sendDaily();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
