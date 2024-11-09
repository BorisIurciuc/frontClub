import React from 'react';
import { INews } from './newsActions';

interface NewsItemProps {
  news: INews;
  onDelete: (id: number) => void;
  onUpdate: (updatedNews: INews) => void;
  onGetNews: (id: number) => Promise<void>; // Add onGetNews prop
}

const NewsItem: React.FC<NewsItemProps> = ({ news, onDelete, onUpdate, onGetNews }) => {
  const handleGetDetails = () => {
    onGetNews(news.id); // Call onGetNews when needed
  };

  return (
    <div>
      <h3>{news.title}</h3>
      <p>{news.description}</p>
      <button onClick={() => onDelete(news.id)}>Delete</button>
      <button onClick={() => onUpdate(news)}>Update</button>
      <button onClick={handleGetDetails}>View Details</button> {/* Use onGetNews */}
    </div>
  );
};

export default NewsItem;
