import { useState } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";
import Axios from "axios";
import Navbar from "./components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faDownload } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/compat/app"; // Import the compat version for backward compatibility
import "firebase/compat/storage"; // Import the compat version for backward compatibility

// Initialize Firebase with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOj0X7Pt4XJBU2J1ePQfg6UMajsRJl-6E",
  authDomain: "onlinecodecompiler-2217e.firebaseapp.com",
  projectId: "onlinecodecompiler-2217e",
  storageBucket: "onlinecodecompiler-2217e.appspot.com",
  messagingSenderId: "284387850271",
  appId: "1:284387850271:web:0bfa5b134247276a7b7d2a"
};

firebase.initializeApp(firebaseConfig);

function App() {
  // State variables
  const [userCode, setUserCode] = useState("");
  const [userLang, setUserLang] = useState("cpp");
  const [userTheme, setUserTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(15);
  const [userInput, setUserInput] = useState("");
  const [userOutput, setUserOutput] = useState("");
  const [compiling, setCompiling] = useState(false);

  // Function to call the compile endpoint
  const compile = () => {
    setCompiling(true); // Start compilation, set compiling to true
    Axios.post(`http://localhost:10000/compile`, {
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
      })
      .finally(() => {
        setCompiling(false); // Compilation finished, set compiling to false
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
    const storageRef = firebase.storage().ref();
    const timestamp = new Date().getTime(); // Get current timestamp
    const fileRef = storageRef.child(`code_${timestamp}.txt`); // Dynamically generate filename
  
    const file = new Blob([userCode], { type: "text/plain" });
  
    // Upload the file to Firebase Storage
    fileRef.put(file).then(() => {
      console.log("File uploaded successfully");
  
      // download to local storage
      
        const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = 'code.txt';
        document.body.appendChild(element);
        element.click();
        
      
    }).catch((error) => {
      console.error("Error uploading file:", error);
    });
  };

  return (
    <>
      <Navbar
        userLang={userLang}
        setUserLang={setUserLang}
        userTheme={userTheme}
        setUserTheme={setUserTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
    <div className="App">

      <div className="main">
        <div className="left-container">
          <div className="editor-container">
            <Editor
              options={{
              fontSize: fontSize,
              }}
              height="calc(90vh - 30px)" // Adjusted height
              width="90%" // Adjusted width
              theme={userTheme}
              language={userLang}
              defaultLanguage="cpp"
              defaultValue="// Enter your code here"
              value={userCode}
              onChange={(value) => setUserCode(value)}
          />
        </div>
          <button className="run-btn" onClick={compile} disabled={compiling}>
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
            {/* Display loader animation while compiling */}
            {compiling && (
              <div className="loader">
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
              </div>
            )}
            {!compiling && <pre>{userOutput}</pre>}
            <button onClick={clearOutput} className="clear-btn">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;