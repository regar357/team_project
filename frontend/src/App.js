import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import RecipeSaved from "./pages/RecipeSaved";
import RecipeSearch from "./pages/RecipeSearch";
import RecipeDetail from "./pages/RecipeDetail";
import WeeklyPlan from "./pages/WeeklyPlan";
import ExpireAlert from "./pages/ExpireAlert";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} /> 
          <Route path="/recipes/saved" element={<RecipeSaved />} />
          <Route path="/recipes/search" element={<RecipeSearch />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/weekly-plan" element={<WeeklyPlan />} />
          <Route path="/alerts" element={<ExpireAlert />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;