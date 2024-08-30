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
      // Corrected metric names
      const metrics = 'page_daily_follows_unique,page_impressions_unique,page_post_engagements,page_actions_post_reactions_like_total';
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
           
            if (insight.name === 'page_daily_follows_unique') {
              updatedInsights.page_fans = insight.values[0]?.value || 0;
            } else if (insight.name === 'page_post_engagements') {
              updatedInsights.post_engaged_users = insight.values[0]?.value || 0;
            } else if (insight.name === 'page_impressions_unique') {
              updatedInsights.page_impressions = insight.values[0]?.value || 0;
            } else if (insight.name === 'page_actions_post_reactions_like_total') {
               updatedInsights.page_reactions = insight.values[0]?.value;

            }});
  console.log(data);
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
