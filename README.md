# Book Management REST API

A simple RESTful API for managing a collection of books, built with Node.js, Express, and SQLite. Supports CRUD operations and bulk CSV import with validation.

---

## Features

- CRUD endpoints for books
- Bulk CSV import with manual validation (no third-party CSV parsers)
- Centralized error handling middleware
- Basic logging with morgan
- CORS enabled
- Environment variable support (port)
- MVC-style project structure
- Ready-to-use Postman collection

---

## Endpoints

| Method | Endpoint             | Description                  |
|--------|---------------------|------------------------------|
| GET    | `/books`            | Get all books                |
| GET    | `/books/:id`        | Get details of a book        |
| POST   | `/books`            | Add a new book               |
| PUT    | `/books/:id`        | Update an existing book      |
| DELETE | `/books/:id`        | Delete a book                |
| POST   | `/books/import`     | Bulk import books via CSV    |

### Book Object

- `id`: string (UUID)
- `title`: string
- `author`: string
- `publishedYear`: number

### Bulk Import

- Upload a CSV file with columns: `title,author,publishedYear`
- Returns number of books added and a list of error rows

---

## Setup Instructions

1. **Clone the repository**
    ```bash
    git clone https://github.com/Sravanikonapalli/book-management-api.git
    cd book-management-api
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Configure environment variables**  
    Create a `.env` file (optional):
    ```env
    PORT=7000
    ```

4. **Run the server**

*frontend*
    ```bash
    npm start
    ```
*backend*
    ```bash
    node server.js
    ```

---

## 🧪 API Testing

- Import the provided Postman collection:  
  [Book Management API Postman Collection](https://.postman.co/workspace/My-Workspace~ba91cff3-803a-4520-81ab-75bad96355db/collection/40982288-995e4024-a237-4fdd-93b3-438ea37d3504?action=share&creator=40982288)

  (or)

- Use the `book management api.postman_collection.json` file in this folder.

---

## Live Links

- [Backend live link](https://book-management-api-u4d9.onrender.com)
- [Frontend live link](https://book-management-api-wheat.vercel.app/)

---

## Deployments

- **Backend:** Render
- **Frontend:** Vercel

---

## Example Postman Requests

### Bulk Import Books

**POST** `http://localhost:7000/books/import`  
Form-data:  
- `file`: (attach your CSV file)

### Get All Books

**GET** `http://localhost:7000/books`

### Add a Book

**POST** `http://localhost:7000/books`  
Body (JSON):
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "publishedYear": 2023
}
```

### Update a Book

**PUT** `http://localhost:7000/books/1`  
Body (JSON):
```json
{
  "title": "Updated Title",
  "author": "New Author",
  "publishedYear": 2024
}
```

### Delete a Book

**DELETE** `http://localhost:7000/books/1`

---

**Tip:** Use the provided Postman collection to quickly test all endpoints.
