import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/AdminLogin/AdminLogin";
import CreateDevotion from "./components/CreateDevotion/CreateDevotion";
import GeneralDevotion from "./components/GeneralDevotions/GeneralDevotions";
import SearchByDate from "./components/SearchByDate/SearchByDate";
import TodaysDevotion from "./components/TodaysDevotion/TodaysDevotion";
import UpdateDevotion from "./components/UpdateDevotion/update-devotion";
import UpdateList from "./components/UpdateList/update-list";
import AboutPage from "./components/about";
import Display from "./components/display/Display";
import Footer from "./components/footer";
import General from "./components/general/General";
import Header from "./components/header";
import Home from "./components/home";
import Privacy from "./components/terms-and-privacy/privacy-and-policy";
import Terms from "./components/terms-and-privacy/terms";
import './index.css';

function App() {

  return (
    <Router>
      <div>
        <Header />
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin-login" element={<Login />} />
            <Route path="/add-devotion" element={<CreateDevotion />} />
            <Route path="/display/:id" element={<Display />} />
            <Route path="/all-devotions" element={<General />} />
            <Route path="/general-devotion" element={<GeneralDevotion />} />
            <Route path="/find-devotion-by-date/:date" element={<SearchByDate />} />
            <Route path="/today's-devotion" element={<TodaysDevotion />} />
            <Route path="/update-list" element={<UpdateList />} />
            <Route path="/update-devotion/:id" element={<UpdateDevotion />} />
            <Route path="/terms&conditions" element={<Terms />} />
            <Route path="/privacypolicy" element={<Privacy />} />
          </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
