# Rancangan Implementasi: Web Profil Bidang Akademik Universitas Andalas (Multi-Unit)

## 1. Latar Belakang & Tujuan

Membangun satu aplikasi web profil untuk Bidang Akademik Universitas Andalas yang sekaligus menaungi web profil untuk unit-unit di bawahnya (Perpustakaan, UPT PDK, dan unit lain di masa depan), dengan ketentuan:

- Setiap unit dapat diakses melalui path seperti `/perpustakaan`, `/upt-pdk`, dsb, dalam satu domain yang sama.
- Setiap unit dapat memiliki menu navigasi yang berbeda-beda sesuai kebutuhannya.
- Konten, menu, dan media (gambar/file) setiap unit dapat dikelola secara mandiri oleh admin unit tersebut.
- Terdapat dua level pengelola: **superadmin** (mengelola seluruh sistem) dan **admin unit** (mengelola unit miliknya saja).
- Desain antarmuka harus fleksibel, sehingga digunakan React murni sebagai lapisan tampilan (bukan Filament, bukan Inertia).
- Referensi kebutuhan konten diambil dari analisis situs existing `akademik.unand.ac.id`.

## 2. Pendekatan Arsitektur

Aplikasi dibangun sebagai **satu backend Express (REST API)** dan **satu frontend React (SPA)** yang terpisah, dengan pola **multi-unit dalam satu database**. Perbedaan tampilan dan menu antar unit dikendalikan oleh data, bukan oleh kode/halaman yang berbeda-beda. Dengan pendekatan ini, penambahan unit baru cukup dilakukan lewat panel admin, tanpa perlu deploy kode baru.

### Alur Request

1. Request masuk ke frontend React di path tertentu, misalnya `/perpustakaan`.
2. React Router mencocokkan path tersebut, lalu memanggil API Express `GET /api/units/:slug` untuk mengambil data unit.
3. Express mencari slug pada tabel `units`. Jika ditemukan → mengembalikan data unit beserta menu dan konten miliknya.
4. Frontend me-render layout unit tersebut berdasarkan data yang diterima. Jika unit tidak ditemukan → tampilkan halaman utama (fallback) atau halaman 404.

### Catatan SEO

Karena backend dan frontend terpisah (React SPA murni tanpa SSR), rendering awal terjadi di sisi client (CSR), yang kurang ideal untuk SEO halaman publik seperti pengumuman akademik. Opsi yang bisa dipertimbangkan ke depan:
- Menambahkan pre-rendering (misalnya via `vite-plugin-ssr` atau prerendering statis untuk halaman yang jarang berubah)
- Menyediakan meta tag dinamis minimal (title, description) lewat `react-helmet-async` agar tetap ada info dasar untuk crawler, meski tidak sekuat SSR penuh
- Jika SEO sangat kritis di kemudian hari, migrasi bagian public site ke framework yang mendukung SSR (di luar cakupan rencana saat ini)

## 3. Stack Teknologi

- **Backend**: Node.js + Express (REST API)
- **ORM**: Sequelize dengan MySQL — mendukung CommonJS secara native (tidak perlu setup ESM atau driver adapter tambahan), sudah lama dipakai luas di ekosistem Express + MySQL
- **Autentikasi**: JWT (`jsonwebtoken`) + `bcrypt` untuk hash password, token disimpan di httpOnly cookie
- **Otorisasi**: CASL — didefinisikan sekali, dipakai di middleware Express (cek permission) dan di React (tampilkan/sembunyikan UI)
- **Upload file**: `multer` untuk menerima upload, `sharp` untuk generate thumbnail gambar
- **Frontend**: React (Vite) sebagai SPA, React Router untuk routing, React Query (TanStack Query) untuk data fetching & caching ke API
- **Rich editor**: Tiptap atau Lexical, dengan custom extension untuk membuka Media Library Modal
- **Styling**: Tailwind CSS, bebas kombinasi dengan shadcn/ui, Radix UI, dnd-kit (drag-and-drop menu builder), react-hook-form + zod (validasi form)

## 4. Struktur Data (Data Model)

### Tabel `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int, PK | |
| name | varchar | |
| email | varchar, unique | dipakai untuk login |
| password_hash | varchar | hasil `bcrypt` |
| role | enum(`superadmin`,`admin_unit`) | menentukan cakupan ability CASL |
| created_at, updated_at | datetime | |

