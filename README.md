# Resume Recommender & Job Recommendation System

> **Stack:** Next.js (Frontend) + Flask (Backend ML service) + Node/Express (API) + MongoDB + Vector DB (Pinecone/Qdrant/Weaviate)

A production-style, end-to-end AI/ML web project that recommends jobs to users based on the resume they upload. This README describes the project goals, architecture, complete pipeline, implementation notes, deployment, and interview talking points.

---

## Table of Contents

1. Project Overview
2. Key Features
3. Why this is a real AI/ML project (pros)
4. High-level Architecture
5. Pipeline / Workflow (step-by-step)
6. Data Model
7. API Endpoints
8. Tech Stack & Libraries
9. Local Setup (Dev) — Frontend + Backend + ML Service
10. Embeddings & Vector DB
11. Training a Ranking Model (optional)
12. Deployment & Hosting
13. Security & Privacy
14. Testing & Monitoring
15. Roadmap / Road to Production
16. Interview Pitch / How to explain this project
17. File Structure (recommended)
18. Frequently Asked Questions
19. License

---

# 1. Project Overview

The Resume Recommender is a web application that:

* Accepts resume uploads (PDF/DOCX)
* Parses and extracts structured resume data (skills, experience, education)
* Encodes resume and job descriptions as semantic vectors (embeddings)
* Stores vectors in a vector DB and performs semantic search
* Ranks candidate job postings using a combination of semantic similarity and a learnable ranking model
* Provides explainable recommendations (matched skills, missing skills, similarity score)
* Allows users to tailor resumes for a specific job using LLM-powered rewrites

This implementation separates concerns into:

* **Next.js frontend** — UI, authentication, uploads, results visualization
* **Node/Express API** — main application API, auth, storage, job ingestion
* **Flask ML Service** — resume parsing, embeddings generation, vector search wrapper, ranking model

# 2. Key Features

* Resume upload (PDF/DOCX) + parsing to text
* Skills extraction (NER + dictionary + fuzzy matching)
* Embeddings generation for resumes & JDs
* Vector DB-backed semantic search (Pinecone / Qdrant / Weaviate)
* ML-based re-ranking (LightGBM / XGBoost) using engineered features
* Explainability: matched skills, missing skills, top phrases
* Tailor resume using LLM (optional: Hugging Face / OpenAI)
* Job ingestion pipelines (Adzuna / JSearch / Greenhouse / Lever)
* Versioning of tailored resumes + export to PDF

# 3. Why this is a real AI/ML project (Pros)

* ⚙️ **Multiple ML techniques**: NER, embeddings, semantic search, and a supervised ranking model combine to form the intelligence.
* 🧠 **Model engineering**: you design features, train a ranker, and evaluate results — not just calling a single API.
* 🔍 **Explainability**: you compute and present interpretable signals (skill overlap, cosine similarity, missing must-have skills).
* 🔁 **Data pipeline**: job ingestion, vector indexing, and retraining loops are standard ML production patterns.
* 📈 **Measurable improvements**: you can A/B test different embedding models, ranking features, or prompt templates.

These points make it an interview-grade ML project.

# 4. High-level Architecture

```
[User (Browser)]
    │
    │  (1) Upload resume, request recommendations
    ▼
[Next.js Frontend]  ── REST ──▶ [Node/Express API]
                           │
                           │  (2) store file (S3), create resume record
                           │  (3) call ML Service: /parse_and_embed
                           ▼
                     [Flask ML Service]
                           │
    (A) parse resume -> text -> skills
    (B) embed resume text -> save vector to Vector DB
    (C) vector search -> top-k job vectors
    (D) re-rank using ranking model
    (E) return explainable matches
                           │
                           ▼
                     [Vector DB (Pinecone/...) ]
                           │
                           ▼
                     [MongoDB Atlas (jobs, users, resumes, suggestions)]
```

Notes:

* Job ingestion is a scheduled worker (Node or Python) that pulls jobs, normalizes, creates embeddings, and upserts to vector DB.
* LLM-based tailoring and cover letter generation can be another microservice or integrated into Flask.

# 5. Pipeline / Workflow (Detailed Step-by-step)

Below is the step-by-step pipeline when a user uploads a resume and requests job recommendations.

1. **User Uploads Resume (Frontend)**

   * Next.js uploads the file to your backend (Node/Express) via `POST /resume/upload`.
   * Backend stores file into S3/R2 and creates a `resume` record in MongoDB with status `uploaded`.

2. **Backend Requests Parsing & Embedding (Sync or Async)**

   * Node calls Flask ML service: `POST /ml/parse_and_embed` with the resume file URL and resumeId.
   * Flask downloads file, extracts text using `PyMuPDF` / `pdfminer.six` / `python-docx`.

