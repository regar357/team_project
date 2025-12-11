// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import IngredientsPage from "./pages/IngredientsPage";
import ListPage from "./pages/ListPage";
import WastePage from "./pages/WastePage";

import RecipeSaved from "./pages/RecipeSaved";
import RecipeSearch from "./pages/RecipeSearch";
import RecipeDetail from "./pages/RecipeDetail";
import WeeklyPlan from "./pages/WeeklyPlan";
import ExpireAlert from "./pages/ExpireAlert";

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
        <Route path="/list" element={<ListPage />} />
      </Route>
    </Routes>
  );
}

export default App;
