# StockSense

**Inventory analysis and purchasing planner**

A full-stack web application that combines a React interface with a FastAPI backend to analyze sales and inventory data and calculate replenishment metrics.

> Personal portfolio project focused on full-stack development, data processing, and API design.

## Overview

StockSense aims to help small businesses turn sales and inventory data into useful information for purchasing decisions. The project includes a web interface for signing in and uploading CSV files, an API with authentication and pagination, and an analysis service built with Pandas and NumPy.

The core calculation uses sales history, current stock, and planning parameters to estimate daily and monthly demand, safety stock, reorder point, and suggested order quantities.

## Features

- Web interface built with React and TypeScript.
- JWT-based authentication.
- CSV upload for sales and current inventory data.
- Inventory replenishment metrics calculated with Pandas and NumPy.
- Automatically generated API documentation with Swagger UI.
- Endpoints for exporting reports to CSV and PDF.
- Local persistence with SQLite and SQLModel.

### Analysis workflow status

The calculation logic is implemented in `backend/services/order_processor_service.py`, and the frontend is set up to send a request to `/api/analysis`. However, the API does not currently expose that analysis endpoint. The calculation service still needs to be connected to a backend route before the upload-and-report workflow can run end to end.

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router |
| Backend | Python 3.13+, FastAPI, SQLModel |
| Data analysis | Pandas, NumPy |
| Database | SQLite |
| Authentication | OAuth2 Password Bearer, JWT, Argon2 |
| Reports | CSV, HTML, and PDF |

## How the calculation works

The processing service groups sales and inventory by product code and also accounts for products that appear in only one of the two data sources. Based on the supplied planning parameters, it calculates:

- **Daily demand:** units sold during the period divided by the number of days in the sales history.
- **Monthly demand:** daily demand projected over 30 days.
- **Safety stock:** daily demand multiplied by the buffer days.
- **Reorder point:** demand during the lead time plus safety stock.
- **Suggested order quantity:** demand for the coverage period minus available stock, with a minimum of zero.

## Project structure

```text
StockSense/
├── backend/
│   ├── core/                 # Configuration and security
│   ├── database/             # SQLite engine and sessions
│   ├── models/               # Data models
│   ├── reports/              # Report templates
│   ├── repositories/         # Data access
│   ├── routes/               # Authentication, analysis, and user routes
│   ├── schemas/              # API schemas
│   ├── services/             # Inventory calculations and report exports
│   ├── tests/                # Backend tests
│   ├── data/                 # Sample CSV files
│   ├── main.py               # FastAPI application
│   └── pyproject.toml
└── frontend/
    ├── src/
    │   ├── components/        # Forms, results, and pagination
    │   ├── pages/             # Application views
    │   ├── services/          # API communication
    │   └── types/              # TypeScript types
    └── package.json
```

## Requirements

- Python 3.13 or later.
- [`uv`](https://docs.astral.sh/uv/) for managing Python environments and dependencies.
- Node.js and npm for running the frontend.

## Run locally

### 1. Start the backend

From the repository root:

```powershell
cd backend
uv sync
uv run fastapi dev main.py
```

The API will be available at <http://127.0.0.1:8000>. Interactive Swagger documentation is available at <http://127.0.0.1:8000/docs>.

### 2. Start the frontend

In a separate terminal, from the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Vite will display the local application URL, usually <http://localhost:5173>.

The SQLite database is created at `backend/database.db` when the API starts. The repository includes a local database file; back it up before replacing it if you want to start with a clean database.

## Available API endpoints

The application registers its routes under the `/api` prefix:

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/login` | Signs in and returns an access token. |
| `GET` | `/api/users/` | Lists users; authentication required. |
| `POST` | `/api/users/` | Creates a user; authentication is not currently required. |
| `POST` | `/api/download_csv_report` | Generates a CSV report; authentication required. |
| `POST` | `/api/download_pdf_report` | Generates a PDF report; authentication required. |

## Quality and testing

To check the frontend:

```powershell
cd frontend
npm run lint
npm run build
```

The backend has a `tests/` directory. Check the project's test instructions or configuration before running its tests.

## Security

The current configuration defines a fixed JWT secret in `backend/core/config.py`. This is intended for development only: before deploying the application, replace it with a secure environment variable and do not commit secrets to the repository. The report export and user listing endpoints require a Bearer token; user creation does not currently require authentication.

## Roadmap

- Connect the calculation service to the `/api/analysis` endpoint.
- Configure the backend URL through frontend environment variables.
- Add and document automated tests for inventory processing and API routes.
- Move the JWT secret to environment-based configuration and prepare the application for deployment.

## Author

**Kensoto Sala** · GitHub: [@kensotosala](https://github.com/kensotosala)
