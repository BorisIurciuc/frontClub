import axios, { AxiosError } from "axios";

export const handleParticipate = async (activityId: number): Promise<void> => {
    try {
        const response = await axios.put(
            `/api/activity/${activityId}/add-user`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        if (response.status === 200) {
            alert("You have successfully registered for the event!");
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = axiosError.response?.data || "Failed to register for the event. Please try again.";
        console.error("Error registering for the event:", errorMessage);
        alert(errorMessage);
    }
};

export const handleRevokeParticipation = async (activityId: number): Promise<void> => {
    try {
        const response = await axios.delete(
            `/api/activity/${activityId}/remove-user`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        if (response.status === 200) {
            alert("You have successfully revoked your participation!");
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = axiosError.response?.data || "Failed to revoke your participation. Please try again.";
        console.error("Error revoking participation:", errorMessage);
        alert(errorMessage);
    }
};
