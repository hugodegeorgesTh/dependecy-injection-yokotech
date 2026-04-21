# Atelier — Dependency Injection en TypeScript

Durée : ~1h30. Fait suite au Yokoten concept.

## Setup

```bash
npm install
npm test   # tous les tests doivent être rouges au départ (c'est normal)
```

## Contexte

`src/newsletter-service.ts` gère l'envoi d'une newsletter quotidienne :
- Lit les abonnés en base
- Filtre ceux qui se sont désabonnés
- Envoie un email à chacun
- Log le résultat

Le code marche. Mais il est **intestable** et **rigide**. Votre mission : le rendre propre.

## Étape 1 — Ressentir la douleur (15min)

👉 Ouvrez `tests/newsletter-service.test.ts`.

Essayez d'écrire un test qui vérifie que `sendDaily()` :
- N'envoie rien si aucun abonné actif
- Envoie 1 mail par abonné actif
- Ignore les abonnés désabonnés

**Sans modifier le code de production.**

Questions à noter :
- Qu'est-ce qui est impossible ?
- De quoi auriez-vous besoin pour que ça devienne possible ?

## Étape 2 — Refactor avec DI (40min)

Règles :
1. Identifier les dépendances de `NewsletterService`
2. Extraire chaque dépendance derrière une **interface**
3. Les injecter **par le constructeur**
4. Écrire les tests qui étaient bloqués à l'étape 1

Contrainte : **ne pas utiliser de container** à cette étape. Wiring manuel.

Créez un fichier `src/main.ts` qui joue le rôle de "composition root" (le seul endroit où on instancie les vraies impls).

## Étape 3 — Bonus : container (20min)

Si vous avez le temps, introduisez [tsyringe](https://github.com/microsoft/tsyringe) :

```bash
npm install tsyringe reflect-metadata
```

- Décorer les classes avec `@injectable()`
- Remplacer le wiring manuel par `container.resolve(NewsletterService)`
- Garder les tests qui fonctionnent : les fakes sont injectés via `container.register(...)` ou directement au constructeur (les tests ne changent pas).

## Débrief (15min)

- Comparez le diff avant/après
- Est-ce que le code est plus long ? Plus clair ?
- Où placer la frontière entre "à injecter" et "à laisser en dur" ?

## Solution

Dans `solution/`. À ne regarder **qu'après** avoir essayé.
