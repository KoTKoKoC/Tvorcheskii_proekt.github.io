const router = require("express").Router();
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require("../../../middleware/checkAuth");
const User = require("../../../models/User");

// @route POST api/auth
// @desc Проверяем токен и загружаем информацию о пользователе
// @access Private
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user));
});

// @route POST api/auth
// @desc Регистрация нового пользователя
// @access Public
router.post("/register", (req, res) => {
  const {
    firstName,
    lastName,
    email,
    branch,
    degree,
    password,
    passwordConfirm,
    checked,
  } = req.body;

  // Проверяем заполненность полей
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !passwordConfirm ||
    !branch ||
    !degree
  ) {
    return res.status(400).json({ msg: "Не все поля заполнены" });
  }

  // Проверяем уже существующий email
  User.findOne({ email }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ msg: "Пользователь с таким email уже существует" });
    }

    // Хешируем пароль
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (passwordConfirm !== password) {
          return res.status(400).json({ msg: "Пароль не подтвержден!" });
        }

        if (!checked) {
          return res
            .status(400)
            .json({ msg: "Нужно согласиться с правилами!" });
        }

        // Создаем нового полльзователя
        const newUser = new User({
          firstName,
          lastName,
          email,
          branch,
          degree,
          password: hash,
          confirmHash: hash
        });

        // Пытаемся сохранить в базу данных и создать токен
        newUser
          .save()
          .then((user) => {
            console.log(user.confirmHash)
            jwt.sign(
              { id: user._id },
              config.get("jwtSecret"),
              { expiresIn: "1h" },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    degree: user.degree,
                    branch: user.branch,
                    number: user.number,
                    confirmHash: user.confirmHash,
                  },
                });
              }
            );
          })
          .catch((err) => {
            return res
              .status(500)
              .json("Извините, что-то пошло не так. Попробуйте еще раз.");
          });
      });
    });
  });
});

// @route POST api/auth
// @desc Вход пользователя
// @access Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ msg: "Заполните все поля" });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user)
        return res
          .status(400)
          .json({ msg: "Введен неверный логин или пароль" });

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch)
          return res
            .status(400)
            .json({ msg: "Введен неверный логин или пароль" });

        jwt.sign(
          { id: user._id },
          config.get("jwtSecret"),
          { expiresIn: "1h" },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                degree: user.degree,
                branch: user.branch,
                number: user.number
              },
            });
          }
        );
      });
    })
    .catch((err) => res.status(500).json({ msg: "Что-то пошло не так!" }));
});

// @route PUT api/auth
// @desc Изменить данные пользователя
// @access Private
router.put("/update/:id", auth, (req, res) => {
  const { firstName, lastName, email, number, degree, branch } = req.body;

  const toUpdateUser = {
    firstName,
    lastName,
    email,
    number,
    degree,
    branch,
  };

  User.findByIdAndUpdate(req.params.id, toUpdateUser).then(doc => res.json(doc)).catch(err => res.json({msg: "ERROR"}))
})

// @route DELETE api/auth
// @desc Удалить пользователя
// @access Private
router.delete("/delete/:id", auth, (req, res) => {

  User.findByIdAndDelete(req.params.id).then(doc => res.json(doc)).catch(err => res.json({msg: "ERROR"}))

})

module.exports = router;
