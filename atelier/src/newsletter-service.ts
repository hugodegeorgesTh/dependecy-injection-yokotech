// Code de départ — volontairement mal écrit.
// Objectif de l'atelier : le rendre testable sans en changer le comportement.

import * as fs from "fs";

type Subscriber = { email: string; unsubscribed: boolean };

export class NewsletterService {
  async sendDaily(): Promise<void> {
    // 1. Chargement depuis un fichier JSON (simule une DB)
    const raw = fs.readFileSync("./subscribers.json", "utf-8");
    const subs: Subscriber[] = JSON.parse(raw);

    // 2. Filtrage
    const active = subs.filter(s => !s.unsubscribed);

    // 3. Envoi (ici : HTTP en dur vers une API mail imaginaire)
    for (const sub of active) {
      await fetch("https://mail.example.com/send", {
        method: "POST",
        body: JSON.stringify({ to: sub.email, body: "Hello!" }),
      });
    }

    // 4. Log
    console.log(`[${new Date().toISOString()}] sent ${active.length} emails`);
  }
}
