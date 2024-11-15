import { useEffect, useState } from 'react';
import styles from './news.module.css';
import ScrollToTopButton from '../scrollToTopButton/ScrollToTopButton';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/news', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Failed to fetch news');
      })
      .then((data) => {
        setNews(
          data.sort((a: NewsItem, b: NewsItem) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1>School Internal News</h1>
      {loading ? (
        <div className={styles.loader}></div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : news.length > 0 ? (
        <ul className={styles.newsList}>
          {news.map((item) => (
            <li key={item.id} className={styles.newsItem}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <p className={styles.newsMeta}>
                Created by: <strong>{item.createdBy}</strong>
                <br />
                Created on: {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noNews}>No news available</p>
      )}
      <ScrollToTopButton />
    </div>
  );
}
