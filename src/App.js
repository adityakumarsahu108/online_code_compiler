import { useState } from 'react';
import './App.css';
import Editor from "@monaco-editor/react";
import Navbar from './components/Navbar';
import Axios from 'axios';


function App() {

  // State variable to set users source code 
  const [userCode, setUserCode] = useState(``);

  // State variable to set editors default language 
  const [userLang, setUserLang] = useState("python");

  // State variable to set editors default theme 
  const [userTheme, setUserTheme] = useState("vs-dark");

  // State variable to set editors default font size 
  const [fontSize, setFontSize] = useState(20);

  // State variable to set users input 
  const [userInput, setUserInput] = useState("");

  // State variable to set users output 
  const [userOutput, setUserOutput] = useState("");

  const options = {
    fontSize: fontSize
  }

  // Function to call the compile endpoint 
  const compile = () => {
    Axios.post(`http://localhost:8000/compile`, {
      code: userCode,
      language: userLang,
      input: userInput
    })
    .then((res) => {
      console.log('Compilation response:', res.data); // Log the response data
      setUserOutput(res.data.programOutput || 'No output');
    })
    .catch((error) => {
      setUserOutput('Error during compilation');
      console.error('Error during compilation:', error);
    });
  };
  // Function to clear the output screen 
  function clearOutput() {
    setUserOutput("");
  }

  return (
    <div className="App">
      <Navbar
        userLang={userLang} setUserLang={setUserLang}
        userTheme={userTheme} setUserTheme={setUserTheme}
        fontSize={fontSize} setFontSize={setFontSize}
      />
      <div className="main">
        <div className="left-container">
          <Editor
            options={options}
            height="calc(100vh - 30px)"
            width="100%"
            theme={userTheme}
            language={userLang}
            defaultLanguage="python"
            defaultValue="# Enter your code here"
            onChange={(value) => { setUserCode(value) }}
          />
          <button className="run-btn" onClick={() => compile()}>
            Run
          </button>
        </div>
        <div className="right-container">
          <h4>Input:</h4>
          <div className="input-box">
            <textarea id="code-inp" onChange=
              {(e) => setUserInput(e.target.value)}>
            </textarea>
          </div>
          <h4>Output:</h4>

          <div className="output-box">
            <pre>{userOutput}</pre>
            <button onClick={() => { clearOutput() }}
              className="clear-btn">
              Clear
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
