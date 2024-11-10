import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNews,
  deleteNews,
  fetchNews,
  getNewsById,
  INews,
  updateNews,
} from "./newsActions";
import NewsItem from "./NewsItem";
import styles from './newsList.module.css';
import { AppDispatch, RootState } from "../../../app/store";
import { format } from "date-fns";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Helper function to check if token is expired
const checkTokenExpiry = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? decoded.exp < currentTime : true;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

// Refresh token if expired and update localStorage
const refreshTokenIfNeeded = async (token: string, refreshToken: string): Promise<string | null> => {
  if (!checkTokenExpiry(token)) return token; // Return existing token if still valid

  try {
    const response = await axios.post("/api/auth/refresh", { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem("token", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

const NewsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { news, isLoading, error } = useSelector(
    (state: RootState) => state.news
  );
  const [newNews, setNewNews] = useState<Partial<INews>>({
    title: "",
    description: "",
  });
  const [selectedNews, setSelectedNews] = useState<INews | null>(null);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  // Handle news creation
  const handleCreateNews = () => {
    if (!newNews.title || !newNews.description) {
      alert("Title and description are required.");
      return;
    }

    dispatch(createNews(newNews))
      .unwrap()
      .then(() => {
        setNewNews({ title: "", description: "" });
      })
      .catch((error) => {
        console.error("Failed to create news:", error);
        alert("Failed to create news. Please try again.");
      });
  };

  // Handle news update
  const handleUpdate = async (updatedNews: INews) => {
    if (!updatedNews.id) {
      console.error("News ID is required for updating");
      alert("News ID is required for updating");
      return;
    }

    // Get token and refresh if needed
    let token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token || !refreshToken) {
      console.error("Token or refresh token is missing.");
      alert("Please log in again.");
      return;
    }

    token = await refreshTokenIfNeeded(token, refreshToken);
    if (!token) {
      console.error("Failed to refresh token.");
      alert("Session expired. Please log in again.");
      return;
    }

    dispatch(updateNews(updatedNews))
      .unwrap()
      .then((result) => {
        console.log("Updated news:", result);
      })
      .catch((error) => {
        console.error("Failed to update news:", error);
        alert("Failed to update news. Please try again.");
      });
  };

  // Handle news deletion
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      dispatch(deleteNews(id))
        .unwrap()
        .then(() => {
          console.log(`News with ID ${id} deleted successfully.`);
        })
        .catch((error) => {
          console.error("Failed to delete news:", error);
          alert("Failed to delete news. Please try again.");
        });
    }
  };

  // Fetch news by ID
  const handleGetNews = async (id: number) => {
    try {
      const article = await dispatch(getNewsById(id)).unwrap();
      setSelectedNews(article);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  // Function to format date with date-fns
  const formatDate = (date: string | number | Date) => {
    const formattedDate = new Date(date); // Convert to Date object
    if (isNaN(formattedDate.getTime())) {
      return "Invalid Date"; // Handle invalid date
    }
    // Custom format "dd.MM.yyyy"
    return format(formattedDate, "dd.MM.yyyy");
  };

  return (
    <div className={styles.newsListContainer}>
      <h1>News List</h1>
      <div className={styles.newsForm}>
        <input
          type="text"
          placeholder="News Title"
          value={newNews.title || ""}
          onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
        />
        <textarea
          placeholder="News Description"
          value={newNews.description || ""}
          onChange={(e) =>
            setNewNews({ ...newNews, description: e.target.value })
          }
        />
        <button onClick={handleCreateNews}>Create News</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        news.map((newsItem) => (
          <NewsItem
            key={newsItem.id}
            news={newsItem}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onGetNews={handleGetNews}
          />
        ))
      )}

      {selectedNews && (
        <div className={styles.selectedNews}>
          <h2>Selected News</h2>
          <p>{selectedNews.title}</p>
          <p>{selectedNews.description}</p>
          <p>Created_by: {selectedNews.created_by}</p>
          {/* Use the formatDate function to format the createdAt date */}
          <p>Created_at: {formatDate(selectedNews.createdAt)}</p>
        </div>
      )}
    </div>
  );
};

export default NewsList;
