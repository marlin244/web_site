# GMN Customs — Технический отчёт по реализации

## Общее описание

Сайт студии кастомизации автомобилей **GMN Customs** (vk.com/gmncustoms).  
Проект состоит из двух независимых приложений: публичного сайта (React) и REST API сервера (Node.js), объединённых общей базой данных в Yandex Cloud.

---

## Архитектура

```
┌──────────────────────────────────────────────────────────┐
│                     Пользователь                         │
└────────────────────┬─────────────────────────────────────┘
                     │  HTTPS
          ┌──────────┴──────────┐
          │   React SPA         │  client/  (Vite + React 19)
          │   localhost:5173    │
          └──────────┬──────────┘
                     │  REST API (JSON)
          ┌──────────┴──────────┐
          │   Express сервер    │  server/  (Node.js + Express 5)
          │   localhost:3001    │
          └──────────┬──────────┘
                     │  gRPC / TLS
          ┌──────────┴──────────┐
          │   Yandex Cloud YDB  │  Serverless / Москва
          │   Бессерверная БД   │
          └─────────────────────┘
```

---

## Стек технологий

### Фронтенд (`client/`)

| Технология | Версия | Роль |
|---|---|---|
| **React** | 19.2 | UI-фреймворк |
| **Vite** | 8.0 | Сборщик, dev-сервер |
| **React Router** | 7.17 | SPA-маршрутизация |
| **Axios** | 1.17 | HTTP-клиент для API |
| **Tailwind CSS** | 4.3 | CSS-утилиты (через `@tailwindcss/vite`) |
| **Lucide React** | 1.17 | Иконки |
| **react-hot-toast** | 2.6 | Уведомления |
| Bebas Neue + Inter | — | Шрифты (Google Fonts) |

### Бэкенд (`server/`)

| Технология | Версия | Роль |
|---|---|---|
| **Node.js** | LTS | Среда выполнения |
| **Express** | 5.2 | HTTP-сервер, маршрутизация |
| **ydb-sdk** | 5.11 | Драйвер Yandex Cloud YDB |
| **jsonwebtoken** | 9.0 | JWT-аутентификация |
| **bcryptjs** | 3.0 | Хэширование паролей |
| **multer** | 2.1 | Загрузка файлов |
| **uuid** | 14 | Генерация UUID |
| **dotenv** | 17 | Переменные окружения |

### База данных

**Yandex Cloud YDB** — бессерверная NewSQL база данных.  
Диалект: YQL (SQL-совместимый, с расширениями YDB).  
Авторизация: Сервисный аккаунт с авторизованным ключом (RSA-2048, JSON-файл).

---

## Структура файлов

```
danya/
├── client/                      # Фронтенд
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js        # Axios-инстанс с авто-добавлением JWT
│   │   ├── components/
│   │   │   ├── Container.jsx    # Центрированный контейнер (max 1600px)
│   │   │   ├── Navbar.jsx       # Шапка с мобильным бургер-меню
│   │   │   ├── Footer.jsx       # Подвал с навигацией и контактами
│   │   │   ├── Layout.jsx       # Обёртка: Navbar + outlet + Footer
│   │   │   ├── AdminLayout.jsx  # Боковая панель администратора
│   │   │   └── RequireAuth.jsx  # Защищённый маршрут (редирект на /login)
│   │   ├── hooks/
│   │   │   └── useAuth.js       # Хук: токен, текущий пользователь, logout
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Главная: Hero, услуги, процесс, CTA
│   │   │   ├── Gallery.jsx      # Галерея работ: фильтры + лайтбокс
│   │   │   ├── Blog.jsx         # Список статей
│   │   │   ├── BlogPost.jsx     # Отдельная статья
│   │   │   ├── Booking.jsx      # Форма записи
│   │   │   └── admin/
│   │   │       ├── Login.jsx    # Страница входа
│   │   │       ├── Dashboard.jsx # Дашборд: статистика + таблица записей
│   │   │       ├── Posts.jsx    # CRUD постов/статей
│   │   │       ├── Works.jsx    # Управление галереей работ
│   │   │       └── Settings.jsx # Настройки VK-бота
│   │   ├── index.css            # Глобальные стили, CSS-переменные, утилиты
│   │   ├── App.jsx              # Роутер приложения
│   │   └── main.jsx             # Точка входа React
│   ├── index.html               # HTML-шаблон (шрифты, мета)
│   └── vite.config.js           # Конфиг Vite (прокси /api → :3001)
│
└── server/                      # Бэкенд
    ├── controllers/
    │   ├── authController.js    # login, me
    │   ├── postsController.js   # CRUD постов
    │   ├── worksController.js   # CRUD работ
    │   ├── bookingsController.js# Записи: список, создание, смена статуса
    │   └── uploadController.js  # Загрузка файлов (multer)
    ├── routes/
    │   ├── auth.js              # POST /api/auth/login, GET /api/auth/me
    │   ├── posts.js             # GET/POST/PUT/DELETE /api/posts
    │   ├── works.js             # GET/POST/DELETE /api/works
    │   ├── bookings.js          # GET/POST /api/bookings, PATCH /:id/status
    │   ├── upload.js            # POST /api/upload
    │   └── webhook.js           # POST /api/webhook/vk (VK-бот)
    ├── middleware/
    │   └── auth.js              # JWT-проверка для защищённых маршрутов
    ├── db/
    │   ├── ydb.js               # Драйвер YDB: getDriver, execute, write, ddl
    │   ├── migrate.js           # Создание таблиц (node db/migrate.js)
    │   └── seed.js              # Создание admin-пользователя (node db/seed.js)
    ├── .env                     # Конфигурация окружения
    └── index.js                 # Точка входа Express
```

