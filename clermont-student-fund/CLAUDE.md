# Clermont Student Fund — Instructions pour Claude

## Contexte
Site Next.js 14 (App Router) — tableau de bord d'un fonds d'investissement étudiant fictif.
Données 100 % JSON locaux, pas de base de données. Yahoo Finance fournit les prix en temps réel.

---

## Ajouter une nouvelle position (ACHAT)

Quand l'utilisateur dit « nouvelle position » ou « nouvel achat », poser ces questions **une par une** dans cet ordre :

1. **Ticker Yahoo Finance** (ex : `AAPL`, `MC.PA`, `SIE.DE`) — vérifier que le format est correct pour la bourse
2. **Nom complet** de la société / l'actif
3. **Type** : `action` / `etf` / `or` / `crypto`
4. **Secteur** (ex : Technologie, Santé, Matériaux, Énergie, Finance…)
5. **Bucket** : `socle` (long terme, défensif) / `conviction` (fort potentiel 12-24 mois) / `opportunite` (tactique court terme)
6. **Enveloppe investie en USD** (montant total)
7. **Prix d'achat unitaire** (dans la devise de l'actif)
8. **Devise** : `USD` ou `EUR`
9. **Date d'achat** (format YYYY-MM-DD)
10. **Thèse d'investissement** (2-4 phrases en français)
11. **Ville/bourse** où le titre est coté (pour la carte) — ex : Paris, New York, Francfort, Tokyo…
12. **Zone géographique** : `europe` / `americas` / `asia` / `global`

