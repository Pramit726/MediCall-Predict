# Modular Testing & Integration Guide

This project follows a **modular architecture**, where the **ML Engine**, **Backend**, and **Frontend** can be developed, tested, and verified independently, then seamlessly integrated using environment variables. This ensures scalability, testability, and professional-grade separation of concerns.

---

## A. Testing the ML Engine (Isolated)

You do **not** need the frontend or backend to validate your ML logic.

### Steps

* **Action**: Start the FastAPI server

  ```bash
  uvicorn main:app --reload
  ```

* **Access Swagger UI**:
  Open 👉 `http://localhost:8000/docs`

* **Test**:
  Execute the `/workforce_requirement` endpoint with a sample JSON request body.

### Verification

* If the API returns **200 OK** with valid staffing numbers:

  * ✅ ML Module is independently functional
  * ✅ Model loading, preprocessing, and inference are working correctly

---

## B. Testing the Backend Proxy (Isolated)

The backend can be tested without any frontend dependency using API tools.

### Steps

* **Tool**: Postman or Insomnia

* **Action**: Send a `POST` request to:

  ```
  http://localhost:5000/api/auth/login
  ```

* **Test**:

  * Provide valid credentials in the request body
  * Verify response

### Verification

* ✅ JWT token is returned
* ✅ Authentication logs are stored in **MongoDB Atlas**

This confirms:

* Auth Module works independently
* Database connectivity is correct

---

## C. Testing the Frontend (Isolated)

The frontend can be validated even when the backend is unavailable.

### Steps

* **Action**: In `Forecast.jsx`, temporarily use mock data:

  ```js
  const data = [
    { month: 'Jan', value: 40 },
    { month: 'Feb', value: 55 },
    { month: 'Mar', value: 70 }
  ];
  ```

* Render this data using **Recharts**

### Verification

* ✅ Line graph renders correctly
* ✅ UI logic and visualization module function independently

---

## 3. Seamless Integration (The "Glue")

Integration is handled using **Environment Variables**, avoiding hardcoded paths and enabling flexible deployment.

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

* Connects React/Vite frontend to Node.js backend

### Backend (`.env`)

```env
FASTAPI_URL=http://localhost:8000
MONGO_URI=<your_mongodb_connection_string>
```

* Bridges Node.js to FastAPI
* Establishes database connection

---

## 4. Verification Checklist (Section-D)

Include the following table in your report to demonstrate professional modular validation:

| Requirement           | Evidence                                                                     |
| --------------------- | ---------------------------------------------------------------------------- |
| Independent Execution | Each module has its own `package.json` or `requirements.txt`                 |
| Conflict-Free Runtime | Python 3.x (ML) and Node.js (Backend) run in separate environments           |
| Seamless Integration  | Node.js uses `axios` to communicate with FastAPI; frontend uses interceptors |
| Testability           | Modules verified using Swagger UI, Postman, and frontend mock testing        |

---

## Summary

This modular validation strategy ensures:

* Independent development & testing
* Easy debugging and maintenance
* Clean integration using industry best practices

🚀 This approach aligns with **enterprise-grade system design** and is ideal for academic reviews, capstone evaluations, and production-ready deployments.
