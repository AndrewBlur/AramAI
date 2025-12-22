# 🧠 AramAI – RAG-based Legal AI Assistant

**AramAI** is an intelligent **Legal AI Assistant** designed to provide contextual legal information and document analysis using **Retrieval-Augmented Generation (RAG)**.
It integrates **FastAPI**, **LangChain**, **LangGraph**, **React**, and **MongoDB** to deliver a full-stack AI experience — combining legal domain data with natural language understanding.

---

## 🚀 Features

* ⚖️ **Legal Query Assistant** – Ask legal questions and get context-aware answers.
* 🧩 **RAG Architecture** – Retrieves relevant legal documents before generating responses.
* 📚 **Vector Database (Qdrant)** – Stores and searches legal embeddings efficiently.
* 🌐 **FastAPI Backend** – Powers the AI and API endpoints.
* 💻 **React 
Frontend** – Provides a smooth, mobile-friendly user interface.
* ☁️ **MongoDB Integration** – Handles user data and query history.
* 🧠 **Embeddings via Ollama + nomic-embed-text** – For semantic document retrieval.

---

## 🧩 Tech Stack

| Layer               | Technology                      |
| ------------------- | ------------------------------- |
| **Frontend**        | React                           |
| **Backend**         | Node.js + Express               |
| **AI Service**      | FastAPI + LangChain + LangGraph |
| **Database**        | MongoDB (Atlas)                 |
| **Vector Store**    | Qdrant                          |
| **Embedding Model** | Ollama (`nomic-embed-text`)     |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AndrewBlur/AramAI.git
cd AramAI
```

---

### 2️⃣ Create Environment Files

#### Root `.env`

```bash
INDIAN_KANOON_API_KEY=
GOOGLE_API_KEY=
TAVILY_API_KEY=
PORT=
MONGO_DEV_URI=
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
AI_API_URL=http://localhost:8000/chat_stream/
```
---

### 3️⃣ Setup Vector Database (Qdrant)

#### Install Docker Engine

Follow instructions from [Docker Docs](https://docs.docker.com/engine/install/).

#### Run Qdrant

```bash
docker run --name qdrant -p 6333:6333 -v qdrant_storage:/qdrant/storage qdrant/qdrant
```

Access the dashboard:
👉 [http://localhost:6333/dashboard](http://localhost:6333/dashboard)

#### Upload Snapshot

Download and upload this snapshot file:
🔗 [India Laws Snapshot](https://www.mediafire.com/file/b254k63ormo2kr5/india_laws.snapshot/file)

---

### 4️⃣ Install Ollama and Pull Model

Install [Ollama](https://ollama.ai/download), then run:

```bash
ollama pull nomic-embed-text:latest
```

---

### 5️⃣ Run Backend Server

```bash
cd backend
npm install
npm run dev
```

---

### 6️⃣ Run Frontend (React)

```bash
cd frontend
npm install
npm start
```

---

### 7️⃣ Setup Python Virtual Environment for AI Service

```bash
cd ..
python -m venv venv
./venv/Scripts/Activate
```

Install dependencies:

```bash
uv pip install -r requirements.txt
# or
pip install -r requirements.txt
```

Run the FastAPI service:

```bash
uvicorn main:app --reload
```

---

## 🧠 How It Works

1. User asks a legal question via the frontend.
2. Backend sends the query to the FastAPI AI service.
3. FastAPI uses **LangChain + LangGraph** to:

   * Retrieve context from **Qdrant** (vector database)
   * Generate legal insights via LLM (OpenAI/Groq)
4. Response is returned to the frontend in real time.

---

## 🧩 Project Architecture

```
AramAI/
│
├── backend/         # Node.js + Express server
├── frontend/        # React app
├── venv/            # Python virtual environment
├── main.py          # FastAPI entry point
├── requirements.txt # Python dependencies
├── .env             # Root environment variables
└── README.md        # Project documentation
```

---

## 🧰 Tools & Dependencies

* **LangChain**, **LangGraph**
* **FastAPI**, **Uvicorn**
* **React**, **Node.js**
* **MongoDB**, **Qdrant**
* **Ollama**
* **Cloudinary** (for file storage)

---

## 📜 License

This project is currently under development by **Andrew A.**, **Mithun Arulmani**, **Nawrinth**, and **Sethukumar M**
© 2025 AramAI – All Rights Reserved.

---=
