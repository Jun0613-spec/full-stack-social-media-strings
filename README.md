# Full stack social media app

This is a repository for Strings which is Full stack social media app

## 🛠 Tech Stack

### **Frontend:**

- React, Vite, TypeScript, Tailwind CSS, React Query, Axios, React Context API, Zustand, Soket.io

### **Backend:**

- Node.js, Express, TypeScript, Postgresql, Prisma ORM, Google OAuth, Cloudinary for image uploads, JSON Web Token (JWT) Authentication, Soket.io

---

## 🚀 Features

- **Authentication & Authorization** – Google login or email and password login
- **User Profiles** – Edit user profile upload profile image and cover image, delete account
- **Posts & Replies** – Create, Edit, Delete posts and replies, like user's posts and replies
- **Follow user** – Follow & Unfollow users
- **Search users** – Search users
- **Real time notifications** –Real time notifications when other user follows or likes your posts, replies
- **Real time message** –Real time Direct Message to other user

---

### Install packages

```shell
npm install --legacy-peer-deps or --force
```

### Setup .env file

```js
Frontend

VITE_API_BASE_URL=

Backend

PORT =
CLIENT_URL=
SERVER_URL=

JWT_SECRET_KEY=

DATABASE_URL=
DIRECT_URL=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Start the app

```shell
npm run dev
```
