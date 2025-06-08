# Mini-RAG Frontend

A React-based frontend for the Mini-RAG application, which implements a minimal Retrieval-Augmented Generation (RAG) system for question answering.

## Features

- Upload PDF documents to projects
- Process documents into chunks for indexing
- Index chunks into a vector database
- Search indexed documents semantically
- Ask questions and get answers using RAG

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

This will start the development server at http://localhost:3000.

### Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## API Integration

The frontend integrates with the Mini-RAG API endpoints as defined in the PRD:

- Welcome Endpoint: `GET /api/v1/`
- Upload Data: `POST /api/v1/data/upload/{project_id}`
- Process Data: `POST /api/v1/data/process/{project_id}`
- Index Push: `POST /api/v1/nlp/index/push/{project_id}`
- Index Info: `GET /api/v1/nlp/index/info/{project_id}`
- Index Search: `POST /api/v1/nlp/index/search/{project_id}`
- Index Answer (RAG): `POST /api/v1/nlp/index/answer/{project_id}`

## Technology Stack

- React
- Material UI
- Vite
- Axios for API requests 