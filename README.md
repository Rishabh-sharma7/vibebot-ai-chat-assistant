# 🤖 AI Chat Assistant

An AI-powered chatbot built using React, FastAPI, Groq LLM, and Supabase.

The application allows users to:

- Chat with an AI assistant
- Upload PDF and PPTX documents
- Ask questions from uploaded documents
- Generate AI images from text prompts
- Download generated images
- Store chat history
- Manage multiple chat sessions
- Authenticate users using Supabase Authentication

---

# 🚀 Features

## 💬 AI Chat

Users can chat with an AI assistant powered by Groq's Llama 3.1 model.

### Example

User:
```
Explain Artificial Intelligence
```

AI:
```
Artificial Intelligence (AI) is...
```

---

## 📄 Document Question Answering

Upload:

- PDF files
- PowerPoint (PPTX) files

The backend extracts text and allows the AI to answer questions based only on uploaded documents.

### Example

Upload:

```
Operating Systems Notes.pdf
```

Ask:

```
What is process scheduling?
```

AI answers from the uploaded document.

---

## 🎨 AI Image Generation

Generate images using prompts such as:

```
Generate image of a futuristic city
```

```
Create image of a tiger wearing sunglasses
```

```
Draw a cyberpunk motorcycle
```

Images can be downloaded directly from the chat interface.

---

## 📚 Chat History

The application stores:

- Chat sessions
- Messages
- Uploaded documents

Users can switch between previous chats.

---

## 🔐 User Authentication

Authentication is handled by Supabase.

Supports:

- Sign Up
- Sign In
- Sign Out

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- Vite
- Lucide React

## Backend

- FastAPI
- Python

## AI Models

### Text Generation

- Groq API
- Llama 3.1 8B Instant

### Image Generation

- Cloudflare AI (Flux Schnell)
- Pollinations AI (fallback)

## Database

Supabase PostgreSQL

## Storage

Supabase Storage

---

# 📦 Libraries Used

## Frontend

```bash
react
typescript
vite
tailwindcss
@supabase/supabase-js
lucide-react
```

## Backend

```bash
fastapi
uvicorn
python-dotenv
groq
requests
PyPDF2
python-pptx
python-multipart
```

---

# 🗄️ Database Tables

## chat_sessions

Stores chat sessions.

| Column | Type |
|----------|----------|
| id | uuid |
| created_at | timestamp |

---

## messages

Stores chat messages.

| Column | Type |
|----------|----------|
| id | uuid |
| session_id | uuid |
| role | text |
| content | text |
| type | text |
| created_at | timestamp |

---

## uploaded_files

Stores uploaded documents.

| Column | Type |
|----------|----------|
| id | uuid |
| session_id | uuid |
| filename | text |
| file_type | text |
| extracted_text | text |
| created_at | timestamp |

---

# ⚙️ Environment Variables

Create a `.env` file in the backend folder.

```env
GROQ_API_KEY=your_groq_api_key

CLOUDFLARE_API_TOKEN=your_cloudflare_token

CLOUDFLARE_ACCOUNT_ID=your_account_id
```

---

# 🖥️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/ai-chat-assistant.git

cd ai-chat-assistant
```

---

# Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

Install packages:

```bash
pip install -r requirements.txt
```

Run backend:

```bash
uvicorn main:app --reload --port 8001
```

Backend URL:

```text
http://127.0.0.1:8001
```

---

# Frontend Setup

Open another terminal.

Navigate:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# 📂 Project Structure

```text
project/
│
├── backend/
│   ├── main.py
│   ├── generated_images/
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── App.tsx
│
├── README.md
│
└── requirements.txt
```

---

# 🔄 System Workflow

1. User sends message
2. React frontend sends request to FastAPI
3. FastAPI calls Groq API
4. Response returned to frontend
5. Message stored in Supabase
6. Chat history updated

For image generation:

1. User enters image prompt
2. FastAPI calls Cloudflare AI
3. Image generated
4. Image stored
5. URL returned
6. Frontend displays image
7. User can download image

---

# 🧠 Main Algorithm

The project primarily uses:

### Retrieval-Augmented Document Question Answering

Process:

1. Extract document text
2. Store extracted text
3. Inject text into prompt
4. Send prompt to LLM
5. Return answer

For images:

### Text-to-Image Generation

Prompt → AI Model → Image Output

---

# 🔮 Future Improvements

- Vector Database (RAG)
- Semantic Search
- Conversation Memory
- User Profiles
- Image Editing
- Dark Mode
- Voice Input
- Speech-to-Text
- Multi-Model Support
- OpenAI Integration
- Gemini Integration

---

# 👨‍💻 Author

Rishabh R. Sharma

Built using:

- React
- FastAPI
- Supabase
- Groq
- Cloudflare AI




# VibeBot AI Chat Assistant

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Rishabh-sharma7/vibebot-ai-chat-assistant.git
cd vibebot-ai-chat-assistant
```

---

### 2. Install Frontend Dependencies

```bash
npm install
```

or

```bash
npm install --legacy-peer-deps
```

(if dependency conflicts occur)

---

### 3. Create Environment File

Create a `.env` file in the project root.

Example:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

### 4. Setup Backend Environment

Navigate to backend:

```bash
cd backend
```

Create virtual environment:

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

#### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 5. Install Python Dependencies

```bash
pip install fastapi
pip install uvicorn
pip install groq
pip install python-dotenv
pip install requests
pip install PyPDF2
pip install python-pptx
pip install python-multipart
```

Or:

```bash
pip install -r requirements.txt
```

(if requirements.txt is included)

---

### 6. Create Backend .env File

Inside the backend folder:

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY

CLOUDFLARE_API_TOKEN=YOUR_CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID=YOUR_CLOUDFLARE_ACCOUNT_ID
```

---

### 7. Run Backend Server

From backend folder:

```bash
uvicorn main:app --reload --port 8001
```

Backend URL:

```text
http://127.0.0.1:8001
```

---

### 8. Run Frontend

Open another terminal in project root:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

### 9. Supabase Setup

Create the following tables:

* chat_sessions
* messages
* uploaded_files

Create storage bucket:

```text
chat-files
```

Enable:

```text
Public Access
```

---

### 10. Build for Production

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

---

## Useful Git Commands

Commit changes:

```bash
git add .
git commit -m "Updated project"
git push
```

Pull latest updates:

```bash
git pull origin main
```

Check repository status:

```bash
git status
```

View commit history:

```bash
git log --oneline
```

---

## Tech Stack

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* Vite
* Supabase JS

### Backend

* FastAPI
* Python
* Groq API
* Cloudflare AI
* PyPDF2
* python-pptx

### Database

* Supabase PostgreSQL

### Storage

* Supabase Storage

### Authentication

* Supabase Auth

---

## Features

* User Authentication
* AI Chat
* PDF Upload
* PPTX Upload
* Document Question Answering
* Image Generation
* Download Generated Images
* Chat History
* Session Management
* Cloudflare AI Integration
* Groq LLM Integration

---

## Future Improvements

* Dark Mode
* Markdown Rendering
* Streaming Responses
* Conversation Titles
* Voice Input
* Deploy on Vercel + Render
* Multi-Model Support
