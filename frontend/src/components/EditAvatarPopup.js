import React from "react";

import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const pictureUrlRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar(pictureUrlRef.current.value);
  }

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="edit-avatar"
      buttonText="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input form-edit-avatar__input"
        name="avatar"
        placeholder="Ссылка на картинку"
        type="url"
        required
        ref={pictureUrlRef}
      />
      <p className="popup__error avatar-error"></p>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
