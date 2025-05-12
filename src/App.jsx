import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SelectionPage } from "./Components/SelectionPage";
import { Dashboard } from "./components/DashboardPage";
import { StartPage } from "./Components/StartPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage/>} />
        <Route path="/play-station" element={<SelectionPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
