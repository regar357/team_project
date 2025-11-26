// src/pages/signup.js
import React, { useState, useNavigate } from "react";

function SignupPage() {
  const [form, setForm] = useState({
    userId: "",
    password: "",
    passwordConfirm: "",
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // TODO: 실제 회원가입 API 호출
    console.log("회원가입 정보:", form);
    alert("데모용: 콘솔에서 회원가입 데이터를 확인하세요.");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>가입신청</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            아이디
            <input
              style={styles.input}
              type="text"
              name="userId"
              value={form.userId}
              onChange={handleChange}
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
              required
            />
          </label>

          <label style={styles.label}>
            비밀번호 확인
            <input
              style={styles.input}
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              required
            />
          </label>

          <label style={styles.label}>
            이름
            <input
              style={styles.input}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label style={styles.label}>
            이메일
            <input
              style={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <button type="submit" style={styles.mainButton}>
            가입 신청
          </button>
        </form>
      </div>
    </div>
  );
}

// 로그인 페이지랑 똑같은 스타일 재사용용
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
};

export default SignupPage;
