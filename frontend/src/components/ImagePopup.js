import React from "react";

function ImagePopup({ card, onClose, onClick }) {
  return (
    <section
      className={`popup popup_type_show-image ${card ? "popup_opened" : ""}`}
    >
      <div className="popup__container">
        <img
          className="popup__image"
          src={card ? card.link : "#"}
          alt={card ? card.name : ""}
          onClick={onClick}
        />
        <p className="popup__subtitle">{card ? card.name : ""}</p>
        <button type="button" className="popup__close" onClick={onClose} />
      </div>
    </section>
  );
}

export default ImagePopup;
