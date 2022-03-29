import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const defaultLanguage = 'ru';

const resources = {
  ru: {
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
          authFail: 'Неверное имя пользователя или пароль',
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
  },
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
