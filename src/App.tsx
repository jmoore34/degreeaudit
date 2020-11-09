import React, { useState } from "react";
import './App.css';
import { FileUploader } from "./components/uploader";
import axios from 'axios';

const App = () => {
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile]: any = useState(null);

  const submitForm = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", selectedFile)

    axios
      .post("flowcharts", formData)
      .then(res => {
        alert("File Upload Success");
      })
      .catch(err => alert("File Upload Error"));
  }

  return (
    <div className="App">
      <form>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FileUploader
          onFileSelect={(file: any) => setSelectedFile(file)}
        />

        <button onClick={submitForm}>Submit</button>
      </form>
    </div>
  );
}

export default App;
