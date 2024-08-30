import React, { useState, useEffect } from 'react';

const PageSelector = ({ accessToken, onSelectPage }) => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (accessToken) {
      window.FB.api('/me/accounts', { access_token: accessToken }, (response) => {
        if (response && response.data) {
          setPages(response.data);
        } else {
          console.error('Error fetching pages:', response.error);
        }
      });
    }
  }, [accessToken]);

  return (
    <select onChange={(e) => onSelectPage(e.target.value)}>
      <option value="">Select a Page</option>
      {pages.map((page) => (
        <option key={page.id} value={page.id}>
          {page.name}
        </option>
      ))}
    </select>
  );
};

export default PageSelector;
