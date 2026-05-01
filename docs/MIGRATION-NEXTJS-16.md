# Migration Next.js 15 → 16

**Statut au 2026-05-01** : on reste sur **Next.js 15.5.15 (LTS, supporté jusqu'au 21 oct 2026)**.

Migration planifiée **post-livraison client**, idéalement été 2026 sur une branche dédiée.

## Pourquoi pas tout de suite

1. **Next 15 est LTS** — patches de sécurité officiels jusqu'à oct 2026
2. **Risque pré-livraison** : Next 16 introduit Turbopack stable + React Compiler 1.0 + nouveau routing system — pas le moment de tout casser à 1 semaine du go-live client
3. **Audit npm** : pas de CVE bloquante exploitable en prod sur la stack actuelle
4. **Couverture tests** : seulement 27 unit + 2 E2E — sécurité de migration limitée

## Plan de migration (à suivre quand on lance)

### Pré-requis
- [ ] Branche dédiée `chore/nextjs-16`
- [ ] Tests verts sur main (`npm run test && npm run e2e`)
- [ ] CI verte sur main
- [ ] Snapshot DB Supabase + backup `redirects.csv`

### Étapes

1. **Codemods automatiques** (interactif — sélectionne les 3 proposés) :
   ```bash
   npx @next/codemod@latest upgrade latest
   ```
   Codemods attendus :
   - `remove-experimental-ppr` — N/A (on n'utilise pas PPR)
   - `remove-unstable-prefix` — vérifier que `unstable_ViewTransition` est devenu stable
   - `middleware-to-proxy` — **lire le diff attentivement** : Next 16 renomme `middleware.ts` → `proxy.ts` avec quelques sémantiques différentes. Notre middleware fait des 301/302 depuis la table `redirects` — vérifier que ça reste compatible.

2. **Bump packages associés** :
   ```bash
   npm install next@latest react@latest react-dom@latest eslint-config-next@latest
   ```

3. **Vérif `next.config.ts`** — l'API `withSentryConfig` et `experimental.optimizePackageImports` peuvent avoir bougé. Référence : [next-16.2 release notes](https://nextjs.org/blog/next-16-2).

4. **Turbopack en prod** ?
   - Next 16 permet Turbopack pour `npm run build` (pas seulement dev). Tester sur preview Vercel avant prod.
   - Si OK → ajouter `--turbopack` à `next build` dans package.json scripts.

5. **React Compiler 1.0**
   - Optionnel, peut booster perf significativement (memo auto). Activer via `experimental.reactCompiler: true`.
   - Lancer build complet + Lighthouse avant/après.

6. **Tests** :
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run test
   npm run e2e
   npm run build
   ```

7. **Smoke test prod** : déploie sur preview Vercel. Test manuel des flows :
   - Devis multi-step
   - Admin login
   - Cover image upload
   - Hero video autoplay
   - Middleware redirect (test une URL en table `redirects`)

8. **Rollback plan** : si bug en prod, `git revert` du merge commit + redeploy main → retour à Next 15.

## Bénéfices attendus

- **Build prod 2-5× plus rapide** (Turbopack stable)
- **Fast Refresh 5-10× plus rapide** en dev
- **React Compiler** : ~10-30% perf runtime sur composants memo-friendly
- **Adapter API** : déploiement multi-providers natif si on quitte Vercel un jour

## Ressources

- [Next.js 16 release notes](https://nextjs.org/blog/next-16)
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js EOL calendar](https://endoflife.date/nextjs)
