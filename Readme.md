# TaskBoard

Un tableau kanban léger — déplace tes tâches par glisser-déposer entre **To Do / Doing / Done**, tague-les, cherche parmi elles, et bascule entre thème clair et sombre. Pas de framework, pas d'étape de build : le frontend est composé de simples [Web Components](https://developer.mozilla.org/fr/docs/Web/API/Web_components) et le backend est du PHP + SQLite classique.

## Fonctionnalités

- Glisser-déposer des cartes entre les colonnes
- Créer, renommer, taguer et supprimer une tâche directement en ligne
- Tags : `none`, `urgent`, `bug`, `feature`, `perso` — chacun avec sa propre couleur
- Recherche en direct sur le titre et le tag des tâches
- Bascule thème clair / sombre (persistée via `data-theme` sur `<html>`)
- Aucun outil de build — le navigateur exécute directement les fichiers JS via `<script type="module">`

## Stack technique

| Couche      | Technologie                                  |
|-------------|-----------------------------------------------|
| Frontend    | Web Components en JS natif, variables CSS     |
| Backend     | PHP (PDO)                                     |
| Base de données | SQLite                                    |

## Structure du projet

```
.
├── public/                    # racine du serveur — c'est ce dossier qu'il faut exposer
│   ├── index.php              # squelette de la page, variables de thème, toolbar
│   ├── router.php             # route les requêtes /api/* vers le dossier api/
│   └── web-components/
│       ├── kanban-board.js    # le tableau : colonnes, cartes, drag & drop
│       ├── task-form.js       # champ "nouvelle tâche" + choix du tag + bouton
│       ├── task-search.js     # champ de recherche, filtre le tableau en direct
│       ├── task-list.js       # vue liste alternative (non branchée dans index.php)
│       └── theme-toggle.js    # bouton clair/sombre
│
├── api/                       # endpoints JSON, un fichier par action
│   ├── tasks.php              # GET (liste toutes les tâches) / POST (créer)
│   ├── update_status.php      # POST — déplacer une tâche entre les colonnes
│   ├── update_tag.php         # POST — changer le tag d'une tâche
│   ├── update_title.php       # POST — renommer une tâche
│   └── delete_task.php        # POST — supprimer une tâche
│
├── src/
│   └── TaskRepository.php     # tout le SQL est ici
│
├── db/
│   └── tasks.sqlite           # fichier de base de données SQLite
│
└── migration.sql              # à exécuter une fois pour créer la table tasks
```

> `router.php` résout `/api/tasks` en `__DIR__ . '/../api/tasks.php'` : le dossier `api/` doit donc être **au même niveau que `public/`**, pas à l'intérieur.

## Installation

1. **Créer la base de données** (à sauter si `db/tasks.sqlite` existe déjà) :

   ```bash
   mkdir -p db
   sqlite3 db/tasks.sqlite < migration.sql
   ```

2. **Lancer l'application** avec le serveur intégré de PHP, en pointant vers `router.php` pour que les requêtes `/api/*` soient bien routées :

   ```bash
   cd public
   php -S localhost:8000 router.php
   ```

3. Ouvrir **http://localhost:8000**.

   > Si tu déploies derrière Apache/Nginx à la place, il faut réécrire toi-même chaque requête `/api/...` vers `api/....php` (l'équivalent de ce que fait `router.php`), car ces serveurs n'utilisent pas `router.php` comme point d'entrée.

## API

Tous les endpoints se trouvent sous `/api/` et échangent du JSON.

| Méthode | Endpoint              | Corps de la requête          | Description                        |
|---------|------------------------|--------------------------------|--------------------------------------|
| GET     | `/api/tasks`           | —                               | Liste toutes les tâches              |
| POST    | `/api/tasks`           | `{ title, tag }`                 | Crée une tâche (statut par défaut : `"todo"`) |
| POST    | `/api/update_status`   | `{ id, status }`                 | Déplace une tâche vers une autre colonne |
| POST    | `/api/update_tag`      | `{ id, tag }`                     | Change le tag d'une tâche            |
| POST    | `/api/update_title`    | `{ id, title }`                   | Renomme une tâche                    |
| POST    | `/api/delete_task`     | `{ id }`                          | Supprime une tâche                   |

`status` vaut `todo`, `doing` ou `done`. `tag` vaut `none`, `urgent`, `bug`, `feature` ou `perso`.

## Remarques et limites

- Pas d'authentification — toute personne pouvant accéder à l'app peut lire et modifier toutes les tâches.
- Pas de validation côté serveur au-delà de la vérification de la présence des champs requis.
- Un seul tableau partagé ; pas de notion d'utilisateurs ou de projets séparés.
