import React, { useState, useEffect } from 'react';

const UserPages = ({ accessToken, onSelectPage }) => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`)
      .then(response => response.json())
      .then(data => setPages(data.data));
  }, [accessToken]);

  return (
    <select onChange={(e) => onSelectPage(e.target.value)}>
      <option value="">Select a Page</option>
      {pages.map(page => (
        <option key={page.id} value={page.id}>{page.name}</option>
      ))}
    </select>
  );
}

export default UserPages;
