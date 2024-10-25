import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { deleteNews, fetchNews, updateNews } from './newsActions';
import NewsItem from './NewsItem';
import './newsList.module.css';
import { INews } from './newsActions';

const NewsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { news, isLoading, error } = useSelector((state: RootState) => state.news);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  // Remove handleDelete and handleUpdate from here since they're being handled in NewsItem

  if (isLoading) {
    return <p>Loading news...</p>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>; // Display actual error message
  }

  return (
    <div className="news-list">
      <h1>News</h1>
      <ul>
        {news.map((article) => (
          <li key={article.id}>
            <NewsItem 
              article={article} 
              onUpdate={updateNews}  // Pass the update function
              onDelete={deleteNews}  // Pass the delete function
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;
