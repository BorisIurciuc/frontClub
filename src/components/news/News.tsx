import React, { useEffect, useState } from 'react';
import styles from './news.module.css';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string; 
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('Failed to fetch news');
      })
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>School internal News</h1>
      {news.length > 0 ? (
        <ul>
          {news.map((item) => (
            <li key={item.id} className={styles.newsItem}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <p>
                Created by: {item.createdBy} 
                <br />Created on {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No news available</p>
      )}
    </div>
  );
}
