// Semua nama di bawah adalah konsep rangkaian, bukan klaim stok atau penjualan.
// Ganti gambar, harga, dan isConcept setelah katalog asli tersedia.
export const categories = [
  { slug: 'buket-bunga', name: 'Buket Bunga', image: 'bouquet', intro: 'Untuk perasaan yang paling personal.', description: 'Rangkaian genggam untuk hadiah kecil, ucapan terima kasih, dan momen penuh cinta.' },
  { slug: 'bunga-papan', name: 'Bunga Papan', image: 'board', intro: 'Ucapan yang hadir dengan istimewa.', description: 'Inspirasi bunga papan untuk perayaan, peresmian, dan ucapan selamat. Tulisan dan warna dapat dikonsultasikan.' },
  { slug: 'standing-flower', name: 'Standing Flower', image: 'standing', intro: 'Sebuah kehadiran yang anggun.', description: 'Rangkaian berdiri untuk menyambut tamu, merayakan pencapaian, atau melengkapi acara istimewa.' },
  { slug: 'bunga-meja', name: 'Bunga Meja', image: 'vase', intro: 'Kehangatan untuk setiap sudut.', description: 'Komposisi bunga dalam vas untuk hadiah, meja makan, ruang kerja, dan perayaan yang intim.' },
  { slug: 'bunga-duka-cita', name: 'Bunga Duka Cita', image: 'sympathy', intro: 'Simpati yang tulus, tanpa banyak kata.', description: 'Rangkaian bernuansa tenang untuk menyampaikan penghormatan dan mendampingi orang terdekat.' },
  { slug: 'bunga-pernikahan', name: 'Bunga Pernikahan', image: 'wedding', intro: 'Awal cerita yang indah.', description: 'Inspirasi bunga pengantin dengan komposisi lembut. Diskusikan palet dan konsep hari istimewa Anda.' },
];
export const occasions = [
  { slug: 'ulang-tahun', name: 'Ulang tahun', line: 'Untuk hari yang hanya miliknya.', symbol: '✷' },
  { slug: 'anniversary', name: 'Anniversary', line: 'Merayakan setiap bab bersama.', symbol: '♡' },
  { slug: 'wisuda', name: 'Wisuda', line: 'Untuk langkah yang baru.', symbol: '✧' },
  { slug: 'grand-opening', name: 'Grand opening', line: 'Awal baik, harapan baik.', symbol: '↗' },
  { slug: 'pernikahan', name: 'Pernikahan', line: 'Dua hati, satu cerita.', symbol: '∞' },
  { slug: 'belasungkawa', name: 'Belasungkawa', line: 'Hadir dalam ketulusan.', symbol: '❋' },
];
export const products = [
  { slug: 'senandung-blush', name: 'Senandung Blush', category: 'buket-bunga', image: 'bouquet', price: null, isConcept: true, featured: true, palette: 'Blush · Peach · Ivory', occasions: ['ulang-tahun', 'anniversary', 'wisuda'], description: 'Inspirasi buket mawar bernuansa blush dan peach, dipadukan dengan bunga ivory serta eucalyptus. Lembut, hangat, dan terasa personal untuk menyampaikan rasa sayang.', details: ['Komposisi: inspirasi mawar, lisianthus, dan foliage.', 'Wrapping ivory dengan pita bernuansa champagne.', 'Ukuran dan jumlah tangkai ditentukan saat konsultasi.'] },
  { slug: 'salam-bahagia', name: 'Salam Bahagia', category: 'bunga-papan', image: 'board', price: null, isConcept: true, featured: true, palette: 'Cream · Blush · Sage', occasions: ['grand-opening', 'pernikahan'], description: 'Inspirasi bunga papan dengan bingkai bunga yang lapang dan komposisi warna lembut. Area ucapan dapat disesuaikan dengan nama penerima, pesan, dan identitas pengirim.', details: ['Panel ucapan dapat dipersonalisasi.', 'Ukuran papan dan komposisi bunga dikonfirmasi bersama.', 'Pilihan warna dapat menyesuaikan tema acara.'] },
  { slug: 'rona-anggun', name: 'Rona Anggun', category: 'standing-flower', image: 'standing', price: null, isConcept: true, featured: true, palette: 'Ivory · Peach · Green', occasions: ['grand-opening', 'pernikahan'], description: 'Inspirasi standing flower dengan bunga ivory, mawar peach, dan alur anggrek yang ringan. Siluet tinggi yang elegan untuk memberikan sentuhan istimewa pada sebuah perayaan.', details: ['Komposisi inspirasi mawar, anggrek, dan foliage.', 'Tinggi rangkaian dan jenis penyangga sesuai kesepakatan.', 'Detail penempatan dan pengiriman dikonsultasikan terlebih dahulu.'] },
  { slug: 'hangat-senja', name: 'Hangat Senja', category: 'bunga-meja', image: 'vase', price: null, isConcept: true, featured: true, palette: 'Peach · Champagne · Sage', occasions: ['ulang-tahun', 'anniversary', 'grand-opening'], description: 'Inspirasi bunga meja dalam vas keramik berwarna ivory. Nuansa peach yang hangat bertemu dedaunan sage untuk menghadirkan suasana yang tenang dan akrab.', details: ['Inspirasi vas keramik dengan bentuk organik.', 'Bentuk vas mengikuti pilihan yang disepakati.', 'Ukuran dapat disesuaikan dengan meja atau ruangan.'] },
  { slug: 'peluk-hening', name: 'Peluk Hening', category: 'bunga-duka-cita', image: 'sympathy', price: null, isConcept: true, featured: false, palette: 'White · Ivory · Sage', occasions: ['belasungkawa'], description: 'Inspirasi rangkaian simpati bernuansa putih dan ivory. Komposisi yang tenang untuk menyampaikan penghormatan, doa, serta dukungan yang tulus.', details: ['Nuansa putih dan dedaunan yang lembut.', 'Pesan simpati dapat disertakan sesuai permintaan.', 'Waktu serta lokasi penyerahan dikonfirmasi saat pemesanan.'] },
  { slug: 'janji-ivory', name: 'Janji Ivory', category: 'bunga-pernikahan', image: 'wedding', price: null, isConcept: true, featured: false, palette: 'Ivory · White', occasions: ['pernikahan', 'anniversary'], description: 'Inspirasi buket pengantin dalam warna ivory, dengan detail bunga kecil dan pita yang jatuh lembut. Sebuah komposisi sederhana untuk hari yang penuh makna.', details: ['Inspirasi mawar ivory dan bunga putih bertekstur lembut.', 'Panjang pita serta palet dapat dikonsultasikan.', 'Ketersediaan jenis bunga mengikuti konfirmasi florist.'] },
];
export const benefits = [
  ['sprig', 'Sesuai ceritamu', 'Diskusikan warna, bentuk, ukuran, dan pesan untuk rangkaian yang terasa personal.'],
  ['flower', 'Keindahan bunga segar', 'Pilihan jenis bunga dan ketersediaannya dikonfirmasi bersama sebelum pesanan diproses.'],
  ['wa', 'Sesederhana bercerita', 'Pilih inspirasi, ceritakan kebutuhan, lalu konsultasikan semuanya melalui WhatsApp.'],
  ['pin', 'Sampai ke yang berarti', 'Sampaikan alamat dan tanggal tujuan. Area, jadwal, serta ongkos kirim dikonfirmasi lebih dahulu.'],
];
export const faqs = [
  ['Bagaimana cara memesan bunga?', 'Pilih rangkaian yang Anda suka, lalu klik Pesan via WhatsApp. Sampaikan momen, tanggal kebutuhan, alamat tujuan, dan anggaran. Kami akan membantu mengonfirmasi desain, harga, serta ketersediaannya.'],
  ['Apakah rangkaian bisa dibuat custom?', 'Anda dapat mendiskusikan warna, jenis bunga, ukuran, tulisan, dan referensi desain melalui WhatsApp. Detail akhir mengikuti ketersediaan bahan dan kesepakatan saat pemesanan.'],
  ['Mengapa harga belum tercantum?', 'Harga disesuaikan dengan jenis bunga, ukuran, desain, dan kebutuhan Anda. Hubungi kami untuk penawaran sebelum mengonfirmasi pesanan.'],
  ['Apakah melayani pengiriman di luar Jakarta?', 'Fokus layanan saat ini adalah Jakarta. Untuk lokasi di sekitar Jakarta, kirim alamat tujuan melalui WhatsApp agar cakupan layanan dan ongkos kirim dapat diperiksa.'],
  ['Bisa pesan untuk hari yang sama?', 'Ketersediaan pesanan pada hari yang sama perlu diperiksa terlebih dahulu. Sampaikan waktu kebutuhan Anda; pesanan diproses setelah jadwal, bahan, dan pengiriman disepakati.'],
  ['Apakah foto sama dengan rangkaian yang diterima?', 'Foto yang saat ini ditampilkan adalah visual inspirasi yang dibuat dengan AI. Gunakan sebagai referensi suasana dan warna. Desain, jenis bunga, ukuran, serta harga rangkaian akhir dikonfirmasi melalui WhatsApp.'],
];
