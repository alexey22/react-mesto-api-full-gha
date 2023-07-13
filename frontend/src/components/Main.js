import React from "react";

import Card from "./Card";

import CurrentUserContext from "../contexts/CurrentUserContext";

function Main({
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  cards,
  handleCardLike,
  handleCardDelete,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div className="profile__user">
          <div className="profile__avatar-container">
            <img
              src={currentUser.avatar}
              alt="Аватар"
              className="profile__avatar"
              onClick={onEditAvatar}
            />
          </div>
          <div className="profile__info">
            <div className="profile__name-and-edit-button">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                className="profile__edit-button"
                type="button"
                onClick={onEditProfile}
              ></button>
            </div>
            <p className="profile__profession">{currentUser.about}</p>
          </div>
        </div>

        <button
          className="profile__add-button"
          type="button"
          onClick={onAddPlace}
        ></button>
      </section>

      <section className="elements">
        {cards.map((card) => (
          <Card
            card={card}
            key={card._id}
            onClick={onCardClick}
            onCardLike={() => handleCardLike(card)}
            onCardDelete={() => handleCardDelete(card)}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
