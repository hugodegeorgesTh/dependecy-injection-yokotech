import {
  NewsletterService,
  type SubscriberRepository,
  type MailSender,
  type Logger,
  type Clock,
  type Subscriber,
} from "./newsletter-service";

const fixedDate = new Date("2026-04-20T08:00:00Z");

function build(subs: Subscriber[]) {
  const repo: SubscriberRepository = { findAll: jest.fn().mockResolvedValue(subs) };
  const mailer: MailSender = { send: jest.fn().mockResolvedValue(undefined) };
  const logger: Logger = { info: jest.fn() };
  const clock: Clock = { now: () => fixedDate };
  const service = new NewsletterService(repo, mailer, logger, clock);
  return { service, repo, mailer, logger, clock };
}

describe("NewsletterService.sendDaily", () => {
  it("n'envoie rien si aucun abonné actif", async () => {
    const { service, mailer } = build([{ email: "a@b.com", unsubscribed: true }]);
    await service.sendDaily();
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it("envoie un mail à chaque abonné actif", async () => {
    const { service, mailer } = build([
      { email: "a@b.com", unsubscribed: false },
      { email: "c@d.com", unsubscribed: false },
    ]);
    await service.sendDaily();
    expect(mailer.send).toHaveBeenCalledTimes(2);
    expect(mailer.send).toHaveBeenCalledWith("a@b.com", "Hello!");
    expect(mailer.send).toHaveBeenCalledWith("c@d.com", "Hello!");
  });

  it("ignore les abonnés désabonnés", async () => {
    const { service, mailer } = build([
      { email: "a@b.com", unsubscribed: false },
      { email: "x@y.com", unsubscribed: true },
    ]);
    await service.sendDaily();
    expect(mailer.send).toHaveBeenCalledTimes(1);
    expect(mailer.send).toHaveBeenCalledWith("a@b.com", "Hello!");
  });

  it("log le nombre de mails envoyés avec timestamp", async () => {
    const { service, logger } = build([
      { email: "a@b.com", unsubscribed: false },
    ]);
    await service.sendDaily();
    expect(logger.info).toHaveBeenCalledWith(
      "[2026-04-20T08:00:00.000Z] sent 1 emails",
    );
  });
});
