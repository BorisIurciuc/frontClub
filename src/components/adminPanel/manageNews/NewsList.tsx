import { useEffect, useState } from "react";
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

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddNews, setShowAddNews] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    setLoading(true);
    fetch("/api/news", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Failed to fetch news");
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
        setError("Failed to load news. Please try again later.");
        setLoading(false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNews = () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in all fields.");
      return;
    }

    fetch("/api/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to add news");
        return response.json();
      })
      .then((newNews) => {
        setNews((prev) => [newNews, ...prev]);
        setShowAddNews(false);
        setFormData({ title: "", description: "" });
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to add news. Please try again.");
      });
  };

  const handleDeleteNews = (id: number) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      fetch(`/api/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to delete news");
          setNews((prev) => prev.filter((item) => item.id !== id));
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to delete news. Please try again.");
        });
    }
  };

  return (
    <div className={styles.container}>
      <h1>Admin News Management</h1>

      <button onClick={() => setShowAddNews((prev) => !prev)}>
        {showAddNews ? "Cancel" : "Add News"}
      </button>

      {showAddNews && (
        <div className={styles.newsForm}>
          <h2>Add News</h2>
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
          <button onClick={handleAddNews}>Create News</button>
        </div>
      )}

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
              <div className={styles.newsActions}>
                <button onClick={() => handleDeleteNews(item.id)}>Delete</button>
              </div>
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
