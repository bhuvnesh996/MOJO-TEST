import React, { useState } from 'react';
import FacebookLogin from './components/FacebookLogin';
import PageSelector from './components/PageSelector';
import PageInsights from './components/PageInsights';
import Navbar from './components/Navbar'; // New Navbar component
import './App.css'; 

const App = () => {
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [pageAccessToken, setPageAccessToken] = useState(null);

  const handleLogin = (token) => {
    setUserAccessToken(token);
    console.log('User Access Token:', token);
  };

  const handleSelectPage = async (pageId) => {
    setPageAccessToken(null);
    setSelectedPage(null);

    if (!userAccessToken) {
      console.error('User access token is missing');
      return;
    }

    setSelectedPage(pageId);
    console.log('Selected Page ID:', pageId);

    try {
      const response = await fetch(
        `https://graph.facebook.com/v17.0/${pageId}?fields=access_token&access_token=${userAccessToken}`
      );
      const data = await response.json();

      if (data.error) {
        console.error('Error fetching page access token:', data.error);
        return;
      }

      if (data.access_token) {
        setPageAccessToken(data.access_token);
        console.log('Page Access Token:', data.access_token);
      } else {
        console.error('No page access token received');
      }
    } catch (error) {
      console.error('Error fetching page access token:', error);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

     

      <div className="content">
        <FacebookLogin onLogin={handleLogin} />
        {userAccessToken && (
          <>
            <PageSelector accessToken={userAccessToken} onSelectPage={handleSelectPage} />
            {selectedPage && pageAccessToken && (
              <PageInsights
                pageId={selectedPage}
                pageAccessToken={pageAccessToken}
                since="2024-08-01"
                until="2024-10-29"
              />
            )}
          </>
        )}
      </div>

      
    </div>
  );
};

export default App;
