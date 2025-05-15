import React, { useState } from 'react';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import BookImport from './components/BookImport';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './styles.css';
import { FaBook } from "react-icons/fa6";

function App() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (book) => setSelectedBook(book);
  const triggerRefresh = () => {
    setRefresh(!refresh);
    setSelectedBook(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4"><FaBook color='grey'/> Book Management</h1>
      <BookForm selectedBook={selectedBook} onSaved={triggerRefresh} />
      <BookImport onImported={triggerRefresh} />
      <BookList key={refresh} onEdit={handleEdit} />
    </div>
  );
}

export default App;
