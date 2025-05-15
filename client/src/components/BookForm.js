import React, { useState, useEffect } from 'react';
import { IoPencil } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

const BookForm = ({ selectedBook, onSaved }) => {
  const [formData, setFormData] = useState({ title: '', author: '', publishedYear: '' });

  useEffect(() => {
    if (selectedBook) setFormData(selectedBook);
  }, [selectedBook]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id
      ? `https://book-management-api-u4d9.onrender.com/books/${formData.id}`
      : 'https://book-management-api-u4d9.onrender.com/books';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        author: formData.author,
        publishedYear: Number(formData.publishedYear),
      }),
    });

    if (res.ok) {
      setFormData({ title: '', author: '', publishedYear: '' });
      onSaved();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
        <h2>
        {formData.id ? (
            <>
            <IoPencil/> Update Book
            </>
        ) : (
            <>
            <IoMdAdd color='green'/> Add Book
            </>
        )}
        </h2>
        <input type="text" className="form-control mb-2" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input type="text" className="form-control mb-2" name="author" placeholder="Author" value={formData.author} onChange={handleChange} required />
        <input type="number" className="form-control mb-2" name="publishedYear" placeholder="Published Year" value={formData.publishedYear} onChange={handleChange} required />
        <button className="btn btn-success">{formData.id ? 'Update' : 'Add'} Book</button>
    </form>
  );
};

export default BookForm;
