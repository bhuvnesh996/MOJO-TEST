import React, { useState, useEffect } from 'react';

const FacebookLogin = ({ onLogin }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1153715299041042',
        cookie: true,
        xfbml: true,
        version: 'v20.0',
      });

      window.FB.getLoginStatus((response) => handleLoginStatus(response));
    };

    (function (d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const handleLoginStatus = (response) => {
    if (response.status === 'connected') {
      setIsLoggedIn(true);
      fetchUserData(response.authResponse.accessToken);
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setError(null);
    }
  };

  const fetchUserData = (accessToken) => {
    window.FB.api('/me', { fields: 'name,picture', access_token: accessToken }, (response) => {
      if (response && !response.error) {
        setUser(response);
        if (onLogin) onLogin(accessToken, response);
      } else {
        setError('Failed to fetch user data');
        setIsLoggedIn(false);
        setUser(null);
      }
    });
  };

  const handleLogin = () => {
    window.FB.login((response) => {
      if (response.authResponse) {
        handleLoginStatus(response);
      } else {
        setError('Login failed or user canceled the login');
        setIsLoggedIn(false);
        setUser(null);
      }
    }, {
      scope: 'public_profile,pages_show_list,pages_read_engagement,pages_read_user_content,pages_manage_engagement,pages_manage_posts,pages_read_user_content',
      auth_type: 'reauthorize', 
    });
  };

  return (
    <div className="homepage">
    

      <div className="facebook-login-section">
        {!isLoggedIn && <button onClick={handleLogin} className="facebook-button">Login with Facebook</button>}
        {isLoggedIn && user && (
          <div className="user-info">
            <h2>Welcome, {user.name}</h2>
            <img src={user.picture.data.url} alt={user.name} />
          </div>
        )}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default FacebookLogin;
