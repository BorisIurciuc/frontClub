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
        <form onSubmit={handleFormSubmit} className="">
            <div>
                <label htmlFor="content" className="">Content:</label>
                <textarea
                    id="content"
                    name="content"
                    value={inputData.content}
                    onChange={handleInputChange}
                    className=""
                    required
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className=""
            >
                Submit
            </button>
        </form>
    );
};

export default ResponseReviewAdd;