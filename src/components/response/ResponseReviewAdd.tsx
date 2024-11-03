import React from "react";

interface ResponseRevFormData {
    content: string
}

interface ResponseRevAddProps {
    inputData: ResponseRevFormData
    isLoading: boolean
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleFormSubmit: (e: React.FormEvent) => void
}

const ResponseReviewAdd: React.FC<ResponseRevAddProps> = ({ inputData, isLoading, handleInputChange, handleFormSubmit }) => {
    return (
        <form onSubmit={handleFormSubmit} className="mb-6 space-y-4">
            <div>
                <label htmlFor="content" className="block mb-1">Content:</label>
                <textarea
                    id="content"
                    name="content"
                    value={inputData.content}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Submit
            </button>
        </form>
    );
};

export default ResponseReviewAdd;