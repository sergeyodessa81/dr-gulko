export const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
] as const

export type Language = (typeof languages)[number]["code"]

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      education: "Education",
      blog: "Blog",
      pricing: "Pricing",
      dashboard: "Dashboard",
      admin: "Admin",
      languageLab: "Language Lab",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      retry: "Retry",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
    },
    auth: {
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      email: "Email",
      password: "Password",
    },
  },
  de: {
    nav: {
      home: "Startseite",
      about: "Über uns",
      education: "Bildung",
      blog: "Blog",
      pricing: "Preise",
      dashboard: "Dashboard",
      admin: "Admin",
      languageLab: "Sprachlabor",
    },
    common: {
      loading: "Laden...",
      error: "Fehler",
      retry: "Wiederholen",
      cancel: "Abbrechen",
      save: "Speichern",
      delete: "Löschen",
      edit: "Bearbeiten",
    },
    auth: {
      login: "Anmelden",
      signup: "Registrieren",
      logout: "Abmelden",
      email: "E-Mail",
      password: "Passwort",
    },
  },
  ru: {
    nav: {
      home: "Главная",
      about: "О нас",
      education: "Образование",
      blog: "Блог",
      pricing: "Цены",
      dashboard: "Панель",
      admin: "Админ",
      languageLab: "Языковая лаборатория",
    },
    common: {
      loading: "Загрузка...",
      error: "Ошибка",
      retry: "Повторить",
      cancel: "Отмена",
      save: "Сохранить",
      delete: "Удалить",
      edit: "Редактировать",
    },
    auth: {
      login: "Войти",
      signup: "Регистрация",
      logout: "Выйти",
      email: "Электронная почта",
      password: "Пароль",
    },
  },
  uk: {
    nav: {
      home: "Головна",
      about: "Про нас",
      education: "Освіта",
      blog: "Блог",
      pricing: "Ціни",
      dashboard: "Панель",
      admin: "Адмін",
      languageLab: "Мовна лабораторія",
    },
    common: {
      loading: "Завантаження...",
      error: "Помилка",
      retry: "Повторити",
      cancel: "Скасувати",
      save: "Зберегти",
      delete: "Видалити",
      edit: "Редагувати",
    },
    auth: {
      login: "Увійти",
      signup: "Реєстрація",
      logout: "Вийти",
      email: "Електронна пошта",
      password: "Пароль",
    },
  },
} as const

export function useTranslation(lang: Language = "en") {
  return {
    t: (key: string) => {
      const keys = key.split(".")
      let value: any = translations[lang]

      for (const k of keys) {
        value = value?.[k]
      }

      return value || key
    },
    lang,
  }
}
