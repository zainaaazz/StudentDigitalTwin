import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Student Interaction Simulator</h1>
            <p>Social Network Analysis for Student Digital Twin</p>
            <div>
              <button onClick={() => testAPI()}>Test Backend Connection</button>
            </div>
          </header>
        </div>
      </Router>
    </ThemeProvider>
  );
}

const testAPI = async () => {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/health"
    );
    const data = await response.json();
    alert("Backend connected! " + data.message);
  } catch (error) {
    alert("Backend connection failed: " + error);
  }
};

export default App;
