# 🚗 Projet Full Stack — Magasin de Voitures avec IA

**Étudiant :** Master MIOLA — ENSIAS  
**Encadrant :** Pr. Khalid Nafil  
**Technologies :** Spring Boot 4.0.6 · PostgreSQL · React 18 · Docker · Ollama (LLaMA3)

---

## 📁 Structure du projet

```
projet-fullstack/
├── backend/                    # API Spring Boot
│   ├── src/main/java/org/cours/
│   │   ├── modele/             # Entités JPA (Voiture, Proprietaire)
│   │   ├── web/                # Contrôleurs REST (+ VoitureAIController)
│   │   └── service/            # VoitureAIService — logique IA métier
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # Application React (Vite)
│   ├── src/
│   │   ├── Components/
│   │   │   ├── NavigationBar.jsx
│   │   │   ├── Bienvenue.jsx
│   │   │   ├── Voiture.jsx     # Formulaire ajout/édition
│   │   │   ├── VoitureListe.jsx # Liste + bouton fiche IA
│   │   │   ├── AIConseiller.jsx # Page dédiée IA métier
│   │   │   ├── Footer.jsx
│   │   │   └── MyToast.jsx
│   │   └── App.jsx
│   └── package.json
├── docker-compose.yml          # Orchestration complète
└── README.md
```

---

## 🚀 Méthode 1 — Lancement avec Docker Compose (recommandé)

### Prérequis
- Docker Desktop installé et démarré
- Ollama installé sur la machine hôte

### Étapes

```bash
# 1. Installer et démarrer Ollama (une seule fois)
# Télécharger depuis https://ollama.com
ollama pull llama3
ollama serve
# Ollama tourne sur http://localhost:11434

# 2. Compiler le backend Spring Boot
cd backend
./mvnw clean package -DskipTests
cd ..

# 3. Lancer tous les services (PostgreSQL + Spring Boot)
docker-compose up -d --build

# 4. Vérifier que tout est démarré
docker-compose ps
docker-compose logs -f springboot-app

# 5. Lancer le frontend React
cd frontend
npm install
npm run dev
```

### URLs d'accès

| Service | URL |
|---|---|
| Frontend React | http://localhost:5173 |
| API Spring Boot | http://localhost:9090 |
| Spring Data REST (HAL) | http://localhost:9090/api |
| Swagger UI | http://localhost:9090/swagger-ui/index.html |
| OpenAPI JSON | http://localhost:9090/v3/api-docs |

---

## 🖥 Méthode 2 — Lancement en local (sans Docker)

### Prérequis
- Java 21, Maven
- PostgreSQL installé et démarré
- Node.js 18+, npm
- Ollama

```bash
# 1. Créer la base PostgreSQL
psql -U postgres -c "CREATE DATABASE springboot;"

# 2. Démarrer Ollama
ollama pull llama3
ollama serve

# 3. Lancer le backend
cd backend
./mvnw spring-boot:run

# 4. Lancer le frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

---

## 🤖 Intégration IA Métier (Ollama + LLaMA3)

### Architecture

L'IA est intégrée au **niveau métier**, pas seulement technique.
`VoitureAIService` injecte le `ChatClient` Spring AI et interroge
le modèle LLaMA3 avec le catalogue réel de voitures depuis la base.

### Endpoints IA disponibles

#### 1. Recommandation intelligente
```http
POST /ai/recommander
Content-Type: application/json

{
  "budget": 95000,
  "usage": "famille, autoroute"
}
```
→ L'IA analyse le catalogue et recommande la meilleure voiture avec argumentaire.

#### 2. Estimation du prix de revente
```http
GET /ai/estimer/1
```
→ L'IA estime la valeur marchande d'une voiture selon son âge et ses caractéristiques.

#### 3. Fiche produit commerciale
```http
GET /ai/description/1
```
→ L'IA génère une fiche produit attractive pour une voiture du catalogue.

#### 4. Chatbot conseiller
```http
POST /ai/chat
Content-Type: application/json

{
  "question": "Quelle voiture pour une famille de 5 ?"
}
```
→ Chatbot intelligent qui connaît le catalogue du magasin.

### Valeur métier de l'IA

| Fonctionnalité | Valeur pour le magasin |
|---|---|
| Recommandation | Aide les vendeurs à conseiller rapidement les clients |
| Estimation revente | Facilite les reprises et évaluations |
| Fiche produit auto | Génère du contenu marketing sans effort |
| Chatbot | Support client 24h/24 sur le catalogue |

---

## 🧪 Tests

### Backend (JUnit 5 + H2 en mémoire)
```bash
cd backend
./mvnw test
```

### Test API avec curl

```bash
# Liste toutes les voitures
curl http://localhost:9090/voitures

# Ajouter une voiture
curl -X POST http://localhost:9090/voitures \
  -H "Content-Type: application/json" \
  -d '{"marque":"Renault","modele":"Clio","couleur":"Blanc","immatricule":"B-5-1234","annee":2020,"prix":80000}'

# Recommandation IA
curl -X POST http://localhost:9090/ai/recommander \
  -H "Content-Type: application/json" \
  -d '{"budget":100000,"usage":"famille"}'

# Fiche IA pour la voiture id=1
curl http://localhost:9090/ai/description/1

# Chatbot
curl -X POST http://localhost:9090/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"Quelle est votre voiture la moins chère ?"}'
```

### Recherches Spring Data REST

```bash
# Voitures par couleur
curl "http://localhost:9090/api/voitures/search/findByCouleur?couleur=Grise"

# Voitures par marque
curl "http://localhost:9090/api/voitures/search/findByMarque?marque=Toyota"
```

---

## 🛑 Arrêter les services

```bash
# Docker
docker-compose down

# Supprimer aussi les volumes (données)
docker-compose down -v
```

---

## 📦 Dépendances principales

### Backend
| Dépendance | Version | Rôle |
|---|---|---|
| Spring Boot | 4.0.6 | Framework principal |
| Spring Data JPA | inclus | ORM / persistance |
| Spring Data REST | inclus | Endpoints CRUD automatiques |
| PostgreSQL Driver | inclus | Base de données |
| Spring AI Ollama | 1.0.0 | Intégration IA |
| Springdoc OpenAPI | 2.5.0 | Documentation Swagger |
| Lombok | inclus | Réduction boilerplate |

### Frontend
| Dépendance | Version | Rôle |
|---|---|---|
| React | 18 | Framework UI |
| Vite | 5 | Bundler moderne |
| React Bootstrap | 2 | Composants UI |
| React Router | v6 | Navigation SPA |
| Axios | 1.7 | Requêtes HTTP |
| Font Awesome | 6 | Icônes |

---

*Projet réalisé dans le cadre du Master MIOLA — ENSIAS, sous la direction du Pr. Khalid Nafil.*
