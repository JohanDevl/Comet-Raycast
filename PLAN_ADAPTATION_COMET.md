# Plan d'Adaptation : Extension Raycast Chrome vers Comet

## Objectif du Projet

Adapter l'extension Raycast existante pour Google Chrome afin qu'elle fonctionne avec le navigateur Comet (basé sur Chromium). L'extension doit conserver toutes les fonctionnalités existantes : recherche d'onglets, historique, signets, et gestion des fenêtres.

## 1. Exploration et Analyse Complétée ✅

### Architecture Actuelle
- **Extension Raycast** pour Google Chrome avec TypeScript/React
- **Commandes principales** : search-tab, search-history, search-bookmarks, new-tab, new-window, new-incognito-window
- **Intégration Chrome** via AppleScript et accès au système de fichiers
- **Sources de données** : SQLite (historique), JSON (signets), AppleScript (onglets actifs)

### Points d'Intégration Chrome Identifiés
- **AppleScript** : Contrôle des onglets, fenêtres, création d'incognito
- **Chemins de fichiers** : `~/Library/Application Support/Google/Chrome/`
- **Base de données** : History (SQLite), Bookmarks (JSON), Local State
- **Profils** : Support multi-profils Chrome

## 2. Plan d'Implémentation Détaillé

### Phase 1 : Préparation et Configuration
**Durée estimée : 1-2 heures**

#### 2.1 Setup du Projet
- [ ] Créer une branche `feature/comet-browser-support`
- [ ] Installer et tester le navigateur Comet 
- [ ] Identifier les chemins de fichiers spécifiques à Comet sur macOS
- [ ] Tester la compatibilité AppleScript avec Comet

#### 2.2 Analyse des Différences
- [ ] Comparer la structure des dossiers Chrome vs Comet
- [ ] Vérifier la compatibilité des formats de données (SQLite, JSON)
- [ ] Tester les commandes AppleScript sur Comet
- [ ] Documenter les différences trouvées

### Phase 2 : Adaptation des Composants de Base
**Durée estimée : 3-4 heures**

#### 2.1 Adaptation des Chemins de Fichiers (`src/util/index.ts`)
- [ ] Créer une fonction `getCometProfilePath()` similaire à Chrome
- [ ] Modifier `getLocalStatePath()` pour supporter Comet
- [ ] Adapter `getHistoryDbPath()` et `getBookmarksPath()`
- [ ] Ajouter une détection automatique Chrome/Comet

#### 2.2 Modification des Actions AppleScript (`src/actions/index.tsx`)
- [ ] Remplacer `"Google Chrome"` par `"Comet"` dans les scripts
- [ ] Tester et adapter les commandes de gestion d'onglets
- [ ] Adapter les commandes de création de fenêtres
- [ ] Modifier la détection d'installation du navigateur
- [ ] Gérer le cas où AppleScript n'est pas supporté par Comet

#### 2.3 Mise à Jour des Interfaces (`src/interfaces/index.ts`)
- [ ] Étendre les interfaces pour supporter les deux navigateurs
- [ ] Ajouter des types pour la configuration Comet
- [ ] Maintenir la compatibilité avec les données existantes

### Phase 3 : Adaptation des Commandes
**Durée estimée : 2-3 heures**

#### 3.1 Commandes de Recherche
- [ ] Adapter `search-tab.tsx` pour Comet
- [ ] Adapter `search-history.tsx` pour Comet
- [ ] Adapter `search-bookmarks.tsx` pour Comet
- [ ] Tester `search-all.tsx` et `new-tab.tsx`

#### 3.2 Commandes de Création
- [ ] Adapter `new-window.tsx` pour Comet
- [ ] Adapter `new-incognito-window.tsx` pour Comet
- [ ] Vérifier le support des fenêtres incognito dans Comet

### Phase 4 : Configuration et Préférences
**Durée estimée : 1-2 heures**

#### 4.1 Système de Configuration
- [ ] Ajouter une préférence pour choisir le navigateur (Chrome/Comet)
- [ ] Adapter le système de profils pour Comet
- [ ] Maintenir la compatibilité avec les configurations Chrome existantes

#### 4.2 Gestion des Erreurs
- [ ] Adapter les messages d'erreur pour Comet
- [ ] Ajouter une détection si Comet n'est pas installé
- [ ] Gérer les cas où les deux navigateurs sont installés