3. **Resume Text Processing (Flask ML Service)**

   * Normalize text (clean bullets, remove headers, join hyphenated words).
   * Run spaCy NER + custom skill matching (dictionary + fuzzy matching) to extract skills, roles, dates.
   * Produce a structured JSON: `{summary, skills:[], experiences:[], education:[], raw_text}`.

4. **Compute Embeddings**

   * Use `sentence-transformers` locally or call a hosted embeddings API (Hugging Face / OpenAI / Cohere).
   * Produce a dense vector for the resume text or for chunks of the resume.
   * Store the vector in your Vector DB and keep `embedding_id` in the resume record.

5. **Search Top-k Jobs (Vector DB)**

   * Query the vector DB with the resume embedding for top-k nearest job vectors.
   * Return candidate job IDs + similarity scores.

6. **Feature Engineering for Ranking**
   For each candidate (resume, job) pair compute features, e.g.:

   * `cosine_similarity` (embedding similarity)
   * `skill_overlap_ratio` = (# matched skills) / (# required skills)
   * `years_experience_diff` = abs(resume\_years - job\_required\_years)
   * `location_match_flag` (0/1)
   * `seniority_match_flag` (0/1)
   * `keyword_count` = count of exact keywords in resume

7. **Re-rank with ML Model**

   * Apply a pre-trained ranking model (LightGBM/XGBoost/Logistic) to compute final probability/score.
   * If you don't have training data yet, use a weighted-scoring heuristic (semantic*0.55 + keyword*0.3 + overlap\*0.15).

8. **Explainability & Postprocessing**

   * For the top N jobs compute matched skills list, missing skills, and top matching phrases.
   * Create a human-readable explanation (`"Matches on: React, Node. Missing: AWS, Docker"`).

9. **Return Results**

   * Flask sends recommended jobs + scores + explanations to the Node API.
   * Node API stores `matches` and returns results to the Next.js frontend for display.

10. **Optional: Tailoring**

* User chooses a job -> request `POST /suggestions/tailor`.
* Node calls LLM service with (resume JSON + JD) to generate tailored summary + STAR bullets + cover letter.


# 8. Tech Stack & Libraries

**Frontend**

* Next.js
* Tailwind CSS, shadcn/ui
* react-query (TanStack)

**Backend (API)**

* Node.js, Express
* Mongoose
* AWS S3 or Cloudflare R2 (file storage)

**ML Service** (Flask/Python)

* Flask or FastAPI
* PyMuPDF / python-docx / pdfminer.six
* spaCy (NER) + custom skill matcher
* sentence-transformers (`all-MiniLM-L6-v2` or `all-mpnet-base-v2`)
* scikit-learn, LightGBM/XGBoost
* Pinecone / Qdrant / Weaviate client

**Other**

* MongoDB Atlas
* Pinecone (or Qdrant/Weaviate)
* GitHub Actions (CI/CD)
* Docker for containerization

# 9. Local Setup (Dev)

> These steps assume you have Node.js, Python 3.10+, pip, Docker (optional) installed.

**requirements.txt (ml\_service)**

```
flask
uvicorn
fastapi
spacy
sentence-transformers
pymupdf
python-docx
pinecone-client
pydantic
lightgbm
scikit-learn
```

## 9.4 Setup Next.js Frontend (frontend/)

```bash
cd ../frontend
cp .env.local.example .env.local
npm install
npm run dev
```

**.env.local.example**

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

# 10. Embeddings & Vector DB

* **Embeddings**: Use `sentence-transformers` locally (fast & free) or hosted embeddings (OpenAI/Hugging Face) if scale/latency matters.
* **Vector DB**: Pinecone (managed) or Qdrant/Weaviate (self-hosted or managed).

### Vector strategy

* Option A: one embedding per resume and one per job (fast, coarse).
* Option B: chunk resume & JD into sections and embed each chunk (more accurate retrieval, slightly more complex).

### Indexing

* When ingesting jobs: normalize text -> compute embedding -> upsert into vector DB (metadata: jobId, company, title, location)
* Query: embed resume -> query top-k nearest neighbors -> retrieve metadata -> re-rank

# 11. Training a Ranking Model (optional — advanced)

1. **Collect training data**

   * If you have user click/apply data: label positive (applied/hired) and negative examples.
   * If none: generate weak labels by heuristics (high cosine + keyword overlap -> positive)

2. **Feature engineering**

   * Use features described in pipeline (cosine, overlaps, flags, years diff).

3. **Train**

   * Train LightGBM/XGBoost to predict probability of match.
   * Save model to artifact store (S3) and serve from Flask.

4. **Evaluation**

   * Metrics: NDCG\@10, MAP, Precision\@k

# 12. Deployment & Hosting

**Frontend**: Vercel — automatic preview & production deployments.

**Node API**: Render / Fly / Railway / Heroku — Docker image or Node build. Use a separate worker service for ingestion and scheduled jobs.

**Flask ML Service**: Use Render/Fly or containerized service on Railway. If heavy, deploy to a GPU-enabled host or use managed embeddings.

**Vector DB**: Pinecone Cloud (recommended for MVP). For self-hosting, Qdrant managed or Weaviate cloud.

**DB**: MongoDB Atlas (production-tier for scaling).

**CI/CD**: GitHub Actions — run tests, build images, deploy on merge.

# 13. Security & Privacy

* Encrypt files in transit (HTTPS) and at rest (S3 encryption).
* Limit data retention and give users a delete option.
* Do not forward raw resumes to third parties unless explicitly allowed.
* Rate-limit LLM calls (cost control) and cache generated tailoring outputs.

# 14. Testing & Monitoring

* Unit tests: parsing functions, NER extraction, scoring.
* Integration tests: end-to-end upload -> parse -> recommend.
* Monitoring: Sentry/Logtail for errors, Prometheus + Grafana for metrics.
* Logging: store pipeline traces for debugging (especially embeddings + vector queries).

# 15. Roadmap / Road to Production

**MVP** (2–3 weeks): Upload → parse → top-k semantic matches → explainability.

**v1** (1 month): Job ingestion, re-ranking model, tailored resume generation, export PDF, saved searches.

**v2** (2+ months): Fine-tune embeddings, AB testing, employer dashboard, analytics, paid features.

# 16. Interview Pitch / How to explain this project

Short pitch (30–60s):

> "I built an end-to-end resume recommender that combines NLP and vector search to match candidates to job postings. The system parses resumes, extracts skills using spaCy and a custom skill dictionary, converts documents to embeddings, and uses a vector DB for semantic retrieval. Candidates are re-ranked using a trained LightGBM model with features like skill overlap and location. The frontend is Next.js and I deployed services as microservices so each ML/ingestion piece is independently scalable."

If asked "Aren't you just calling Hugging Face?":

> "I use pre-trained models for embeddings as a building block, but the project involves feature engineering, ranking model training, retrieval pipelines, and explainability — all core ML engineering tasks. I can also fine-tune or replace the embedding model when we have labeled data."

# 17. File Structure (recommended)

```
resume-recommender/
├─ frontend/               # Next.js
├─ server/                 # Node/Express API
│  ├─ src/
│  ├─ routes/
│  └─ workers/             # ingestion, scheduled jobs
├─ ml_service/             # Flask ML microservice
│  ├─ app.py
│  ├─ models/
│  ├─ embeddings/
│  └─ requirements.txt
├─ infra/                  # IaC (terraform / cloudformation)
└─ docs/
```

# 18. Frequently Asked Questions

**Q: Is using pre-trained embeddings cheating?**
A: No — using pre-trained models is industry-standard. The value is in how you integrate, tune, and measure them. You can fine-tune later.

**Q: How to evaluate recommendations without users?**
A: Use heuristic labeling or crowdsource small labels. Use offline metrics (NDCG, precision\@k) for model selection.

**Q: Can this be done without a paid vector DB?**
A: Yes — FAISS (local) or Qdrant self-hosted are free options but require more infra.

# 19. License

MIT License — feel free to adapt, improve, and use for interviews and portfolios.

---

If you want, I can now:

* Provide a fully fleshed `.env.example` for each service
* Generate `docker-compose.yml` to run Node + Flask + MongoDB + Qdrant locally
* Produce the exact Flask endpoints + example request/responses
* Create the Next.js upload component and API integration

## 🤖 AI/ML Tools Used

This project integrates multiple AI/ML tools and libraries to build a real intelligent job recommender:

### 1. **Resume Parsing (NLP)**
- **spaCy** → Named Entity Recognition (extract skills, job titles, organizations, education).
- **PyMuPDF / pdfminer / docx2txt** → Extract raw text from resumes (PDF/DOCX).

### 2. **Semantic Embeddings**
- **Hugging Face Sentence-Transformers** → Generate embeddings for resumes & job descriptions.
  - Example models: `all-MiniLM-L6-v2`, `all-mpnet-base-v2`.
- These embeddings allow **semantic similarity search** beyond simple keyword matching.

### 3. **Vector Database**
- **Qdrant / Pinecone / Weaviate** → Store embeddings and perform efficient vector search.
- Enables fast retrieval of the most relevant jobs for a given resume.

### 4. **Recommendation Engine**
- **Cosine Similarity** → Base similarity scoring between resumes and jobs.
- **Scikit-learn / XGBoost / LightGBM** (optional) → Train a learning-to-rank model to refine recommendations using:
  - Embedding similarity
  - Skill overlap percentage
  - Experience & location match

### 5. **Explainability (XAI)**
- Custom Python logic to highlight:
  - ✅ Matched Skills
  - ⚠ Missing Skills
- *(Optional)* **SHAP / LIME** → For explainable ML insights into recommendation scores.

### 6. **Optional Enhancements**
- **OpenAI / LLaMA / GPT (via Hugging Face)** → For:
  - Resume rewriting suggestions
  - Interview question generation
  - Job description summarization
