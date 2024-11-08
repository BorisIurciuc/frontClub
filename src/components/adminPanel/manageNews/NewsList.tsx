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
import "./newsList.module.css";
import { AppDispatch, RootState } from "../../../app/store";
import { format } from "date-fns";  // Import date-fns for custom date formatting

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

  const handleCreateNews = () => {
    if (!newNews.title || !newNews.description) {
      alert("Title and description are required.");
      return;
    }

    dispatch(createNews(newNews))
      .unwrap()
      .then(() => {
        setNewNews({ title: "", description: "" }); // Reset fields after successful creation
      })
      .catch((error) => {
        console.error("Failed to create news:", error);
        alert("Failed to create news. Please try again.");
      });
  };

  const handleUpdate = (updatedNews: INews) => {
    if (!updatedNews.id) {
      console.error("News ID is required for updating");
      alert("News ID is required for updating");
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

  const handleGetNews = async (id: number) => {
    try {
      const article = await dispatch(getNewsById(id)).unwrap();
      setSelectedNews(article); // Update selectedNews when fetched
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
    <div>
      <h1>News List</h1>
      <div>
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

      {/* Display the selected news details if available */}
      {selectedNews && (
        <div>
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

