import React from "react";
import './css/upload.css';

const Upload = () => {

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('images', event.target.img.files[0]);
        formData.append('caption', event.target.cap.value);
    
        const requestOptions = {
            method: 'POST',
            body: formData,
        };
    
        try {
            const response = await fetch('/api/post', requestOptions);
            if (response.ok) {
                alert("Post successful!");
            } else {
                throw new Error('Failed to post');
            }
        } catch (error) {
            console.error('Post failed:', error);
        }
    };

    return (
        <body>
          <div className="upload-container">
            <h2>Upload Your OOTD</h2>
            <form onSubmit={handleSubmit}>
              <label for="img">Choose Image:</label>
              <input type="file" id="img" name="img"/>

              <label for="cap">Caption:</label>
              <input type="text" id="cap" name="cap"/>

              <button type="submit">Upload</button>
            </form>
          </div>
        </body>
      );
}

export default Upload;