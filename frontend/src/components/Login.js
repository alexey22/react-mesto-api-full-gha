import React, { useState, useEffect } from "react";

import "./styles/Login.css";

const Login = ({ onLogin, tokenCheck }) => {
  useEffect(() => {
    tokenCheck();
  }, []);

  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  return (
    <>
      <section className="login__container">
        <h1 className="login__header">Вход</h1>
        <form onSubmit={(e) => onLogin(e, formValue.email, formValue.password)}>
          <input
            id="email"
            name="email"
            type="email"
            value={formValue.email}
            onChange={handleChange}
            placeholder="Email"
            className="login__input"
            required
          />
          <input
            id="password"
            name="password"
            type="password"
            value={formValue.password}
            onChange={handleChange}
            placeholder="Пароль"
            className="login__input"
            required
          />

          <button type="submit" className="login__button">
            Войти
          </button>
        </form>
      </section>
    </>
  );
};

export default Login;
