import React from "react";

function PopupWithForm({
  title,
  name,
  children,
  buttonText,
  isOpen,
  onClose,
  onSubmit,
}) {
  return (
    <section
      className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`}
    >
      <div className="popup__container">
        <form
          className={`popup__form form-${name}`}
          name={name}
          onSubmit={onSubmit} /*noValidate*/
        >
          <h2 className={`form-${name}__title`}>{title}</h2>
          {children}
          <button
            className={`popup__button form-${name}__submit-button`}
            type="submit"
          >
            {buttonText}
          </button>
        </form>

        <button className="popup__close" onClick={onClose} />
      </div>
    </section>
  );
}

export default PopupWithForm;