### Tabel `units`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int, PK | |
| slug | varchar, **unique** | dipakai sebagai path (`perpustakaan`, `upt-pdk`) |
| name | varchar | |
| logo_media_id | int, FK → `media.id`, nullable | |
| theme_color | varchar, nullable | |
| custom_css | text, nullable | Level 3 kustomisasi style |
| template_key | varchar, nullable | Level 4 kustomisasi style |
| is_active | boolean, default true | |
| created_at, updated_at | datetime | |

### Tabel `user_units` (pivot, many-to-many)
| Kolom | Tipe | Keterangan |
|---|---|---|
| user_id | int, FK → `users.id` | |
| unit_id | int, FK → `units.id` | |
| — | **primary key majemuk** (`user_id`, `unit_id`) | satu admin bisa ditugaskan ke lebih dari satu unit |

### Tabel `menus`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int, PK | |
| unit_id | int, FK → `units.id`, nullable | `null` = menu induk/global |
| parent_id | int, FK → `menus.id`, nullable | self-referencing untuk dropdown |
| label | varchar | |
| type | enum(`page`,`post_category`,`external_url`) | menentukan target link |
| target_page_id | int, FK → `pages.id`, nullable | |
| target_category_id | int, FK → `post_categories.id`, nullable | |
| external_url | varchar, nullable | |
| order | int | urutan tampil |
| **index** | (`unit_id`, `order`) | mempercepat query render navbar |

### Tabel `pages`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int, PK | |
| unit_id | int, FK → `units.id` | |
| slug | varchar | |
| title | varchar | |
| content | text/json | isi dari rich editor |
| status | enum(`draft`,`published`) | |
| created_by | int, FK → `users.id` | |
| published_at | datetime, nullable | |
| created_at, updated_at | datetime | |
| **unique** | (`unit_id`, `slug`) | slug hanya perlu unik dalam satu unit |

### Tabel `posts` (Pengumuman/Berita)
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int, PK | |
| unit_id | int, FK → `units.id` | |
| category_id | int, FK → `post_categories.id`, nullable | |
| title | varchar | |
| slug | varchar | |
| content | text/json | |
| status | enum(`draft`,`published`) | |
| created_by | int, FK → `users.id` | |
| published_at | datetime, nullable | dipakai untuk filter periode |
| created_at, updated_at | datetime | |
| **unique** | (`unit_id`, `slug`) | |
| **index** | (`unit_id`, `category_id`, `published_at`) | mempercepat listing pengumuman dengan filter kategori & periode |

### Tabel `post_categories`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int, PK | |
| unit_id | int, FK → `units.id`, nullable | `null` = kategori global |
| name | varchar | |
| slug | varchar | |
| **unique** | (`unit_id`, `slug`) | |

### Tabel `media` (Galeri/Media Library terpusat)
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int, PK | |
| unit_id | int, FK → `units.id`, nullable | `null` = media global/bersama |
| folder_id | int, FK → `media_folders.id`, nullable | |
| filename | varchar | nama file asli |
| url | varchar | lokasi file tersimpan |
| mime_type | varchar | |
| size_bytes | int | |
| width, height | int, nullable | khusus gambar |
| alt_text | varchar, nullable | |
| uploaded_by | int, FK → `users.id` | |
| created_at | datetime | |
| **index** | (`unit_id`, `folder_id`) | mempercepat query grid galeri |

### Tabel `media_folders`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int, PK | |
| unit_id | int, FK → `units.id` | |
| name | varchar | |
| created_at | datetime | |

### Contoh Skema Sequelize (ringkas)

Biasanya tiap model ditulis di file terpisah (`models/user.js`, `models/unit.js`, dst) lalu asosiasi didaftarkan di `models/index.js`. Berikut contoh ringkas dalam satu file agar mudah dibaca:

