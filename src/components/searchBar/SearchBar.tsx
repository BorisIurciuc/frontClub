import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import styles from "./searchBar.module.css";

interface IActivity {
    id: number;
    title: string;
    image: string;
    startDate: string;
    description: string;
    address: string;
    authorId: number;
}

interface SearchBarProps {
    onFiltered: (filteredActivities: IActivity[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onFiltered }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
    fetchActivities();
    }, []);

const fetchActivities = async () => {
    try {
    const response = await axios.get("api/activity");
    setActivities(response.data);
        onFiltered(response.data); 
    } catch (error) {
    console.error("Error fetching activities:", error);
    setError("Failed to load activity. Try again later.");
    } finally {
    setLoading(false);
    }
};

const filterActivities = useCallback(() => {
    const filtered = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    onFiltered(filtered);
}, [searchTerm, activities, onFiltered]);

useEffect(() => {
    filterActivities();
}, [searchTerm, filterActivities]);

return (
    <div className={styles.searchContainer}>
    {loading ? (
        <div>loading...</div>
    ) : error ? (
        <div className={styles.error}>{error}</div>
    ) : (
        <input
        type="text"
        placeholder="search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
        />
    )}
    </div>
    );
};

export default SearchBar;
