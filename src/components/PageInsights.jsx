import React, { useState, useEffect } from 'react';
import './PageInsights.css'; 

const PageInsights = ({ pageId, pageAccessToken, since, until }) => {
  const [insights, setInsights] = useState({
    page_fans: 0,
    post_engaged_users: 0,
    page_impressions: 0,
    page_reactions: 0
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pageId && pageAccessToken) {
      const metrics = 'page_fans,page_impressions,post_engaged_users,page_actions_post_reactions_like_total,page_actions_post_reactions_love_total,page_actions_post_reactions_wow_total,page_actions_post_reactions_haha_total,page_actions_post_reactions_sorry_total,page_actions_post_reactions_anger_total';
      const url = `https://graph.facebook.com/v20.0/${pageId}/insights?metric=${metrics}&since=${since}&until=${until}&period=total_over_range&access_token=${pageAccessToken}`;

      console.log('Starting API request to URL:', url);

      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log('Full API Response:', data);
          if (data.error) {
            console.error('API Error:', data.error);
            throw new Error(data.error.message);
          }
          if (!data.data || data.data.length === 0) {
            throw new Error('No data returned for the requested metrics.');
          }

          const updatedInsights = {
            page_fans: 0,
            post_engaged_users: 0,
            page_impressions: 0,
            page_reactions: 0
          };

          data.data.forEach(insight => {
            if (insight.name.startsWith('page_actions_post_reactions_')) {
              updatedInsights.page_reactions += insight.values[0]?.value || 0;
            } else {
              updatedInsights[insight.name] = insight.values[0]?.value || 0;
            }
          });

          setInsights(updatedInsights);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error during fetch operation:', error);
          setError(error.message);
          setLoading(false);
        });
    } else {
      console.warn('Page ID or Access Token missing');
      setLoading(false);
    }
  }, [pageId, pageAccessToken, since, until]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderCard = (title, value) => (
    <div className="card" key={title}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );

  const metricsMap = {
    page_fans: 'Total Followers / Fans',
    post_engaged_users: 'Total Post Engagements',
    page_impressions: 'Total Impressions',
    page_reactions: 'Total Reactions'
  };

  return (
    <div className="insights-cards-container">
      {Object.keys(metricsMap).map(metricKey =>
        renderCard(
          metricsMap[metricKey],
          insights[metricKey]
        )
      )}
    </div>
  );
};

export default PageInsights;
