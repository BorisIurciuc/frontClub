import React from 'react';
import { useDispatch } from 'react-redux';
import { INews } from './newsActions';
import './newsItem.module.css';

interface NewsItemProps {
  article: INews; // Expecting a news article of type INews
  onUpdate: (article: INews) => void; // Function prop for updating news
  onDelete: (id: number) => void; // Function prop for deleting news
}

const NewsItem: React.FC<NewsItemProps> = ({ article, onUpdate, onDelete }) => {
  const handleUpdate = () => {
    const updatedNews: INews = {
      ...article,
      title: `${article.title} (Updated)`, // Example update
      description: `${article.description} (Updated)`,
      summary: `${article.summary} (Updated)`,
    };
    onUpdate(updatedNews); // Call the passed update function
  };

  return (
    <div className="news-item">
      <h2>{article.title}</h2>
      <p>{article.summary}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        Read More
      </a>
      <button onClick={handleUpdate}>Update News</button>
      <button onClick={() => onDelete(article.id)}>Delete News</button> {/* Call the passed delete function */}
    </div>
  );
};

export default NewsItem;
