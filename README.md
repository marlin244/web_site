# GMN Customs — Сайт и Панель управления

## Стек
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **База данных**: Yandex Cloud YDB

## Быстрый старт

### 1. Настройка переменных окружения

```bash
cp server/.env.example server/.env
# Отредактируйте server/.env — заполните YDB_ENDPOINT, YDB_DATABASE, JWT_SECRET
```

Для YDB скачайте JSON-ключ сервисного аккаунта в Yandex Cloud Console и сохраните как `server/sa-key.json`.

### 2. Создание таблиц в YDB

```bash
cd server
npm run migrate
```

### 3. Создание первого администратора

```bash
cd server
npm run seed
# Логин/пароль берутся из ADMIN_USERNAME / ADMIN_PASSWORD в .env
```

### 4. Запуск

**Сервер (порт 3001):**
```bash
cd server
npm run dev
```

**Клиент (порт 5173):**
```bash
cd client
npm run dev
```

Открыть: http://localhost:5173  
Панель: http://localhost:5173/admin

## Структура

```
├── client/          # React приложение
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx      — Главная
│       │   ├── Gallery.jsx   — Галерея работ
│       │   ├── Blog.jsx      — Список постов
│       │   ├── BlogPost.jsx  — Отдельный пост
│       │   ├── Booking.jsx   — Запись
│       │   └── admin/
│       │       ├── Login.jsx     — Вход в панель
│       │       ├── Dashboard.jsx — Записи клиентов
│       │       ├── Posts.jsx     — Управление постами
│       │       ├── Works.jsx     — Управление галереей
│       │       └── Settings.jsx  — Webhook для VK-бота
│       └── components/
└── server/          # Node.js API
    ├── routes/      — Маршруты
    ├── controllers/ — Логика
    ├── middleware/  — JWT auth
    ├── db/          — YDB подключение + миграции
    └── uploads/     — Загруженные файлы
```

## API

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| POST | /api/auth/login | Все | Авторизация |
| GET | /api/auth/me | Админ | Текущий пользователь |
| GET | /api/posts | Все | Список опубликованных постов |
| GET | /api/posts/:id | Все | Пост |
| POST | /api/posts | Админ | Создать пост |
| PUT | /api/posts/:id | Админ | Редактировать пост |
| DELETE | /api/posts/:id | Админ | Удалить пост |
| GET | /api/works | Все | Галерея |
| POST | /api/works | Админ | Добавить работу |
| DELETE | /api/works/:id | Админ | Удалить работу |
| GET | /api/bookings | Админ | Все записи |
| POST | /api/bookings | Все | Создать запись |
| PATCH | /api/bookings/:id/status | Админ | Изменить статус |
| POST | /api/upload | Админ | Загрузить фото |
| POST | /api/webhook/vk | VK Bot | Webhook для бота |

## VK-бот интеграция

1. В панели `/admin/settings` скопируйте Webhook URL
2. Бот делает POST-запрос с `{"type":"get_pending","secret":"..."}` 
3. Сервер возвращает массив новых записей и помечает их как отправленные
4. Бот форматирует и отправляет сообщение в нужный чат VK

## Деплой

Для production рекомендуется:
- Загрузка файлов → Yandex Object Storage вместо локальных `uploads/`
- Сервер → Yandex Cloud Functions или обычная VM
- Nginx в качестве реверс-прокси
- Certbot для HTTPS
