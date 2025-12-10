# Plan de Migration Structure Agents

## Structure Actuelle vs Proposée

### 🔄 Transformation Proposée

**Avant :**
```
.claude/agents/
├── research/
│   ├── planner.md
│   ├── corpus-searcher.md
│   └── ...
├── frontend/
│   ├── planner.md
│   └── ...
└── orchestrator.md
```

**Après :**
```
.claude/agents/
├── research/                    # 🎯 Domaine Research  
│   ├── planner/
│   │   ├── agent.md            # Définition de l'agent
│   │   ├── agent.schemas.ts    # Schémas Zod spécifiques
│   │   └── agent.resources.md  # Resources (si nécessaire)
│   ├── corpus-searcher/
│   │   ├── agent.md
│   │   └── agent.schemas.ts
│   ├── corpus-enricher/
│   ├── source-validator/
│   └── web-researcher/
├── frontend/                    # 🎯 Domaine Frontend
│   ├── planner/
│   ├── code-writer/
│   ├── quality-checker/
│   └── test-writer/
├── product/                     # 🎯 Domaine Product
│   ├── planner/
│   ├── requirements-analyzer/
│   ├── feature-specifier/
│   ├── feasibility-assessor/
│   └── acceptance-definer/
├── shared/                      # 🎯 Agents Transversaux
│   ├── orchestrator/
│   │   ├── agent.md
│   │   ├── agent.schemas.ts    # Schémas de coordination
│   │   └── schema-converter.ts # 🔥 Zod → JSON Schema utils
│   ├── agent-creator/
│   └── documentation-manager/
└── resources/                   # Resources partagées (inchangé)
    ├── research/
    ├── frontend/
    ├── product/
    └── shared/
```

## ✅ Avantages

1. **Groupes clairs** : research, frontend, product, shared
2. **Cohésion** : agent + schéma + resources dans un dossier
3. **Simplicité** : Structure plate par domaine
4. **Maintenance** : Évolution atomique de chaque agent
5. **Lisibilité** : Nom du domaine + nom de l'agent explicite

## 📋 Migration Steps

1. **Phase 1** : Test avec 1 agent (ex: `research/planner`) ✅ TERMINÉ
2. **Phase 2** : Migrer tout le domaine research ✅ TERMINÉ
3. **Phase 3** : Test en condition réelle ✅ TERMINÉ  
4. **Phase 4a** : Migrer domaine frontend ✅ TERMINÉ
5. **Phase 4b** : Migrer domaine product ✅ TERMINÉ
6. **Phase 5** : Intégration orchestrateur ✅ TERMINÉ

## 🎉 MIGRATION COMPLETE - SYSTÈME OPÉRATIONNEL !

## 🔧 Structured Outputs - Intégration Simple

- **Unique point** : `shared/orchestrator/schema-converter.ts`
- **Header requis** : `anthropic-beta: structured-outputs-2025-11-13`
- **Mode** : `output_format` avec JSON Schema convertis depuis Zod