export default {
  translation: {
    title: 'Hexlet Chat',
    logoutButton: 'Выйти',
    loginForm: {
      header: 'Войти',
      username: 'Ваш ник',
      password: 'Пароль',
      submit: 'Войти',
      signupLink: 'Регистрация',
      errors: {
        authFail: 'Неверные имя пользователя или пароль',
      },
      toasts: {
        connectionError: 'Ошибка соединения',
      },
    },
    signupForm: {
      header: 'Регистрация',
      username: 'Имя пользователя',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      submit: 'Зарегистрироваться',
      errors: {
        required: 'Обязательное поле',
        usernameLength: 'От 3 до 20 символов',
        passwordLength: 'Не менее 6 символов',
        confirmPasswordMatch: 'Пароли должны совпадать',
        userAlreadyExists: 'Такой пользователь уже существует',
      },
    },
    chat: {
      channels: 'Каналы',
      messages_zero: '{{count}} сообщений',
      messages_one: '{{count}} сообщение',
      messages_few: '{{count}} сообщения',
      messages_many: '{{count}} сообщений',
      channel: {
        manage: 'Управление каналом',
        remove: 'Удалить',
        rename: 'Переименовать',
      },
      modals: {
        channelName: 'Имя канала',
        cancel: 'Отмена',
        send: 'Отправить',
        remove: 'Удалить',
        addChannel: 'Добавить канал',
        removeChannel: 'Удалить канал',
        renameChannel: 'Переименовать канал',
        confirm: 'Уверены?',
        errors: {
          required: 'Обязательное поле',
          channelNameLength: 'От 3 до 20 символов',
          unique: 'Должно быть уникальным',
        },
      },
      send: 'Отправить',
      enterMessage: 'Введите сообщение...',
      newMessage: 'Новое сообщение',
      toasts: {
        channelAdded: 'Канал создан',
        channelRemoved: 'Канал удалён',
        channelRenamed: 'Канал переименован',
      },
    },
  },
};