```js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('superadmin', 'admin_unit'), defaultValue: 'admin_unit' },
  });

  const Unit = sequelize.define('Unit', {
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    themeColor: DataTypes.STRING,
    customCss: DataTypes.TEXT,
    templateKey: DataTypes.STRING,
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  // tabel pivot many-to-many User <-> Unit
  const UserUnit = sequelize.define('UserUnit', {}, { timestamps: false });

  const Menu = sequelize.define('Menu', {
    label: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('page', 'post_category', 'external_url'), allowNull: false },
    externalUrl: DataTypes.STRING,
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    indexes: [{ fields: ['unitId', 'order'] }],
  });

  const Page = sequelize.define('Page', {
    slug: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft' },
    publishedAt: DataTypes.DATE,
  }, {
    indexes: [{ unique: true, fields: ['unitId', 'slug'] }],
  });

  const Post = sequelize.define('Post', {
    slug: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft' },
    publishedAt: DataTypes.DATE,
  }, {
    indexes: [
      { unique: true, fields: ['unitId', 'slug'] },
      { fields: ['unitId', 'categoryId', 'publishedAt'] },
    ],
  });

  const PostCategory = sequelize.define('PostCategory', {
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
  }, {
    indexes: [{ unique: true, fields: ['unitId', 'slug'] }],
  });

  const Media = sequelize.define('Media', {
    filename: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    mimeType: { type: DataTypes.STRING, allowNull: false },
    sizeBytes: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    altText: DataTypes.STRING,
  }, {
    indexes: [{ fields: ['unitId', 'folderId'] }],
  });

  const MediaFolder = sequelize.define('MediaFolder', {
    name: { type: DataTypes.STRING, allowNull: false },
  });

  // --- Asosiasi ---
  User.belongsToMany(Unit, { through: UserUnit, foreignKey: 'userId' });
  Unit.belongsToMany(User, { through: UserUnit, foreignKey: 'unitId' });

  Unit.hasMany(Menu, { foreignKey: 'unitId' });
  Menu.belongsTo(Unit, { foreignKey: 'unitId' });
  Menu.hasMany(Menu, { as: 'children', foreignKey: 'parentId' });
  Menu.belongsTo(Menu, { as: 'parent', foreignKey: 'parentId' });
  Menu.belongsTo(Page, { as: 'targetPage', foreignKey: 'targetPageId' });
  Menu.belongsTo(PostCategory, { as: 'targetCategory', foreignKey: 'targetCategoryId' });

  Unit.hasMany(Page, { foreignKey: 'unitId' });
  Page.belongsTo(Unit, { foreignKey: 'unitId' });
  Page.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });

  Unit.hasMany(Post, { foreignKey: 'unitId' });
  Post.belongsTo(Unit, { foreignKey: 'unitId' });
  Post.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
  PostCategory.hasMany(Post, { foreignKey: 'categoryId' });
  Post.belongsTo(PostCategory, { foreignKey: 'categoryId' });

  Unit.hasMany(Media, { foreignKey: 'unitId' });
  Media.belongsTo(Unit, { foreignKey: 'unitId' });
  Media.belongsTo(User, { as: 'uploader', foreignKey: 'uploadedBy' });
  MediaFolder.hasMany(Media, { foreignKey: 'folderId' });
  Media.belongsTo(MediaFolder, { foreignKey: 'folderId' });
  Unit.hasMany(MediaFolder, { foreignKey: 'unitId' });
  MediaFolder.belongsTo(Unit, { foreignKey: 'unitId' });

  return { User, Unit, UserUnit, Menu, Page, Post, PostCategory, Media, MediaFolder };
};
```

### Role & Permission

Tidak lagi memakai `spatie/laravel-permission` karena backend sudah Express murni. Digunakan **CASL** untuk mendefinisikan ability berbasis role dan kepemilikan unit:

- **Superadmin**: ability `manage` ke semua resource (`Unit`, `Post`, `Page`, `Media`, `Menu`) tanpa batasan `unit_id`.
- **Admin unit**: ability `manage` ke `Post`, `Page`, `Media`, `Menu` **hanya jika** `resource.unit_id === user.unit_id`. Ini termasuk ability `create` untuk `Page` — admin unit boleh membuat sub-halaman baru sendiri (bukan hanya mengisi template yang sudah disediakan superadmin), selama halaman tersebut berada di bawah `unit_id` miliknya.
- Definisi ability ini dipakai dua kali: di middleware Express (blokir request yang tidak diizinkan) dan di komponen React (sembunyikan tombol/menu yang tidak relevan) — tanpa duplikasi logic otorisasi.

