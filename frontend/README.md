# Mini-RAG Frontend

A React-based frontend for the Mini-RAG application, which implements a minimal Retrieval-Augmented Generation (RAG) system for question answering.

## Features

- Upload PDF documents to projects
- Process documents into chunks for indexing
- Index chunks into a vector database
- Search indexed documents semantically
- Ask questions and get answers using RAG

## Getting Started: Deploying on a New PC or Server

Follow these steps to set up and run the Mini-RAG frontend on a new machine:

### 1. Prerequisites

- **Node.js** (v18 or higher): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (to clone the repository): [Download Git](https://git-scm.com/)

### 2. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/YOUR_USERNAME/mini-rag.git
cd mini-rag/frontend
```

Replace `YOUR_USERNAME` with the correct GitHub username or use your own repository URL if different.

### 3. Install Dependencies

Install the required packages:

```bash
npm install
```

Or, if you prefer yarn:

```bash
yarn install
```

### 4. Configure Environment (Optional)

If you need to set custom environment variables (e.g., API base URL), create a `.env` file in the `frontend` directory. Example:

```
VITE_API_BASE_URL=http://localhost:8000
```

By default, the frontend expects the backend API to be available at `http://localhost:8000`.

### 5. Running the Frontend

#### Development Mode

Start the development server (with hot reload):

```bash
npm run dev -- --host 0.0.0.0
```

Or with yarn:

```bash
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

#### Production Build

To build the app for production:

```bash
npm run build
```

Or with yarn:

```bash
yarn build
```

The build output will be in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

Or with yarn:

```bash
yarn preview
```

### 6. Deploying the Production Build

- Serve the contents of the `dist/` directory using any static file server (e.g., [serve](https://www.npmjs.com/package/serve), Nginx, Apache).
- Example using `serve`:

  ```bash
  npm install -g serve
  serve -s dist
  ```

## Docker Deployment

The frontend application is available as a Docker image on Docker Hub.

### Docker Image

```
00jimmy00/local-rag-frontend:latest
```

### Environment Variables

When deploying the frontend, configure the following environment variables:

- `VITE_FRONTEND_URL`: The URL where the frontend is accessible (default: http://173.212.254.228:3001)
- `VITE_API_URL`: The URL of the backend API (default: http://173.212.254.228:5000)
- `VITE_API_BASE_PATH`: The base path for API endpoints (default: /api/v1)
- `NODE_ENV`: The environment mode (default: production)

### Coolify Deployment

To deploy the application with Coolify:

1. Create a new service in Coolify
2. Select "Docker Hub" as the source
3. Enter `00jimmy00/local-rag-frontend` as the image
4. Set the tag to `latest`
5. Configure the environment variables listed above
6. Set the exposed port to `3001`
7. Deploy the application

You can also use the provided `docker-compose.coolify.yml` file as a reference for Coolify configuration.

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