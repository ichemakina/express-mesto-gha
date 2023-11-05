const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "Имя" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "Название" - 2'],
    maxlength: [30, 'Максимальная длина поля "Название" - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле "О себе" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "Название" - 2'],
    maxlength: [30, 'Максимальная длина поля "Название" - 30'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле "Ссылка на новой аватар" должно быть заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
