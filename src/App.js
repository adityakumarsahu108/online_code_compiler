import { useState } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";
import Axios from "axios";
import Navbar from "./components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faDownload } from "@fortawesome/free-solid-svg-icons";

function App() {
  // State variables
  const [userCode, setUserCode] = useState("");
  const [userLang, setUserLang] = useState("cpp");
  const [userTheme, setUserTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(20);
  const [userInput, setUserInput] = useState("");
  const [userOutput, setUserOutput] = useState("");

  // Function to call the compile endpoint
  const compile = () => {
    Axios.post(`http://localhost:8000/compile`, {
      code: userCode,
      language: userLang,
      input: userInput,
    })
      .then((res) => {
        console.log("Compilation response:", res.data); // Log the response data
        setUserOutput(res.data.programOutput || "No output");
      })
      .catch((error) => {
        setUserOutput("Error during compilation");
        console.error("Error during compilation:", error);
      });
  };

  // Function to clear the output screen
  const clearOutput = () => {
    setUserOutput("");
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    if (file.type !== "text/plain") {
      console.error("Please upload a text file (.txt)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;

      setUserCode(content);
    };
    reader.readAsText(file);
  };

  // Function to handle file download
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([userCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code.txt`; // Download with the selected language extension
    document.body.appendChild(element); // Required for this to work in Firefox
    element.click();
  };

  return (
    <div className="App">
      <Navbar
        userLang={userLang}
        setUserLang={setUserLang}
        userTheme={userTheme}
        setUserTheme={setUserTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      <div className="main">
        <div className="left-container">
          <Editor
            options={{
              fontSize: fontSize,
            }}
            height="calc(100vh - 30px)"
            width="100%"
            theme={userTheme}
            language={userLang}
            defaultLanguage="cpp"
            defaultValue="// Enter your code here"
            value={userCode}
            onChange={(value) => setUserCode(value)}
          />
          <button className="run-btn" onClick={compile}>
            Run
          </button>
        </div>

        <div className="right-container">
          <div className="toolbar">
            <label
              htmlFor="fileInput"
              className="fileButton"
              onChange={handleUpload}
            >
              <FontAwesomeIcon icon={faUpload} /> Upload a .txt file
            </label>
            <input id="fileInput" type="file" onChange={handleUpload} />
            <button onClick={handleDownload}>
              <FontAwesomeIcon icon={faDownload} /> Download
            </button>
          </div>
          <h4>Input:</h4>
          <div className="input-box">
            <textarea
              id="code-inp"
              onChange={(e) => setUserInput(e.target.value)}
            ></textarea>
          </div>

          <h4>Output:</h4>
          <div className="output-box">
            <pre>{userOutput}</pre>
            <button onClick={clearOutput} className="clear-btn">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
