# Dokumentasi Teknis - Nightstalker E-Commerce

Dokumentasi ini dibuat untuk tim developer guna memahami arsitektur, spesifikasi, dan alur kerja aplikasi Fullstack E-Commerce yang berjalan di `https://nightstalker.wuaze.com/`.

## 1. Deskripsi Proyek
Proyek ini adalah aplikasi E-Commerce Fullstack yang dibangun menggunakan arsitektur Monorepo. Aplikasi ini dirancang untuk memberikan pengalaman belanja yang cepat dan aman dengan pemisahan yang jelas antara Frontend dan Backend.

*   **Frontend:** Aplikasi web modern yang dibangun dengan Next.js 14, menawarkan antarmuka yang responsif dan interaktif.
*   **Backend:** REST API yang dibangun dengan Nest.js, menangani logika bisnis yang kompleks dan manajemen data.

## 2. Spesifikasi Lingkungan Pengembangan (Hardware/Software)
Berdasarkan data spesifikasi perangkat yang digunakan untuk pengembangan:

*   **Device Name:** skcompany
*   **Processor:** Intel(R) Core(TM) i3-4170 CPU @ 3.70GHz
*   **RAM:** 8,00 GB
*   **System Type:** 64-bit operating system, x64-based processor
*   **Operating System:** Windows

## 3. Technology Stack & Teknik

Berikut adalah rincian teknologi dan teknik yang digunakan dalam pengembangan aplikasi ini:

### Frontend (`apps/web`)
*   **Framework:** **Next.js 14** (App Router) - Versi stabil untuk performa dan fitur terbaru.
*   **Language:** **TypeScript** - Untuk keamanan tipe data yang ketat.
*   **Styling:** **Tailwind CSS** - Framework CSS utility-first.
*   **UI Library:** **Shadcn/UI** - Komponen UI yang dapat dikustomisasi, terintegrasi penuh dengan `components.json` dan `lib/utils.ts`.
*   **State Management:** **Zustand** - Digunakan untuk mengelola global state seperti Shopping Cart.
*   **Authentication:** **NextAuth.js v5** - Menggunakan Credentials Provider yang terhubung ke Backend API.

### Backend (`apps/api`)
*   **Framework:** **Nest.js** (Node.js) - Framework backend yang modular dan scalable.
*   **Language:** **TypeScript**.
*   **Database:** **MySQL** - Relational Database Management System.
*   **ORM:** **Prisma ORM** - Untuk interaksi tipe-aman dengan database MySQL.
*   **Authentication:** **Passport-JWT & Passport-Local** - Implementasi autentikasi stateless menggunakan JSON Web Tokens (JWT), tanpa session cookies di sisi server.

### Arsitektur
*   **Monorepo:** Menggabungkan kode Frontend dan Backend dalam satu repositori untuk memudahkan manajemen dependensi dan deployment.

## 4. Alur Kerja Sistem (Flowchart Deskriptif)

Bagian ini menjelaskan alur data dan interaksi pengguna dalam format teks, yang dapat digunakan sebagai acuan untuk membuat diagram visual.

### A. Alur Autentikasi (Login)
1.  **START**
2.  User mengakses halaman Login pada Frontend.
3.  User memasukkan Email dan Password.
4.  **Frontend Action:** NextAuth mengirim request `POST` ke Backend API.
5.  **Backend Process:**
    *   Menerima kredensial.
    *   Memverifikasi user di database MySQL via Prisma.
    *   Jika valid, Backend membuat (sign) JWT Access Token.
    *   Backend mengembalikan Token ke Frontend.
6.  **Frontend Action:** Menyimpan session user (berisi Token).
7.  User diarahkan (Redirect) ke Dashboard/Home.
8.  **END**

### B. Alur Belanja (Product & Cart)
1.  **START**
2.  User membuka halaman Katalog Produk.
3.  **Frontend Process:** Request data produk (`GET /products`) ke Backend.
4.  Backend mengambil data dari MySQL dan mengembalikan JSON list produk.
5.  User memilih produk dan menekan tombol "Add to Cart".
6.  **State Change:** Zustand Store pada Frontend diperbarui (menambah item ke array cart).
7.  User melihat indikator keranjang belanja diperbarui.
8.  **END**

### C. Alur Checkout (Pemesanan)
1.  **START**
2.  User meninjau item di halaman Keranjang.
3.  User menekan tombol "Checkout".
4.  User melengkapi data pengiriman.
5.  **Frontend Action:** Mengirim data pesanan (`POST /orders`) ke Backend dengan menyertakan JWT Token (Authorization Header).
6.  **Backend Process:**
    *   Validasi Token (Guard).
    *   Validasi ketersediaan stok produk.
    *   Membuat record transaksi baru di tabel `Order` MySQL.
7.  Backend mengembalikan konfirmasi sukses.
8.  Frontend menampilkan halaman "Terima Kasih" atau "Order Success".
9.  **END**
