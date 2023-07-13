import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./styles/Register.css";

const Register = ({ onRegister }) => {
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
    <section className="register__container">
      <h1 className="register__header">Регистрация</h1>
      <form
        onSubmit={(e) => onRegister(e, formValue.email, formValue.password)}
      >
        <input
          id="email"
          name="email"
          type="email"
          value={formValue.email}
          onChange={handleChange}
          placeholder="Email"
          className="register__input"
          required
        />
        <input
          id="password"
          name="password"
          type="password"
          value={formValue.password}
          onChange={handleChange}
          placeholder="Пароль"
          className="register__input"
          required
        />

        <button type="submit" className="register__button">
          Зарегистрироваться
        </button>
      </form>
      <p className="register__text">
        Уже зарегистированы?{" "}
        <Link to="/sign-in" className="register__link">
          Войти
        </Link>
      </p>
    </section>
  );
};

export default Register;
