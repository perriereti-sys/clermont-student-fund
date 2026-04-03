# Clermont Student Fund — Site Portefeuille

Site web pour visualiser les performances du portefeuille fictif de l'association.

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure des données à modifier

### `data/portfolio.json` — Positions actuelles

Ajouter une nouvelle position dans le tableau `positions` :

```json
{
  "id": "6",
  "name": "Nom de l'actif",
  "ticker": "TICKER_YAHOO",
  "type": "action",       // action | etf | or | crypto
  "sector": "Technologie",
  "quantity": 10,
  "avgBuyPrice": 150.00,
  "currency": "USD",       // USD | EUR
  "buyDate": "2026-04-01"
}
```

Mettre à jour `cashEUR` après chaque achat/vente.

### `data/movements.json` — Historique des opérations

Ajouter chaque achat/vente avec sa justification.

### `data/history.json` — Valorisation hebdomadaire

Ajouter un point chaque semaine avec la valeur totale du portefeuille.
Calculer : Σ(quantité × prix actuel × taux de change) + cash.

## Déploiement sur Vercel

1. Pousser le code sur GitHub
2. Connecter le repo sur [vercel.com](https://vercel.com)
3. Déploiement automatique à chaque `git push`

## Tickers Yahoo Finance

| Type   | Exemple    | Format       |
|--------|-----------|--------------|
| Action | Apple      | `AAPL`       |
| Action | LVMH       | `MC.PA`      |
| ETF    | MSCI World | `IWDA.AS`    |
| Or     | Gold       | `GC=F`       |
| Crypto | Bitcoin    | `BTC-USD`    |
