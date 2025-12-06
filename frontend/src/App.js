// src/App.js
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import IngredientsPage from "./pages/IngredientsPage";
import WastePage from "./pages/WastePage";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";

import RecipeSaved from "./pages/RecipeSaved";
import RecipeSearch from "./pages/RecipeSearch";
import RecipeDetail from "./pages/RecipeDetail";
import WeeklyPlan from "./pages/WeeklyPlan";
import ExpireAlert from "./pages/ExpireAlert";


// 라우팅만 담당하는 App 컴포넌트
function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} /> 
      <Route path="/ingredients" element={<IngredientsPage />} />
      <Route path="/recipes/saved" element={<RecipeSaved />} />
      <Route path="/recipes/search" element={<RecipeSearch />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />
      <Route path="/weekly-plan" element={<WeeklyPlan />} />
      <Route path="/waste" element={<WastePage />} />
      <Route path="/alerts" element={<ExpireAlert />} />
      </Route>
    </Routes>
  );
}

export default App;
