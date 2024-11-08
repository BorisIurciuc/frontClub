import React, { useEffect, useState } from "react";

interface Activity {
  id: number;
  title: string;
  description: string;
  address: string;
  startDate: string;
  image: string;
  users: { id: number; username: string }[]; // Array of registered users
}

const ManageActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch activities on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/activity"); 
        if (!response.ok) throw new Error("Failed to fetch activities");
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError("Could not fetch activities.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // Delete activity
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        const response = await fetch(`/api/activity/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete activity");
        setActivities((prevActivities) => prevActivities.filter((activity) => activity.id !== id));
      } catch (err) {
        console.error(err);
        setError("Could not delete activity.");
      }
    }
  };

  // Update activity
  const handleUpdate = async (updatedActivity: Activity) => {
    try {
      const response = await fetch(`/api/activity/update/${updatedActivity.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedActivity),
      });
      if (!response.ok) throw new Error("Failed to update activity");

      // Update the activity in the local state
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.id === updatedActivity.id ? updatedActivity : activity
        )
      );
    } catch (err) {
      console.error(err);
      setError("Could not update activity.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Manage Activities</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
            <p>Address: {activity.address}</p>
            <p>Start Date: {new Date(activity.startDate).toLocaleDateString()}</p>
            <p>Participants: {activity.users.length}</p> {/* Display registered users count */}
            <button onClick={() => handleDelete(activity.id)}>Delete</button>
            <button onClick={() => handleUpdate({ ...activity, title: prompt("New title", activity.title) || activity.title })}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageActivities;
