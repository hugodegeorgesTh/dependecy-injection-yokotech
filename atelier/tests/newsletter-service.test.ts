import { NewsletterService } from "../src/newsletter-service";

// Étape 1 : ces tests sont volontairement difficiles/impossibles à écrire
// avec le code actuel. Notez ce qui vous bloque.

describe("NewsletterService.sendDaily", () => {
  it.todo("n'envoie rien si aucun abonné actif");
  it.todo("envoie un mail à chaque abonné actif");
  it.todo("ignore les abonnés désabonnés");
  it.todo("log le nombre de mails envoyés");

  // À débloquer après refactor (étape 2)
});
