import React from "react";

import CurrentUserContext from "../contexts/CurrentUserContext";

function Card({ card, onClick, onCardDelete, onCardLike }) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;

  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `card__like ${isLiked && "card__like_liked"}`;

  return (
    <article className="card">
      <img
        className="card__image"
        src={card.link}
        alt={card.name}
        onClick={() => onClick(card)}
      />
      {isOwn && <button className="card__delete" onClick={onCardDelete} />}
      <div className="card__info">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__like-container">
          <button className={cardLikeButtonClassName} onClick={onCardLike} />
          <p className="card__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;