Calculer automatiquement :
- `quantity = enveloppe / prix_unitaire` (arrondir à l'entier ou 4 décimales pour crypto/or)
- `avgBuyPrice = prix_unitaire`
- `totalEUR ≈ enveloppe` (peut différer légèrement selon le taux de change EUR/USD du jour)
- `id` = dernier id dans movements.json + 1

---

### Fichiers à mettre à jour — ACHAT NOUVELLE LIGNE

#### 1. `data/portfolio.json` ✅ OBLIGATOIRE
Ajouter dans le tableau `positions` :
```json
{
  "id": "<prochain id libre>",
  "name": "<nom>",
  "ticker": "<TICKER>",
  "type": "action|etf|or|crypto",
  "sector": "<secteur>",
  "category": "socle|conviction|opportunite",
  "quantity": <quantité>,
  "avgBuyPrice": <prix>,
  "currency": "USD|EUR",
  "buyDate": "YYYY-MM-DD"
}
```
Mettre à jour `cashUSD` : soustraire l'enveloppe investie (convertie en USD si EUR).

#### 2. `data/movements.json` ✅ OBLIGATOIRE
Ajouter dans le tableau `movements` :
```json
{
  "id": "<prochain id libre>",
  "date": "YYYY-MM-DD",
  "type": "BUY",
  "ticker": "<TICKER>",
  "name": "<nom>",
  "quantity": <quantité>,
  "price": <prix_unitaire>,
  "currency": "USD|EUR",
  "totalEUR": <montant_total>,
  "justification": "<thèse en français>"
}
```

#### 3. `components/positions/BucketSection.tsx` ✅ OBLIGATOIRE
Ajouter le ticker dans `BUCKET_TARGETS` sous le bon bucket (lignes 21-38) :
```typescript
{ ticker: '<TICKER>', name: '<nom>' },
```
Mettre à jour `targetCount` dans `app/positions/page.tsx` si le compte change.

#### 4. `components/GeoSection.tsx` ✅ OBLIGATOIRE
Ajouter dans `TICKER_ZONE` (lignes 34-39) :
```typescript
'<TICKER>': 'europe|americas|asia|global',
```

#### 5. `components/MapChart.tsx` ✅ OBLIGATOIRE
- Si la **ville est déjà dans CITY_MARKERS** : ajouter le ticker dans son tableau `tickers`
- Si la **ville est nouvelle** : ajouter une nouvelle entrée dans `CITY_MARKERS` :
```typescript
{ name:'<Ville>', emoji:'🇫🇷', coords:[lon, lat], zone:'europe|americas|asia|global', exchange:'<Bourse>', tickers:['<TICKER>'] },
```

---

### Fichiers à mettre à jour — RENFORCEMENT (achat supplémentaire sur ligne existante)

#### 1. `data/portfolio.json` ✅ OBLIGATOIRE
Sur la position existante :
- Mettre à jour `quantity` : ancienne_qty + nouvelle_qty
- Recalculer `avgBuyPrice` : (ancienne_qty × ancien_prix + nouvelle_qty × nouveau_prix) / nouvelle_qty_totale
- Mettre à jour `lastBuyDate` avec la date du renforcement
- Mettre à jour `cashUSD` : soustraire l'enveloppe

#### 2. `data/movements.json` ✅ OBLIGATOIRE
Ajouter un nouvel enregistrement BUY (même format, justification centrée sur le renforcement).

> Les fichiers GeoSection, MapChart et BucketSection ne changent pas pour un renforcement.

---

## Clôturer une position (VENTE)

Poser ces questions :
1. **Ticker** à vendre
2. **Quantité** vendue (totale ou partielle)
3. **Prix de vente unitaire**
4. **Date de vente**
5. **Thèse de sortie** (pourquoi on vend — prise de bénéfices, invalidation de thèse…)

### Fichiers à mettre à jour — VENTE TOTALE

#### 1. `data/portfolio.json` ✅ OBLIGATOIRE
Supprimer entièrement l'entrée de la position.
Mettre à jour `cashUSD` : ajouter le produit de la vente (converti en USD si EUR).

#### 2. `data/movements.json` ✅ OBLIGATOIRE
Ajouter :
```json
{
  "id": "<prochain id libre>",
  "date": "YYYY-MM-DD",
  "type": "SELL",
  "ticker": "<TICKER>",
  "name": "<nom>",
  "quantity": <quantité_totale>,
  "price": <prix_de_vente>,
  "currency": "USD|EUR",
  "totalEUR": <produit_de_vente>,
  "justification": "<raison de la sortie>"
}
```

#### 3. `components/positions/BucketSection.tsx` ✅ OBLIGATOIRE
Supprimer le ticker de `BUCKET_TARGETS` (il apparaîtra alors comme slot « À ouvrir »).
Décrémenter `targetCount` dans `app/positions/page.tsx` si souhaité.

> GeoSection.tsx et MapChart.tsx se mettent à jour automatiquement (ils lisent portfolio.json via getPortfolioMetrics).

### Fichiers à mettre à jour — VENTE PARTIELLE

Même chose, mais dans `portfolio.json` :
- `quantity` = ancienne_qty - qty_vendue (ne pas supprimer la ligne)
- `avgBuyPrice` reste inchangé
- Ne pas modifier `BucketSection.tsx`

---

## Ajouter un rapport (PDF)

1. Déposer le PDF dans `public/rapports/`
2. Ajouter dans `data/rapports.json` :
```json
{
  "id": "<prochain id>",
  "title": "<titre>",
  "date": "YYYY-MM-DD",
  "type": "Compte de résultats|Bilan|Rapport annuel|Note de marché",
  "period": "<ex : T1 2026>",
  "filename": "<nom_du_fichier.pdf>"
}
```

---

## Après chaque modification

Toujours dans cet ordre :
1. `npm run build` — vérifier qu'il n'y a pas d'erreur de compilation
2. `git add <fichiers modifiés>` — ne jamais faire `git add .` (risque d'inclure des fichiers Windows)
3. `git commit -m "feat/fix: ..."`
4. `git push origin main` — Vercel redéploie automatiquement

---

## Architecture des données

| Fichier | Rôle | Lecture par |
|---------|------|-------------|
| `data/portfolio.json` | Positions ouvertes + cash | `lib/getPortfolioMetrics.ts`, `app/api/portfolio/route.ts` |
| `data/movements.json` | Historique complet achats/ventes | `app/mouvements/page.tsx` |
| `data/rapports.json` | Liste des PDF publiés | `app/rapports/page.tsx` |

## Références hardcodées dans les composants

| Composant | Constante | Rôle |
|-----------|-----------|------|
| `components/positions/BucketSection.tsx:21` | `BUCKET_TARGETS` | Cibles par bucket, affiche « À ouvrir » |
| `components/GeoSection.tsx:34` | `TICKER_ZONE` | Zone géo par ticker pour le camembert |
| `components/MapChart.tsx:120` | `CITY_MARKERS` | Points de la carte avec tickers par ville |
| `app/positions/page.tsx:11` | `BUCKETS` | Config couleur + targetCount par bucket |

## URL de production

https://clermont-student-fund.vercel.app
