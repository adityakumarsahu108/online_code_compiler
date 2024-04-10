import React from 'react';
import Select from 'react-select';
import '../Navbar.css';

const Navbar = ({ userLang, setUserLang, userTheme,
  setUserTheme, fontSize, setFontSize }) => {
  const languages = [
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "javascript", label: "JavaScript" },
    // { value: "dart", label: "Dart" },
  ];
  const themes = [
    { value: "vs-dark", label: "Dark" },
    { value: "light", label: "Light" },
  ];
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: 120,
      borderRadius: 5,
      border: '2px solid cyan', // Add white border
      outline: 'none',
      cursor: 'pointer',
      justifyContent: 'space-between',
      paddingRight: 10,
      color: 'cyan',
      fontFamily: 'sans-serif',
      backgroundColor: '#1E1E1E',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#555555' : '#1E1E1E', // Change background color when hovered
      color: 'white',
    }),
    menu: (provided, state) => ({
      ...provided,
      marginTop: 0, // Remove top margin
      marginBottom: 0, // Remove bottom margin
      borderRadius: 0, // Remove border radius
      backgroundColor: '#1E1E1E',
      border: 'none', // Remove border
      boxShadow: 'none', // Remove box shadow
    }),
  };
  


  return (
    <div className="navbar">
    <h1 className="title">ONLINE CODE EDITOR</h1>
    <div className="dropdowns">
      <Select
        styles={customStyles}
        options={languages}
        value={userLang}
        onChange={(e) => setUserLang(e.value)}
        placeholder={userLang}
      />
      <Select
        styles={customStyles}
        options={themes}
        value={userTheme}
        onChange={(e) => setUserTheme(e.value)}
        placeholder={userTheme}
      />
    </div>
    <div className="font-size-container">
      <label className="font_size">Font Size</label>
      <input
        type="range"
        min="15"
        max="40"
        value={fontSize}
        step="1"
        onChange={(e) => setFontSize(Number(e.target.value))}
      />
    </div>
  </div>
);
}

export default Navbar;