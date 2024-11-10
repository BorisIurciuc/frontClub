import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNews, deleteNews, fetchNews, INews, updateNews, getNewsById } from "./newsActions";
import NewsItem from "./NewsItem";
import styles from './newsList.module.css';
import { AppDispatch, RootState } from "../../../app/store";
import { format } from "date-fns";
import UpdateNews from "./UpdateNews";

interface NewsFormData {
  title: string;
  description: string;
}

const NewsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { news, isLoading, error } = useSelector((state: RootState) => state.news);
  const [inputData, setInputData] = useState<NewsFormData>({ title: "", description: "" });
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [selectedNews, setSelectedNews] = useState<INews | null>(null);
  const [showAddNews, setShowAddNews] = useState(false);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateNews = async () => {
    if (!inputData.title || !inputData.description) {
      alert("Please fill in all fields");
      return;
    }
    try {
      await dispatch(createNews(inputData)).unwrap();
      setInputData({ title: "", description: "" });
      setShowAddNews(false);
    } catch (error) {
      console.error("Failed to add news:", error);
      alert("Failed to add news. Please try again.");
    }
  };

  const handleEditClick = (newsItem: INews) => {
    setEditingNewsId(newsItem.id);
    setInputData({ title: newsItem.title, description: newsItem.description });
  };

  const handleUpdateNews = async () => {
    if (!editingNewsId) return;
    
    try {
      const updatedNews = {
        id: editingNewsId,
        title: inputData.title,
        description: inputData.description
      };
      await dispatch(updateNews(updatedNews)).unwrap();
      setEditingNewsId(null);
      setInputData({ title: "", description: "" });
    } catch (error) {
      console.error("Failed to update news:", error);
      alert("Failed to update news. Please try again.");
    }
  };

  const handleDeleteNews = async (newsId: number) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await dispatch(deleteNews(newsId)).unwrap();
      } catch (error) {
        console.error("Failed to delete news:", error);
        alert("Failed to delete news. Please try again.");
      }
    }
  };

  const handleGetNewsById = async (id: number) => {
    try {
      const newsDetails = await dispatch(getNewsById(id)).unwrap();
      setSelectedNews(newsDetails);
    } catch (error) {
      console.error("Failed to get news details:", error);
      alert("Failed to get news details.");
    }
  };

  const formatDate = (date: string | number | Date) => {
    const formattedDate = new Date(date);
    return isNaN(formattedDate.getTime()) ? "Invalid date" : format(formattedDate, "dd.MM.yyyy");
  };

  return (
    <div className={styles.newsListContainer}>
      <h1>News List</h1>

      <button onClick={() => setShowAddNews((prev) => !prev)}>
        {showAddNews ? 'Cancel' : 'Add News'}
      </button>

      {showAddNews && (
        <div className={styles.newsForm}>
          <h3>Add News</h3>
          <input
            type="text"
            name="title"
            placeholder="News Title"
            value={inputData.title}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="News Description"
            value={inputData.description}
            onChange={handleInputChange}
          />
          <button onClick={handleCreateNews}>Create News</button>
        </div>
      )}

      {editingNewsId && (
        <UpdateNews
          inputData={inputData}
          handleInputChange={handleInputChange}
          handleUpdateSubmit={handleUpdateNews}
          handleCancelUpdate={() => {
            setEditingNewsId(null);
            setInputData({ title: "", description: "" });
          }}
        />
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        news.map((newsItem) => (
          <NewsItem
            key={newsItem.id}
            news={newsItem}
            onEdit={() => handleEditClick(newsItem)}
            onDelete={() => handleDeleteNews(newsItem.id)}
            onGetNews={handleGetNewsById}
            formatDate={formatDate}
          />
        ))
      )}

      {selectedNews && (
        <div className={styles.selectedNews}>
          <h2>News Details: {selectedNews.title}</h2>
          <p>{selectedNews.description}</p>
          <p>Author: {selectedNews.created_by}</p>
          <p>Created: {formatDate(selectedNews.createdAt)}</p>
          <button onClick={() => setSelectedNews(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default NewsList;
