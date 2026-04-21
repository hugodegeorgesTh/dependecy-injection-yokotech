// Les 4 pièges qu'on évoque sur slides — versions code

// ─────────────────────────────────────────────────────────
// PIÈGE 1 — Service Locator (faux ami de la DI)
// ─────────────────────────────────────────────────────────

class GlobalContainer {
  private static services = new Map<string, unknown>();
  static register<T>(key: string, instance: T) { this.services.set(key, instance); }
  static get<T>(key: string): T { return this.services.get(key) as T; }
}

class OrderService_BAD {
  async checkout(order: { id: string }) {
    // ❌ La classe va chercher ses dépendances au runtime
    const db = GlobalContainer.get<{ save: (o: any) => Promise<void> }>("db");
    await db.save(order);
  }
}
// Problème : la signature ne dit rien des dépendances. On retombe dans le couplage caché.

// ─────────────────────────────────────────────────────────
// PIÈGE 2 — Constructor bloating
// ─────────────────────────────────────────────────────────

class CheckoutService_BLOATED {
  constructor(
    private db: any,
    private mailer: any,
    private logger: any,
    private cache: any,
    private metrics: any,
    private auth: any,
    private flags: any,
    private analytics: any,
  ) {}
  // 8 deps = la classe orchestre trop. Découper en sous-services.
}

// ─────────────────────────────────────────────────────────
// PIÈGE 3 — God container / résolution par string
// ─────────────────────────────────────────────────────────

// Container.resolve("OrderService") — pas de typage, erreur runtime garantie un jour.
// Préférer le wiring explicite ou des tokens typés (symbols + génériques).

// ─────────────────────────────────────────────────────────
// PIÈGE 4 — Over-engineering
// ─────────────────────────────────────────────────────────

// Pas besoin de DI ici :
function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-");
}
// Fonction pure, pas d'I/O. Injecter quoi ? Rien. On garde simple.
