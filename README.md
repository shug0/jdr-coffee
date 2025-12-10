# JDR Coffee ☕🎲

Un assistant intelligent pour jeux de rôle médiévaux, combinant recherche historique et assistance de jeu. Ce projet sert également de **POC (Proof of Concept) multi-agents Claude** démontrant l'architecture distribuée d'agents spécialisés.

## 🎯 Fonctionnalités

### Assistant JDR
- Recherche d'objets médiévaux avec prix et descriptions
- Validation historique et cohérence d'époque
- Interface moderne Next.js avec shadcn/ui

### Architecture Multi-Agents Claude
- **Agents spécialisés** : recherche historique, validation de sources, enrichissement de corpus
- **Orchestration distribuée** : coordination entre agents avec contextes séparés
- **Efficacité token** : réduction de 40-60% de l'usage grâce aux sub-agents
- **Recherche contextuelle** : corpus de connaissances historiques optimisé

## 🛠️ Stack Technique

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **Agents**: Architecture Claude multi-agents avec schémas Zod
- **Base de données**: Corpus JSON optimisé pour la recherche

## 🚀 Démarrage

```bash
# Installation
pnpm install

# Développement
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## 📁 Structure Multi-Agents

```
.claude/
├── agents/           # Agents spécialisés
│   ├── research/     # Recherche historique
│   └── frontend/     # Développement frontend
├── schemas/          # Validation Zod
└── resources/        # Documentation partagée
```

### Agents Disponibles

- **corpus-searcher**: Recherche rapide dans le corpus historique
- **source-validator**: Validation croisée des sources
- **corpus-enricher**: Mise à jour du corpus avec nouveaux findings
- **research-planner**: Planification stratégique de recherche
- **web-researcher**: Recherche web académique

## 🎲 Usage JDR

L'assistant peut vous aider à :
- Trouver des objets d'époque avec prix réalistes
- Vérifier la cohérence historique de vos éléments
- Enrichir vos campagnes avec des détails authentiques

## 🔬 POC Multi-Agents

Ce projet démontre :
- Décomposition de tâches complexes entre agents spécialisés
- Coordination parent-enfant avec fusion d'outputs
- Optimisation des tokens par contextualisation séparée
- Architecture scalable pour systèmes d'IA distribués
