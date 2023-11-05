const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "Название" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "Название" - 2'],
    maxlength: [30, 'Максимальная длина поля "Название" - 30'],
  },
  link: {
    type: String,
    required: [true, 'Поле "Ссылка на картинку" должно быть заполнено'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
