import React, { useEffect, useState } from 'react';
import { SiBookstack } from "react-icons/si";

const BookList = ({ onEdit }) => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    const res = await fetch('http://localhost:7000/books');
    const data = await res.json();
    setBooks(data);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:7000/books/${id}`, { method: 'DELETE' });
    fetchBooks();
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <h2><SiBookstack/> Book List</h2>
      <ul className="list-group">
        {books.map(book => (
          <li key={book.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{book.title}</strong> by {book.author} ({book.publishedYear})
            </div>
            <div>
              <button className="btn btn-sm btn-info me-2" onClick={() => onEdit(book)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
