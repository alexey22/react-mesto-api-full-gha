class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  getHeaders() {
    return this._headers;
  }

  setAuthHeaderTokenFromLocalStorage() {
    this._headers = {
      ...this._headers,
      authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }

  _handleResponse(res, errMessage) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(errMessage);
    }
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      //credentials: 'include',
      headers: { ...this._headers, 'Content-Type': 'application/json' },
    }).then((res) =>
      this._handleResponse(res, 'Ошибка при получении данных пользователя')
    );
  }

  setUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      //credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then((res) =>
      this._handleResponse(res, 'Ошибка при сохранении данных пользователя')
    );
  }

  setUserAvatar(url) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      //credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        avatar: url,
      }),
    }).then((res) =>
      this._handleResponse(res, 'Ошибка при сохранении аватарки')
    );
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      //credentials: 'include',
      headers: this._headers,
    }).then((res) => this._handleResponse(res, 'Ошибка при загрузке карточек'));
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      //credentials: 'include',
      headers: this._headers,
    }).then((res) => this._handleResponse(res, 'Ошибка при удалении карточки'));
  }

  addCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      //credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then((res) =>
      this._handleResponse(res, 'Ошибка при сохранении карточки')
    );
  }

  addLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      //credentials: 'include',
      headers: this._headers,
    }).then((res) => this._handleResponse(res, 'Ошибка при добавлении лайка'));
  }

  deleteLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      //credentials: 'include',
      headers: this._headers,
    }).then((res) => this._handleResponse(res, 'Ошибка при удалении лайка'));
  }

  changeLikeCardStatus(cardId, isLikedByCurrentUser) {
    if (isLikedByCurrentUser) {
      return this.addLike(cardId);
    } else {
      return this.deleteLike(cardId);
    }
  }
}

const api = new Api({
  // baseUrl: 'http://localhost:3000',
  // baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-62',
  baseUrl: 'https://api.musli.nomoredomains.work',
  headers: {
    // authorization: 'fc75adb2-6a66-4f85-8c97-c6dd58414106',
    authorization: `Bearer ${localStorage.getItem('token')}`,
    // credentials: 'include',
    'Content-Type': 'application/json',
  },
});

export default api;
