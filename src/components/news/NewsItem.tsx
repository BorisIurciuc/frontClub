import React from 'react';
import { INews } from './newsActions'; // Импортируем интерфейс для новости
import './newsItem.module.css'; // Стили для компонента

interface NewsItemProps {
  article: INews;
}

const NewsItem: React.FC<NewsItemProps> = ({ article }) => {
  return (
    <li className="news-item">
      <h2>{article.title}</h2>
      <p>{article.summary}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        Читать далее
      </a>
    </li>
  );
};

export default NewsItem;
