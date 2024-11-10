import React from 'react';
import { INews } from './newsActions';
import styles from './newsItem.module.css';

interface NewsItemProps {
  news: INews;
  onDelete: (id: number) => void;
  onEdit: (news: INews) => void;
  onGetNews: (id: number) => Promise<void>;
  formatDate?: (date: string | number | Date) => string;
}

const NewsItem: React.FC<NewsItemProps> = ({ 
  news, 
  onDelete, 
  onEdit, 
  onGetNews, 
  formatDate 
}) => {
  return (
    <div className={styles.newsItem}>
      <h3 className={styles.newsTitle}>{news.title}</h3>
      <p className={styles.newsDescription}>{news.description}</p>
      {formatDate && (
        <p className={styles.newsDate}>
          Created: {formatDate(news.createdAt)}
        </p>
      )}
      <p className={styles.newsAuthor}>Author: {news.created_by}</p>
      <div className={styles.newsActions}>
        <button 
          onClick={() => onEdit(news)}
          className={styles.editButton}
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(news.id)}
          className={styles.deleteButton}
        >
          Delete
        </button>
        <button 
          onClick={() => onGetNews(news.id)}
          className={styles.detailsButton}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default NewsItem;