// Tests — triviaux grâce à la DI

import { OrderService, type Db, type Mailer, type Logger, type Order } from "./2-after";

describe("OrderService.checkout", () => {
  const order: Order = { id: "o-1", email: "a@b.com", total: 42 };

  it("sauvegarde la commande, envoie le mail, log", async () => {
    const db: Db = { save: jest.fn().mockResolvedValue(undefined) };
    const mailer: Mailer = { send: jest.fn().mockResolvedValue(undefined) };
    const logger: Logger = { info: jest.fn() };

    const service = new OrderService(db, mailer, logger);
    await service.checkout(order);

    expect(db.save).toHaveBeenCalledWith(order);
    expect(mailer.send).toHaveBeenCalledWith("a@b.com", expect.stringContaining("o-1"));
    expect(logger.info).toHaveBeenCalledWith("order o-1 placed");
  });

  it("propage l'erreur si la DB échoue — et n'envoie pas le mail", async () => {
    const db: Db = { save: jest.fn().mockRejectedValue(new Error("boom")) };
    const mailer: Mailer = { send: jest.fn() };
    const logger: Logger = { info: jest.fn() };

    const service = new OrderService(db, mailer, logger);

    await expect(service.checkout(order)).rejects.toThrow("boom");
    expect(mailer.send).not.toHaveBeenCalled();
  });
});

// Aucune DB réelle, aucun Sendgrid, aucun Datadog.
// Les tests s'exécutent en millisecondes, en parallèle, sans flakiness.