## 5. Modul Media/Galeri Terpusat (Konsep ala WordPress)

Semua pengelolaan gambar dan file disatukan dalam satu Media Library, tidak upload langsung tersebar di tiap form konten:

1. **Upload terpusat** — halaman "Galeri/Media Library" di admin panel menampilkan grid semua file yang pernah diunggah unit tersebut (atau semua unit untuk superadmin), dengan fitur upload baru, cari, filter tipe file, dan hapus.
2. **Integrasi ke Rich Editor** — saat mengetik konten (halaman atau pengumuman) dan ingin menyisipkan gambar, admin klik tombol "Insert Image" di toolbar Tiptap/Lexical → muncul modal Media Library → pilih gambar yang sudah ada, atau upload baru dari modal tersebut → gambar otomatis tersisip ke konten dengan URL dari server.
3. **Reuse aset** — karena terpusat, gambar yang sama (misal logo, foto gedung) bisa dipakai berulang di banyak halaman/pengumuman tanpa upload ulang.
4. **Scoping akses** — admin unit hanya melihat media miliknya sendiri di modal galeri; superadmin bisa melihat semua unit sekaligus media global (aset bersama seperti logo universitas).
5. **Optimisasi** — thumbnail otomatis dibuat dengan `sharp` saat upload, supaya grid galeri tetap cepat dimuat meski filenya besar.

## 6. Strategi Navbar

Pendekatan **hybrid**, bukan navbar yang sama persis untuk semua unit dan bukan pula website yang terasa sepenuhnya terpisah:

- **Navbar induk (global)**: tampil sebagai top-bar di semua halaman, berisi identitas Universitas Andalas dan breadcrumb (contoh: "Universitas Andalas › Perpustakaan"). Menjaga kesatuan identitas dan konsistensi branding/SEO.
- **Navbar utama per unit**: di-generate secara dinamis dari tabel `menus` berdasarkan `unit_id`, diambil lewat API dan dirender lewat komponen React yang sama (`<Navbar menus={...} theme={...} />`) untuk semua unit — sehingga setiap unit bisa punya menu yang benar-benar berbeda tanpa perlu halaman/layout kode yang terpisah.

## 7. Strategi Kustomisasi Style per Unit

Kustomisasi tampilan berbeda-beda antar unit dapat dilakukan bertahap, dari yang paling mudah dikelola sampai yang paling bebas:

| Level | Pendekatan | Cocok untuk | Catatan |
|---|---|---|---|
| 1 | **Theme token** — kolom `primary_color`, `font_heading`, `logo` di tabel `units`, di-inject sebagai CSS variable ke komponen React | Mayoritas unit | Paling aman & mudah dikelola admin lewat color picker; struktur layout tetap sama |
| 2 | **Pilihan layout/template** — beberapa varian layout React siap pakai (`LayoutClassic`, `LayoutSidebar`, dst), admin unit tinggal memilih | Unit yang butuh struktur halaman berbeda | Tidak perlu develop ulang tiap unit baru |
| 3 | **Custom CSS per unit** — field `custom_css` per unit yang di-inject ke halaman unit tersebut | Unit yang butuh override detail | Rawan XSS/CSS rusak jika tidak disanitasi; batasi hak akses |
| 4 | **Template kode custom per unit** — komponen React khusus didaftarkan lewat registry (`unit.template_key`) | Unit strategis (misal landing utama Bidang Akademik) | Paling bebas tapi butuh campur tangan developer tiap unit |

**Rekomendasi**: gunakan kombinasi **Level 1 + Level 2** sebagai default untuk seluruh unit — cukup fleksibel dan tetap self-service bagi admin unit tanpa melibatkan developer. Level 4 disediakan khusus untuk unit-unit yang memang butuh desain unik.

## 8. Kebutuhan Spesifik Modul untuk Unit Bidang Akademik

Berdasarkan analisis situs existing `akademik.unand.ac.id`, unit Bidang Akademik membutuhkan modul lebih dari sekadar halaman statis:

