# Tableau de bord des commandes

## Description
Cette application web est un tableau de bord interactif permettant de suivre et d'analyser les commandes clients. Elle charge de manière asynchrone trois fichiers JSON distincts (`customers.json`, `products.json` et `orders.json`) et relie leurs données dynamiquement grâce aux identifiants (`customerId` et `productId`) afin de calculer les montants et d'afficher les informations complètes sans duplication de données.

## Structure du projet
```text
tp4/
├── index.html             # Structure principale de la page avec Bootstrap 5 (cartes, filtres, tableau et modale)
├── css/
│   └── style.css          # Styles personnalisés (cartes statistiques, espacement du tableau et badges de statut)
├── data/
│   ├── customers.json     # Liste des clients (id, nom, ville, statut actif)
│   ├── products.json      # Catalogue des produits (id, nom, catégorie, prix, stock)
│   └── orders.json        # Liste des commandes (id, customerId, date, statut, paiement, articles)
└── js/
    ├── state.js           # Centralise l'état de l'application (tableaux de données et valeurs des filtres actifs)
    ├── dataService.js     # Gère le chargement asynchrone des fichiers JSON via fetch et vérifie response.ok
    ├── selectors.js       # Contient les fonctions pures de relation (find), calcul des totaux (map/forEach) et filtrage
    ├── view.js            # Gère uniquement la manipulation du DOM (indicateurs, tableau, listes déroulantes, modale et alertes)
    └── app.js             # Point d'entrée qui initialise l'application, orchestre le cycle de rendu et écoute les événements
```

## Fonctionnalités
- **Indicateurs clés :** Affichage des 4 compteurs globaux (nombre de clients, nombre de produits, nombre de commandes et montant cumulé, en excluant les commandes annulées).
- **Recherche par nom de client :** Filtrage instantané des commandes en saisissant le nom d'un client (insensible à la casse).
- **Filtres combinés (Statut et Catégorie) :** Sélection simultanée par statut de commande (*Livrée*, *En attente*, *Annulée*) et par catégorie de produit générée dynamiquement depuis `products.json`.
- **Compteur de résultats :** Affichage dynamique du nombre de commandes correspondant aux filtres actifs.
- **Modale de détail d'une commande :** Ouverture d'une fenêtre modale Bootstrap au clic sur le bouton « Détail » affichant le client, sa ville, les lignes de produits commandés (nom, prix, quantité, sous-total) et le montant total.
- **Gestion des erreurs :** Affichage d'une alerte rouge explicite sur la page si l'un des fichiers JSON ne parvient pas à être chargé.

## Lancer le projet
1. Cloner le dépôt sur votre machine :
   ```bash
   git clone git remote get-url origin
   ```
2. Ouvrir le dossier du projet dans **Visual Studio Code**.
3. Faire un clic droit sur `index.html` et sélectionner **Open with Live Server**.

Les modules JavaScript ES6 (`type="module"`) et les requêtes `fetch` ne fonctionnent pas si l'on ouvre directement le fichier par double-clic (`file://`) en raison des restrictions de sécurité des navigateurs (CORS).