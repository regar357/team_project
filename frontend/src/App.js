import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import FindIdPage from "./pages/login";           // 파일 이름에 맞게 수정해줘
import ResetPasswordPage from "./pages/login";    // 파일 이름에 맞게 수정해줘

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 처음 접속( / )하면 /login 으로 보내기 */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 실제 페이지들 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/find-id" element={<FindIdPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