---

## Схема базы данных

### Таблица `users`
```sql
id         Utf8  PRIMARY KEY   -- UUID
username   Utf8
password   Utf8                -- bcrypt-хэш
role       Utf8                -- "admin"
created_at Uint64              -- Unix timestamp (мс)
```

### Таблица `posts`
```sql
id         Utf8  PRIMARY KEY
title      Utf8
body       Utf8                -- HTML или markdown-текст статьи
preview    Utf8                -- Краткое описание
image_url  Utf8
published  Bool                -- true — видна всем, false — только в админке
created_at Uint64
updated_at Uint64
```

### Таблица `works`
```sql
id          Utf8  PRIMARY KEY
title       Utf8
description Utf8
image_url   Utf8
category    Utf8              -- "Аэрография", "Винилирование", "Детейлинг", "Тюнинг"
created_at  Uint64
```

### Таблица `bookings`
```sql
id          Utf8  PRIMARY KEY
name        Utf8              -- Имя клиента
phone       Utf8
service     Utf8              -- Выбранная услуга
date        Utf8              -- Желаемая дата (строка)
time_slot   Utf8              -- Временной слот
comment     Utf8
status      Utf8              -- new | confirmed | cancelled | done
vk_notified Bool              -- Отправлено ли уведомление VK-боту
created_at  Uint64
```

---

## REST API

### Аутентификация

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| POST | `/api/auth/login` | Все | Получить JWT-токен |
| GET | `/api/auth/me` | JWT | Данные текущего пользователя |

### Посты / Блог

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| GET | `/api/posts` | Все | Список опубликованных постов |
| GET | `/api/posts` | JWT | Все посты (включая черновики) |
| GET | `/api/posts/:id` | Все | Один пост |
| POST | `/api/posts` | JWT | Создать пост |
| PUT | `/api/posts/:id` | JWT | Обновить пост |
| DELETE | `/api/posts/:id` | JWT | Удалить пост |

### Галерея работ

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| GET | `/api/works` | Все | Список работ (фильтр по `?category=`) |
| POST | `/api/works` | JWT | Добавить работу |
| DELETE | `/api/works/:id` | JWT | Удалить работу |

### Записи

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| GET | `/api/bookings` | JWT | Список записей (фильтр по `?status=`) |
| POST | `/api/bookings` | Все | Создать запись |
| PATCH | `/api/bookings/:id/status` | JWT | Сменить статус |

### Загрузка файлов

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| POST | `/api/upload` | JWT | Загрузить изображение |
| GET | `/uploads/:filename` | Все | Получить файл (статика) |

### VK Webhook

| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/webhook/vk` | Возвращает `VK_CONFIRMATION_CODE` |
| POST | `/api/webhook/vk` | Обработка событий VK; при `type=get_pending` — возвращает новые записи и отмечает их как уведомлённые |

---

## Аутентификация и безопасность

**Схема:** JWT Bearer Token в заголовке `Authorization`.

1. Клиент отправляет `POST /api/auth/login` с `{username, password}`.
2. Сервер проверяет пароль через `bcrypt.compare`.
3. При успехе выдаёт токен (время жизни: 7 дней, настраивается через `JWT_EXPIRES_IN`).
4. Токен хранится в `localStorage`.
5. Axios-инстанс автоматически добавляет токен в каждый запрос через interceptor.
6. Защищённые маршруты используют middleware `auth.js`, который верифицирует токен через `jwt.verify`.
7. Несанкционированный доступ → 401, редирект на `/admin/login`.

**VK Webhook** защищён секретом `VK_WEBHOOK_SECRET` — каждый POST должен содержать `{ secret: "..." }` в теле.

---

## Дизайн и UI

**Палитра:**
- Фон: `#0a0a0a` (почти чёрный)
- Акцент: `#c41515` (красный)
- Текст: `#f0f0f0`
- Muted: `#4a4a4a`

**Типографика:**
- Заголовки: **Bebas Neue** (Google Fonts) — `font-display`
- Текст: **Inter** (Google Fonts)

**Компоненты:**
- `Container` — центрированный контейнер, `max-width: 1600px`, `padding: clamp(20px, 4vw, 64px)` — адаптируется к любому экрану.
- Кнопки `.btn-red` и `.btn-outline` — CSS-классы в `index.css`.
- `.field` — единый стиль для полей форм.

**Страницы:**
- **Главная**: Hero с CTA, сетка услуг (4 колонки → 2 → 1), шаги процесса, блок призыва к действию.
- **Галерея**: Фильтрация по категории, асимметричная сетка, лайтбокс для просмотра.
- **Блог**: Главный пост крупно + список остальных.
- **Запись**: Двухколоночный макет (инфо слева, форма справа).
- **Админ-дашборд**: Карточки статистики + таблица записей со сменой статуса.

---

## Подключение к YDB

Драйвер инициализируется один раз (`singleton`) при первом обращении:

```js
// server/db/ydb.js
const authService = new IamAuthService({
  accessKeyId: saKey.id,                          // из sa-key.json
  serviceAccountId: saKey.service_account_id,
  privateKey: saKey.private_key,
  iamEndpoint: 'https://iam.api.cloud.yandex.net',
});
driver = new Driver({ endpoint, database, authService });
```

Три вспомогательные функции:
- `execute(sql, columns, txControl)` — SELECT-запросы, возвращает массив объектов.
- `write(sql)` — INSERT / UPDATE / DELETE / UPSERT (serializableReadWrite транзакция).
- `ddl(sql)` — DDL-запросы (CREATE TABLE и т.п.).

> **Важно:** используется ydb-sdk **v5**, где метод `executeDataQuery` переименован в `executeQuery(sql, params, txControl)`.

---

## Настройка окружения

Файл `server/.env`:

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173

JWT_SECRET=<случайная строка, минимум 32 символа>
JWT_EXPIRES_IN=7d

YDB_ENDPOINT=grpcs://ydb.serverless.yandexcloud.net:2135
YDB_DATABASE=/ru-central1/<folder-id>/<db-id>
YDB_SA_KEY_FILE=./sa-key.json

ADMIN_USERNAME=admin
ADMIN_PASSWORD=<пароль>

VK_WEBHOOK_SECRET=<секрет для бота>
VK_CONFIRMATION_CODE=<код из настроек группы ВК>

UPLOAD_DIR=./uploads
```

---

## Запуск

```bash
# Бэкенд
cd server
npm install
node db/migrate.js   # создать таблицы (один раз)
node db/seed.js      # создать admin-пользователя (один раз)
npm run dev          # запустить сервер (с авто-перезапуском)

# Фронтенд
cd client
npm install
npm run dev          # Vite dev-сервер на :5173
```

---

## Интеграция VK-бота

Бот подключается к эндпоинту `POST /api/webhook/vk`.

Сценарий работы:
1. В настройках группы ВКонтакте указать URL вебхука.
2. VK отправляет `type=confirmation` — сервер отвечает `VK_CONFIRMATION_CODE`.
3. Бот периодически отправляет `{ type: "get_pending", secret: "..." }` — получает список новых записей, которые ещё не были переданы, и помечает их как уведомлённые (`vk_notified = true`).

---

## Потенциальные улучшения

- Параметризованные запросы через `TypedValues` вместо строковой интерполяции.
- Пагинация для галереи и блога.
- Загрузка изображений в Yandex Object Storage вместо локального диска.
- Ротация JWT через refresh-токены.
- Производственный деплой: nginx как reverse proxy, PM2 для управления процессом.
