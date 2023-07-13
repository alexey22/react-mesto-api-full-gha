import React from "react";

import "./styles/InfoTooltip.css";

import success_true from "../images/success_true.svg";
import success_false from "../images/success_false.svg";

const InfoTooltip = (props) => {
  const infoTooltipState = props.infoTooltipState;
  const onClose = props.onClose;

  return (
    <section className={`popup ${infoTooltipState.open ? "popup_opened" : ""}`}>
      <div className="info-tooltip__container">
        <img
          className="info-tooltip__image"
          src={infoTooltipState.success ? success_true : success_false}
          alt={infoTooltipState.success ? "успешно" : "ошибка"}
        />
        <h1 className="info-tooltip__header">
          {infoTooltipState.success
            ? "Вы успешно зарегистировались!"
            : `Что-то пошло не так! Попробуйте ещё раз.`}
        </h1>
        <button type="button" className="popup__close" onClick={onClose} />
      </div>
    </section>
  );
};

export default InfoTooltip;
