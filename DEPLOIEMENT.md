# Déploiement (guide mobile / vanilla)

## 1. La structure des dossiers (volontairement réduite à 6)
- `app/` → pages + `app/api/[...path]/route.ts` (toute l'API en un seul dossier)
- `components/fandom/` → l'interface
- `db/` → base de données + seed
- `lib/` → types + parser wikitext
- `public/` → images, manifest, service worker (tout à plat)
- racine → les fichiers de config
Ne déplace rien : Next.js se sert de ces dossiers comme d'un plan de montage.

## 2. Récupérer le projet en UN fichier
Ouvre sur ton téléphone : `https://TON-APERCU/wiki-source.zip` → tout le projet arrive
avec ses dossiers déjà organisés.

## 3. Importer le zip sans ordinateur
- Va sur **codesandbox.io** (ou replit.com) dans ton navigateur.
- « Import » / « Create » → téléverse le zip → les dossiers se recréent tout seuls.
- Dans l'éditeur en ligne : « Export / Push to GitHub » → ton dépôt GitHub est créé
  avec la bonne arborescence, sans aucun copier-coller.

## 4. Base de données gratuite (une seule variable à coller)
- **Neon** (neon.tech) ou **Supabase** (supabase.com) : connexion avec ton compte Google,
  « New project », puis copie la *connection string* qui ressemble à
  `postgresql://user:mdp@serveur/neondb`
- C'est juste un Postgres hébergé gratuitement dans le cloud — rien à installer.

## 5. Vercel
- vercel.com → « Add New Project » → importe ton dépôt GitHub.
- Next.js est détecté automatiquement.
- Settings → Environment Variables → ajoute `DATABASE_URL` = la string copiée.
- « Deploy ». Le site sort en HTTPS.

## 6. PWA
Une fois le site ouvert en HTTPS sur ton téléphone : menu du navigateur →
« Ajouter à l'écran d'accueil » / « Installer l'application ».
Après une 1ʳ visite, la lecture des articles fonctionne hors-ligne (service worker).
L'écriture, elle, nécessite le réseau → pense à « Fichiers & sauvegarde » → Export .zip.