1. **Modul Pengumuman/Berita** — konten bertanggal dengan kategori (misal: Pendaftaran, Hasil Seleksi, Kerjasama), memakai tabel `posts` dan `post_categories`. Contoh konten nyata di situs asli: prosedur registrasi mahasiswa baru (SIMA UNAND), pengumuman hasil seleksi SMMPTN/SNBT.
2. **Filter periode pengumuman** — daftar pengumuman bisa difilter berdasarkan rentang waktu (hari ini, kemarin, minggu ini, minggu lalu, bulan ini, bulan lalu, semua), diimplementasikan sebagai query filter pada `published_at`.
3. **Halaman statis** — profil bidang, visi-misi, struktur organisasi, menggunakan tabel `pages`.
4. **Unduhan/dokumen** — formulir pendaftaran, panduan registrasi, SK, dikelola lewat Media Library (tabel `media`) dan ditautkan dari konten pengumuman/halaman.
5. **Kalender akademik** — bisa berupa halaman statis (`pages`) berisi tabel/gambar kalender.
6. **Kontak & lokasi** — bagian dari halaman statis unit, berisi alamat, telepon, fax, email.
7. **Visitor counter/statistik pengunjung** — bisa diimplementasikan sederhana dengan tabel `page_views` yang mencatat kunjungan per unit atau per halaman, ditampilkan di footer.
8. **Menu navigasi khusus unit Akademik** — mengikuti kategori konten di atas (Pengumuman, Pendaftaran, Kalender Akademik, Kerjasama, Unduhan).

## 9. Pembagian Area Aplikasi

1. **Public site (per unit)** — React SPA, route `/{unit_slug}` mengambil data dari `GET /api/units/:slug`, merender layout, menu, dan konten unit tersebut.
2. **Admin panel** — React SPA terpisah (bisa di path `/admin/*` pada aplikasi yang sama atau app terpisah), berisi:
   - Dashboard ringkasan
   - CRUD menu (drag-and-drop reorder dengan dnd-kit)
   - CRUD konten & pengumuman (rich editor Tiptap/Lexical + Media Library), termasuk membuat sub-halaman baru secara bebas (tidak dibatasi hanya mengisi template yang sudah ada)
   - Media Library/Galeri terpusat
   - Manajemen unit dan admin (khusus superadmin)

## 10. Tahapan Implementasi

1. **Skeleton & struktur inti** — setup Express + Sequelize, autentikasi JWT, definisi ability CASL, migration tabel `units` (via Sequelize CLI/migrations), dan routing API dasar.
2. **Content management** — model dan CRUD untuk `pages`/`content_blocks` per unit, termasuk editor konten dan status publish/draft.
3. **Modul Pengumuman/Berita** — model dan CRUD untuk `posts` dan `post_categories`, termasuk listing dengan filter periode.
4. **Media Library/Galeri** — model `media`/`media_folders`, endpoint upload (`multer` + `sharp`), dan komponen Media Library Modal yang terhubung ke rich editor.
5. **Menu management dinamis** — tabel `menus` dengan relasi `unit_id` dan `parent_id`, serta komponen React untuk merender navbar induk dan navbar unit dari data tersebut.
6. **Admin panel (React SPA)** — halaman admin dengan scoping otomatis sesuai unit milik admin yang login (via CASL ability).
7. **Role & permission enforcement** — penerapan ability superadmin dan admin unit di middleware Express, bukan hanya di UI.
8. **Theming ringan per unit (opsional)** — kolom warna/logo per unit yang diteruskan sebagai props ke komponen React untuk identitas visual tiap unit.
9. **Caching, SEO, deployment** — caching struktur menu/unit yang jarang berubah, pengaturan meta tag dinamis per unit (react-helmet-async), serta persiapan deployment (reverse proxy, storage file, invalidasi cache saat konten berubah).

## 11. Hal yang Masih Perlu Diputuskan Lebih Lanjut

- Struktur folder proyek yang detail (pemisahan backend Express dan frontend React, apakah monorepo atau repo terpisah)
- Kebutuhan versioning/riwayat revisi konten (apakah perlu tabel `page_revisions`/`post_revisions` terpisah)
- Strategi SEO final untuk halaman publik (CSR murni vs pre-rendering vs migrasi sebagian ke SSR)
- Storage file: lokal disk vs object storage (S3-compatible) untuk Media Library