const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorizedError');
const BadRequest = require('../errors/badRequest');
const NotFound = require('../errors/notFound');
const ServerError = require('../errors/serverError');

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) res.status(200).send(user);
      else {
        next(new NotFound('Пользователь с данным id не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный id'));
      } else {
        next(new ServerError('Произошла ошибка сервера'));
      }
    });
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      next(new ServerError('Произошла ошибка сервера'));
    });
};

const createUser = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { email, password, name, about, avatar } = req.body;

  // проверяем нет ли пользователя с таким паролем
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new BadRequest('Пользователь с таким email уже существует');
      } else {
        bcrypt.hash(String(password), 10).then((hashedPassword) => {
          User.create({
            email,
            password: hashedPassword,
            name,
            about,
            avatar,
          })
            .then((userFind) => res.status(201).send(userFind))
            .catch((err) => {
              if (err.name === 'ValidationError') {
                next(
                  new BadRequest(
                    'Переданы некорректные данные при создании пользователя',
                  ),
                );
              } else {
                next(new ServerError('Произошла ошибка сервера'));
              }
            });
        });
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(
    owner,
    { name, about, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        next(new NotFound('Пользователь по указанному id не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest(
            'Переданы некорректные данные при обновлении пользователя',
          ),
        );
      } else {
        next(new ServerError('Произошла ошибка сервера'));
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        next(new NotFound('Пользователь по указанному id не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest(
            'Переданы некорректные данные при обновлении пользователя',
          ),
        );
      } else {
        next(new ServerError('Произошла ошибка сервера'));
      }
    });
};

const login = (req, res, next) => {
  // Вытащить email и password
  const { email, password } = req.body;

  // Проверить существует ли пользователь с таким email
  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      next(
        new UnauthorizedError('Пользователь с таким email и паролем не найден'),
      );
    })
    .then((user) => {
      // Проверить совпадает ли пароль
      bcrypt
        .compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            // создать JWT
            const jwt = jsonWebToken.sign(
              {
                _id: user._id,
              },
              process.env['JWT.SECRET'],
            );

            // прикрепить его к куке
            res.cookie('jwt', jwt, {
              maxAge: 604800,
              httpOnly: true,
              sameSite: true,
            });

            // Если совпадает -- вернуть пользователя
            res.send(user.toJSON());
          } else {
            // Если не совпадает -- вернуть ошибку

            throw new UnauthorizedError(
              'Пользователь с таким email и паролем не найден',
            );
          }
        })
        .catch(next);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (user) res.status(200).send(user);
      else {
        next(new BadRequest('Пользователь с данным id не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный id'));
      } else {
        next(new ServerError('Произошла ошибка сервера'));
      }
    });
};

module.exports = {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getUser,
};
