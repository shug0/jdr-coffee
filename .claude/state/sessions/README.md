# Development Sessions State

Ce dossier contient l'état persistant des sessions de développement pour les grosses features.

## Structure

```
sessions/
├── {session-id}/
│   ├── metadata.json     # Métadonnées de session
│   ├── plan.md          # Plan structuré avec phases
│   ├── context.md       # Contexte technique accumulé
│   ├── tasks.md         # Checklist des tâches
│   └── notes.md         # Notes additionnelles
└── README.md            # Ce fichier
```

## Usage

### Créer une session
```
User: "Créé une session pour développer l'authentification OAuth"
→ session-manager crée le dossier + fichiers initiaux
```

### Mettre à jour une session
```
User: "Update session abc123 - j'ai complété les tâches de planning"
→ session-manager met à jour tasks.md et context.md
```

### Reprendre une session
```
User: "Resume session abc123"
→ session-manager charge l'état et fournit le résumé
```

## Slash Commands

- `/dev-docs` : Créé une session à partir du planning
- `/update-dev-docs` : Met à jour la session courante  
- `/resume-session {id}` : Reprend une session existante
- `/list-sessions` : Liste les sessions actives

## Intégration Orchestrateur

L'orchestrateur détecte automatiquement les grosses features et propose de créer une session:

```
User: "Je veux implémenter un système de paiement complet"
→ Orchestrateur: "Cette feature semble complexe. Voulez-vous créer une session de dev ?"
```