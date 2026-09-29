# Putri Florist

Website katalog responsif dalam HTML, CSS, dan JavaScript native. Tanpa framework, dependency browser, database, checkout, atau build bundler. Transaksi dikonsultasikan melalui WhatsApp.

## Jalankan & Build

```sh
npm run build
npm start
```

Buka http://localhost:4173. Alternatif untuk dev: `npm run dev`. Tidak perlu `npm install`.

`npm run build` menghasilkan output produksi yang bersih ke dalam folder `dist/`. Server lokal (`npm start`) menyajikan langsung folder `dist/`.

## Deployment (Cloudflare Pages)

Konfigurasi Cloudflare Pages:
- **Framework preset**: None
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Production branch**: `main`
- **Custom domain**: `https://putriflorist.id`

## Halaman

- `/`: hero yang sudah disetujui, kategori, produk pilihan, dokumentasi preview galeri karya, momen, cerita brand, keunggulan, testimoni, pengiriman, FAQ, CTA akhir, dan footer.
- `/produk`: enam inspirasi rangkaian; pencarian, filter kategori dan momen, reset, serta kondisi tanpa hasil. Filter tersimpan di query URL.
- `/produk/[slug]`: enam halaman detail dengan foto besar, tampilan detail bunga, lightbox, keterangan custom, dan WhatsApp yang memuat nama produk serta URL.
- `/kategori/[slug]`: enam halaman kategori dengan filter yang dibatasi ke kategori aktif.
- `/galeri`: 169 foto dokumentasi rangkaian nyata dari Mutiara Florist yang disesuaikan; filter kategori, pencarian real-time, lazy loading, dan modal lightbox dengan navigasi panah & WhatsApp consultation.
- `/tentang`: cerita brand dan cara memesan.
- `/kontak`: informasi yang tersedia serta formulir penyusun pesan WhatsApp. Tidak menyimpan data dan tidak otomatis mengirim pesan.
- Halaman 404 untuk rute tidak ditemukan.

## Sumber yang diedit

| File | Fungsi |
|---|---|
| `site-config.js` | Identitas bisnis, nomor WhatsApp, area, alamat, jam operasional, media sosial, domain, testimoni, dan konfigurasi video |
| `src/content.mjs` | Kategori, konsep produk, harga, momen, benefit, FAQ asli Putri Florist |
| `src/gallery-data.mjs` | Metadata 169 foto galeri (ID, judul, kategori, path WebP, alt text, urutan) |
| `src/render.mjs` | Template header (tanpa tombol WA di top bar), homepage, katalog, galeri, detail, Tentang, Kontak, dan footer |
| `site.css` | Styling Putri Florist dan galeri terintegrasi; tidak mengubah hero |
| `app.js` | Navigasi, filter, galeri & lightbox, formulir, dan CTA mengambang |
| `src/hero-approved.html` | Snapshot hero final; jangan diubah |
| `build.mjs` | Menghasilkan output produksi mandiri di `dist/` (18 HTML statis, scripts, css, assets) |

Folder `dist/` adalah hasil build produksi untuk deployment ke Cloudflare Pages. Edit file template/source, bukan isi `dist/`.

## Data asli dan placeholder

Nomor WhatsApp **+62 857-7371-0841** dan area **Jakarta** berasal dari pemilik. Tidak menyalin alamat, jam layanan, pengalaman bisnis, klaim pengiriman, atau testimoni dari situs referensi.

- Harga setiap produk masih `null` dan tampil **Tanya harga**. Isi angka rupiah di `src/content.mjs` untuk menampilkan harga mulai.
- Enam nama rangkaian adalah konsep katalog yang dapat diganti, bukan klaim stok atau produk terlaris. `isConcept: true` menandai visual konsep.
- Alamat, jam operasional, maps, dan media sosial tetap kosong. UI menampilkan keterangan konfirmasi/ketidaktersediaan yang sopan.
- `nearbyAreas: []`: area sekitar Jakarta tidak dijanjikan sampai dikonfirmasi. Isi hanya wilayah yang benar-benar dilayani.
- `testimonials: []`: section memakai empty state, tanpa bintang atau kutipan palsu. Ulasan asli memakai format `{ name, quote, approved: true }` dan ditampilkan setelah disetujui.
- `siteUrl`: diatur ke `https://putriflorist.id` untuk canonical dan Open Graph absolut. WhatsApp produk otomatis memakai host halaman yang sedang dibuka.

## Gambar

Tujuh visual baru dibuat dengan **built-in imagegen**: bouquet, flower board, standing flower, vase, sympathy wreath, bridal bouquet, dan atelier. Semua menggunakan arah ivory, peach/blush, sage, cahaya hangat, serta tekstur natural.

- Sumber: `assets/originals/*.png`.
- Aset web: `assets/catalog/*-480.webp` dan `*-960.webp` (14 file, total sekitar 1,25 MB).
- Prompt lengkap: `assets/catalog-prompts.json`.
- Gambar memiliki `srcset`, dimensi, alt, dan lazy loading kecuali gambar utama detail.
- Foto ditandai sebagai inspirasi AI, bukan dokumentasi produk asli atau lokasi toko.
- Poster hero tetap `assets/hero-poster.png`, tidak diubah.

Pengoptimalan opsional memerlukan sharp pada mesin pengembangan saja:

```sh
node scripts/optimize-assets.cjs /path/to/node_modules/sharp
```

## Hero final dan video

HTML hero serta stylesheet dasar disalin utuh dari snapshot yang disetujui. Header diperbarui terpisah. Tombol dan dialog konsultasi hero tetap berfungsi.

Video Seedance belum pernah berhasil dihasilkan: percobaan sebelumnya ditolak oleh Higgsfield karena akses paket. Website tetap memakai poster. Konfigurasi `video.src` tetap kosong, sehingga tidak ada MP4 palsu atau permintaan aset rusak. Brief asli dan storyboard tiga adegan tersedia di `assets/generation-brief.json`.

## Referensi struktur

Situs berikut ditinjau untuk struktur kategori, rangkaian, pemesanan WhatsApp, cara pesan, FAQ, dan kontak. Desain, aset, serta data bisnisnya tidak disalin:

- https://mutiaraflorist.id/
- https://puncakindah.id/

## Pemeriksaan

Dengan server berjalan:

```sh
node scripts/verify.mjs
```

Pemeriksaan mencakup kesamaan hero dengan snapshot, 18 judul unik, satu H1 per halaman, aset lokal, tautan dan fragment internal, 17 rute live, custom 404, MIME CSS, dan sintaks JavaScript.

Browser: homepage dan detail ditinjau pada desktop 1440 px; semua jenis halaman diperiksa pada lebar 320 dan 768 px tanpa overflow horizontal. Filter momen/kategori, pencarian tanpa hasil, reset, menu hamburger/Escape, lightbox, dan URL WhatsApp produk diperiksa. Tidak ada pesan WhatsApp yang dikirim selama pengujian.

Harga, katalog asli, alamat, jam layanan, media sosial, ulasan pelanggan, cakupan luar Jakarta, dan domain final perlu dilengkapi sebelum publikasi penuh.
