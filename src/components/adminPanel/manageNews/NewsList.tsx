import React, { useEffect, useState } from "react";
import styles from "./newsList.module.css";
import ScrollToTopButton from "../../scrollToTopButton/ScrollToTopButton";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

interface NewsFormData {
  title: string;
  description: string;
}

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddNews, setShowAddNews] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>({ title: "", description: "" });
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/news", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data: NewsItem[] = await response.json();
      setNews(
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load news. Please try again later.");
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateNews = async () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to create news");
      }
      const newNews: NewsItem = await response.json();
      setNews((prev) => [newNews, ...prev]);
      setShowAddNews(false);
      setFormData({ title: "", description: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to create news. Please try again.");
    }
  };

  const handleEditNews = (newsItem: NewsItem) => {
    setEditingNewsId(newsItem.id);
    setFormData({ title: newsItem.title, description: newsItem.description });
  };

  const handleUpdateNews = async () => {
    if (!editingNewsId) return;
    try {
      const response = await fetch(`/api/news/${editingNewsId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update news");
      }
      const updatedNews: NewsItem = await response.json();
      setNews((prev) =>
        prev.map((item) => (item.id === editingNewsId ? updatedNews : item))
      );
      setEditingNewsId(null);
      setFormData({ title: "", description: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to update news. Please try again.");
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete news");
      }
      setNews((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete news. Please try again.");
    }
  };

  const handleViewDetails = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
  };

  const handleCloseDetails = () => {
    setSelectedNews(null);
  };

  return (
    <div className={styles.container}>
      <h1>News List</h1>

      <button onClick={() => setShowAddNews((prev) => !prev)}>
        {showAddNews ? "Cancel" : "Add News"}
      </button>

      {showAddNews && (
        <div className={styles.newsForm}>
          <h3>Add News</h3>
          <input
            type="text"
            name="title"
            placeholder="News Title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="News Description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <button onClick={handleCreateNews}>Create News</button>
        </div>
      )}

      {editingNewsId && (
        <div className={styles.newsForm}>
          <h3>Edit News</h3>
          <input
            type="text"
            name="title"
            placeholder="News Title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="News Description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <button onClick={handleUpdateNews}>Update News</button>
        </div>
      )}

      {loading ? (
        <div className={styles.loader}>Loading...</div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
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
              <div className={styles.newsActions}>
                <button onClick={() => handleViewDetails(item)}>View Details</button>
                <button onClick={() => handleEditNews(item)}>Edit</button>
                <button onClick={() => handleDeleteNews(item.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedNews && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>News Details: {selectedNews.title}</h2>
            <p>{selectedNews.description}</p>
            <p>
              <strong>Created By:</strong> {selectedNews.createdBy}
            </p>
            <p>
              <strong>Created On:</strong> {new Date(selectedNews.createdAt).toLocaleDateString()}
            </p>
            <button onClick={handleCloseDetails}>Close</button>
          </div>
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
};

export default NewsList;
