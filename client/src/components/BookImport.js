import React, { useState } from 'react';
import { CiImport } from "react-icons/ci";

const BookImport = ({ onImported }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleImport = async () => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('http://localhost:7000/books/import', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setResult(data);
    onImported();
  };

  return (
    <div className="mb-4">
      <h2><CiImport/> Import CSV</h2>
      <input type="file" className="form-control mb-2" onChange={e => setFile(e.target.files[0])} />
      <button className="btn btn-primary" onClick={handleImport}>Upload</button>
      {result && (
        <div className="mt-3">
          <p><strong>Books Added:</strong> {result.addedBooksCount}</p>
          {result.errorRows.length > 0 && (
            <div>
              <strong>Errors:</strong>
              <ul>
                {result.errorRows.map((e, idx) => <li key={idx}>{e}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookImport;
