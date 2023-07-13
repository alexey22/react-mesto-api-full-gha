import React from "react";

import { useLocation, Link } from "react-router-dom";

import logo from "../images/logo.svg";

function Header({ userData, onSignOut }) {
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="header__inner-container">
        <img className="header__logo" src={logo} alt="Логотип Mesto" />
        {(() => {
          if (pathname === "/sign-up") {
            return (
              <Link className="header__link" to="/sign-in">
                Войти
              </Link>
            );
          }
          if (pathname === "/sign-in") {
            return (
              <Link className="header__link" to="/sign-up">
                Регистрация
              </Link>
            );
          }
          if (pathname === "/") {
            return (
              <p className="header__user-data">
                {userData.email}
                <span onClick={onSignOut} className="header__link">
                  Выйти
                </span>
              </p>
            );
          }
        })()}
      </div>
      <div className="header__line"></div>
    </header>
  );
}

export default Header;
