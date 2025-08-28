# Image Steganography Full-Stack App

A **full-stack web application** for **image steganography** using **DWT + DCT**, built with Node.js and React. Version 1 focuses on embedding and extracting secret images. Version 2 will introduce **user authentication and history tracking** with MongoDB.

---

## Features (v1)

- **Embed a secret image** into a cover image.
- **Extract** the secret image from a stego image.
- Automatic **resizing based on the smallest dimension** of input images.
- Returns **base64 PNG** for easy frontend rendering.
- Fully modular backend for DWT/DCT processing using:
  - **Jimp** – image manipulation
  - **discrete-wavelets** – DWT/IDWT transforms
  - **dct2** – 2D DCT/IDCT transforms
  - **ml-matrix** – matrix operations

---

## Planned Features (v2)

- **MongoDB integration** for user authentication (signup/login).
- **History tracking** for embedded and extracted images.
- **Dashboard** to manage user activity and image history.
- Frontend enhancements for better UX and visual feedback.
- Optional **analytics** for usage patterns.

---

## Tech Stack

**Backend:** Node.js, Jimp, ml-matrix, discrete-wavelets, dct2  
**Frontend:** React (Vite), Shadcn/UI (lightweight, modern UI)  
**Database (v2):** MongoDB (user & history tracking)

---

## Installation

```bash
git clone <your-repo-url>
cd <repo-folder>
npm install

```

Make sure _Node.js_ version **>=18** is installed.

## Folder Structure

    /backend
    ├─ stego.js
    ├─ index.js
    └─ package.json

    /frontend
    ├─ src
        ├─ components
        ├─ pages
        └─ App.jsx

## Notes

Images are converted to grayscale before processing.

The smallest image dimension is used to resize both cover and secret images.

DWT + DCT ensures robustness of embedded images.

## LICENSE

MIT License © Nikunj Goyal
