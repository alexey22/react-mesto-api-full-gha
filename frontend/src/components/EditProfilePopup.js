import React from "react";
import { useState, useEffect } from "react";

import PopupWithForm from "./PopupWithForm";

import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDecsription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="profile-info"
      buttonText="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input form-profile-info__input form-profile-info__input_el_name"
        name="name"
        placeholder="Имя"
        type="text"
        minLength="2"
        maxLength="40"
        required
        onChange={handleChangeName}
        value={name || ""}
      />
      <p className="popup__error name-error"></p>
      <input
        className="popup__input form-profile-info__input form-profile-info__input_el_profession"
        name="profession"
        placeholder="Профессия"
        type="text"
        minLength="2"
        maxLength="200"
        required
        onChange={handleChangeDecsription}
        value={description || ""}
      />
      <p className="popup__error profession-error"></p>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
