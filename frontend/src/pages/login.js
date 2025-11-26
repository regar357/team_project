// src/pages/login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userId: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 여기에서 실제 로그인 API 호출하면 됨
    console.log("로그인 시도:", form);
    alert("데모용: 콘솔에서 폼 데이터를 확인해보세요.");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{ marginBottom: "1.5rem" }}>로그인</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            아이디
            <input
              style={styles.input}
              type="text"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
            />
          </label>

          <label style={styles.label}>
            비밀번호
            <input
              style={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </label>

          <button type="submit" style={styles.mainButton}>
            로그인
          </button>
        </form>

        <div style={styles.linkGroup}>
          <button
            style={styles.subButton}
            type="button"
            onClick={() => navigate("/signup")}
          >
            가입신청
          </button>
          <button
            style={styles.subButton}
            type="button"
            onClick={() => navigate("/find-id")}
          >
            아이디 찾기
          </button>
          <button
            style={styles.subButton}
            type="button"
            onClick={() => navigate("/reset-password")}
          >
            비밀번호 변경
          </button>
        </div>

        {/* 라우터가 싫으면 a태그 대신 Link를 써도 됨 */}
        <div style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}>
          <Link to="/signup">회원가입 페이지로 이동</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "100%",
    maxWidth: "380px",
    padding: "2rem",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  input: {
    marginTop: "0.35rem",
    padding: "0.55rem 0.7rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.9rem",
  },
  mainButton: {
    marginTop: "0.75rem",
    padding: "0.6rem 0.7rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "#fff",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  linkGroup: {
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  subButton: {
    padding: "0.5rem 0.7rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "#fafafa",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
};

export default LoginPage;
