import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';

import api from '../utils/api';
import * as auth from '../auth';

import CurrentUserContext from '../contexts/CurrentUserContext';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';

import { ProtectedRoute } from './ProtectedRoute';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState(null);

  const [currentUser, setCurrentUser] = React.useState({});

  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ email: '' });
  const [cards, setCards] = React.useState([]);

  const [infoTooltipState, setInfoTooltipState] = useState({
    open: false,
    success: false,
  });

  const navigate = useNavigate();

  const tokenCheck = () => {
    const jwt = localStorage.getItem('token');
    if (jwt) {
      auth
        .getContent(jwt)
        .then((data) => {
          handleLogin({ email: data?.email });
          navigate('/');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  React.useEffect(() => {
    if (loggedIn) {
      api.setAuthHeaderTokenFromLocalStorage();
      console.log(api.getHeaders());

      api
        .getUserInfo()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((errMessage) => alert(errMessage));

      api
        .getInitialCards()
        .then((cards) => setCards(cards))
        .catch((errMessage) => alert(errMessage));
    }
  }, [loggedIn]);

  React.useEffect(() => {
    tokenCheck();
  }, []);

  const handleLogin = ({ email }) => {
    setUserData({ email });
    setLoggedIn(true);
  };

  const onLogin = (e, email, password) => {
    e.preventDefault();

    auth
      .authorize({ email, password })
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('email', email);
          navigate('/', { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
        setInfoTooltipState({ open: true, success: false });
      });
  };

  const onRegister = (e, email, password) => {
    e.preventDefault();

    auth
      .register({ email, password })
      .then(() => {
        setInfoTooltipState({ open: true, success: true });
      })
      .catch((err) => {
        console.log(err);
        setInfoTooltipState({ open: true, success: false });
      });
  };

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  }

  function closeTooltip() {
    setInfoTooltipState({ open: false, success: false });
  }

  function handleUpdateAvatar(url) {
    api
      .setUserAvatar(url)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((errMessage) => alert(errMessage));
  }

  function handleUpdateUser({ name, about }) {
    api
      .setUserInfo({ name, about })
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((errMessage) => alert(errMessage));
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((errMessage) => alert(errMessage));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then((message) => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((errMessage) => alert(errMessage));
  }

  function handleAddPlaceSubmit(name, link) {
    api
      .addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((errMessage) => alert(errMessage));
  }

  function handleSignOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setLoggedIn(false);
    setUserData({ email: '' });
    navigate('/sign-in', { replace: true });
  }

  return (
    <div className='page'>
      <CurrentUserContext.Provider value={currentUser}>
        <Header userData={userData} onSignOut={handleSignOut} />
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute
                element={Main}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                cards={cards}
                handleCardLike={handleCardLike}
                handleCardDelete={handleCardDelete}
                loggedIn={loggedIn}
              />
            }
          />
          <Route
            path='/sign-up'
            element={<Register onRegister={onRegister} />}
          />
          <Route
            path='/sign-in'
            element={<Login onLogin={onLogin} tokenCheck={tokenCheck} />}
          />
        </Routes>

        <Footer />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <PopupWithForm
          title='Вы уверены?'
          name='delete-card'
          buttonText='Да'
          isOpen={false}
          onClose={closeAllPopups}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip
          infoTooltipState={{
            open: infoTooltipState.open,
            success: infoTooltipState.success,
          }}
          onClose={closeTooltip}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