### Phase 5 : Tests et Validation
**Durée estimée : 2-3 heures**

#### 5.1 Tests de Fonctionnalité
- [ ] Tester toutes les commandes avec Comet installé
- [ ] Vérifier la compatibilité des données (historique, signets)
- [ ] Tester les opérations sur les onglets (ouvrir, fermer, activer)
- [ ] Valider la création de fenêtres normales et incognito

#### 5.2 Tests d'Intégration
- [ ] Tester avec différents profils Comet
- [ ] Vérifier la performance avec de gros volumes de données
- [ ] Tester les cas d'erreur (navigateur fermé, base corrompue)

#### 5.3 Tests de Régression
- [ ] Vérifier que Chrome fonctionne toujours
- [ ] Tester le basculement entre Chrome et Comet
- [ ] Valider tous les hooks et utilitaires existants

## 3. Défis Techniques Identifiés

### 3.1 AppleScript et Comet
**Défi** : Incertitude sur le support AppleScript de Comet
**Solutions alternatives** :
- Utiliser l'API d'automatisation IA native de Comet
- Implémenter une approche hybride (AppleScript + API Comet)
- Fallback vers des commandes shell si nécessaire

### 3.2 Chemins de Profils
**Défi** : Structure de dossiers potentiellement différente
**Solution** : Créer une couche d'abstraction pour la découverte des profils

### 3.3 Compatibilité des Données
**Défi** : Format des données possiblement différent
**Solution** : Validation et adaptation des parsers de données

## 4. Structure de Code Proposée

### 4.1 Nouveaux Fichiers
```
src/
├── browsers/
│   ├── chrome.ts          # Logique spécifique Chrome
│   ├── comet.ts           # Logique spécifique Comet
│   └── index.ts           # Factory et interface commune
├── config/
│   └── browser-config.ts  # Configuration navigateur
```

### 4.2 Modifications de Fichiers Existants
- `src/actions/index.tsx` : Abstraction navigateur
- `src/util/index.ts` : Support multi-navigateur
- `src/hooks/` : Adaptation pour Comet
- `package.json` : Mise à jour métadonnées

## 5. Plan de Tests

### 5.1 Tests Automatisés
- [ ] Tests unitaires pour les utilitaires de chemins
- [ ] Tests d'intégration pour les parsers de données
- [ ] Tests de mocking pour AppleScript

### 5.2 Tests Manuels
- [ ] Validation UI de toutes les commandes
- [ ] Tests de performance avec gros volumes
- [ ] Tests de compatibilité Chrome/Comet

## 6. Documentation et Livraison

### 6.1 Documentation
- [ ] Mise à jour du README avec support Comet
- [ ] Documentation des nouvelles préférences
- [ ] Guide de migration pour les utilisateurs

### 6.2 Métadonnées
- [ ] Mise à jour `package.json` avec support Comet
- [ ] Modification des descriptions de commandes
- [ ] Update du CLAUDE.md avec les nouvelles informations

## 7. Chronologie Estimée

**Total : 9-14 heures de développement**

1. **Jour 1** : Phases 1-2 (Setup + Adaptation base)
2. **Jour 2** : Phase 3 (Adaptation commandes)  
3. **Jour 3** : Phases 4-5 (Config + Tests)
4. **Jour 4** : Phase 6 (Documentation + Livraison)

## 8. Critères de Succès

- ✅ Toutes les commandes fonctionnent avec Comet
- ✅ Compatibilité maintenue avec Chrome
- ✅ Performance équivalente à la version Chrome
- ✅ Gestion d'erreurs robuste
- ✅ Configuration utilisateur simple
- ✅ Tests passent à 100%

## 9. Risques et Mitigation

### Risque 1 : AppleScript non supporté par Comet
**Mitigation** : Développer une API alternative ou utiliser l'automatisation IA native

### Risque 2 : Format de données incompatible
**Mitigation** : Créer des adaptateurs de données spécifiques

### Risque 3 : Performance dégradée
**Mitigation** : Optimiser les opérations I/O et mise en cache intelligente

---

*Ce plan sera mis à jour au fur et à mesure de l'avancement du projet et des découvertes techniques.*