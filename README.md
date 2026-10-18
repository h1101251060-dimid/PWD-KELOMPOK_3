# Use Case
## Website E-Commerce Toko Baju

### Tujuan Aplikasi

Membantu pelanggan membeli produk baju secara online dengan menyediakan fitur katalog produk, pencarian produk, keranjang belanja, checkout, serta informasi status pesanan. Admin dapat mengelola produk, stok, dan pesanan melalui halaman admin.

Sebelum masuk ke HTML, CSS, dan jQuery, kita perlu memahami terlebih dahulu apa yang ingin dibuat, siapa yang akan menggunakannya, dan fitur apa saja yang dibutuhkan.

### 1. Cerita Pengguna (User Story)

**"Apa yang mau dibuat?"**

#### Studi Kasus

Sebuah toko baju ingin menyediakan layanan pembelian secara online melalui website agar pelanggan dapat melihat produk, memilih produk yang diinginkan, dan melakukan pembelian tanpa harus datang langsung ke toko.

Di sisi lain, admin membutuhkan halaman khusus untuk mengelola produk, stok, dan pesanan pelanggan agar proses pengelolaan toko dapat dilakukan dengan lebih mudah.

**Aktor:** Customer dan Admin

**Cerita Pengguna:**

Sebagai customer, saya ingin melihat dan memilih produk baju, memasukkannya ke keranjang, serta melakukan checkout agar saya dapat membeli baju secara online dengan mudah.

Sebagai admin, saya ingin mengelola produk, stok, dan pesanan agar produk yang tersedia dan pesanan pelanggan dapat dikelola dengan baik.

### 2. Daftar Use Case (Keinginan Pengguna)

#### a. Use Case 1 (UC-01): Melihat Produk

Customer dapat melihat katalog produk baju yang tersedia dan mencari produk berdasarkan nama. Customer juga dapat melihat detail produk serta memilih ukuran dan warna yang tersedia.

**Fitur:**
- Menampilkan katalog produk.
- Mencari produk berdasarkan nama.
- Melihat foto, nama, dan harga produk.
- Melihat detail produk.
- Memilih ukuran dan warna produk.
- Menampilkan informasi stok produk.

**Validasi:**
1. Sistem menampilkan daftar produk yang tersedia.
2. Setiap produk menampilkan informasi berupa foto, nama produk, dan harga.
3. Customer dapat mencari produk berdasarkan nama.
4. Customer dapat melihat detail produk.
5. Customer dapat memilih ukuran dan warna yang tersedia.
6. Jika produk tidak ditemukan, sistem menampilkan pesan bahwa produk tidak tersedia.
7. Jika stok produk habis, sistem menampilkan informasi bahwa produk sedang tidak tersedia.

#### b. Use Case 2 (UC-02): Mengelola Keranjang

Customer dapat memasukkan produk ke dalam keranjang dan mengatur jumlah produk yang ingin dibeli sebelum melakukan checkout.

**Fitur:**
- Menambahkan produk ke keranjang.
- Memilih ukuran dan warna produk.
- Mengubah jumlah produk.
- Menghapus produk dari keranjang.
- Menampilkan total harga belanja.

**Validasi:**
1. Customer harus memilih produk sebelum memasukkannya ke keranjang.
2. Customer harus memilih ukuran dan warna jika produk memiliki varian.
3. Jumlah produk yang dimasukkan harus lebih besar dari nol.
4. Jumlah produk yang dibeli tidak boleh melebihi stok yang tersedia.
5. Customer dapat mengubah jumlah produk di dalam keranjang.
6. Customer dapat menghapus produk dari keranjang.
7. Sistem menghitung total harga berdasarkan produk dan jumlah yang dipilih.

#### c. Use Case 3 (UC-03): Checkout Pesanan

Customer dapat melakukan checkout dengan mengisi data pembelian berupa nama lengkap, nomor HP, alamat pengiriman, dan metode pembayaran.

**Fitur:**
- Mengisi nama lengkap.
- Mengisi nomor HP.
- Mengisi alamat pengiriman.
- Memilih metode pembayaran.
- Melihat ringkasan pesanan.
- Melihat total pembayaran.
- Mendapatkan nomor pesanan setelah checkout berhasil.

**Validasi:**
1. Keranjang harus memiliki minimal satu produk.
2. Nama lengkap harus diisi.
3. Nomor HP harus diisi.
4. Alamat pengiriman harus diisi.
5. Customer harus memilih metode pembayaran.
6. Sistem menampilkan ringkasan produk dan total pembayaran sebelum pesanan dibuat.
7. Sistem memeriksa kembali ketersediaan stok sebelum pesanan diproses.
8. Jika stok tidak mencukupi, sistem menampilkan pesan kepada customer.
9. Jika data valid, sistem menyimpan pesanan.
10. Setelah pesanan berhasil dibuat, sistem menampilkan nomor pesanan kepada customer.

#### d. Use Case 4 (UC-04): Melihat Pesanan

Customer dapat melihat informasi dan status pesanan menggunakan nomor pesanan yang diperoleh setelah melakukan checkout.

Status pesanan terdiri dari **Diproses, Dikirim, dan Selesai**.

**Fitur:**
- Memasukkan nomor pesanan.
- Melihat detail produk yang dipesan.
- Melihat jumlah produk.
- Melihat total pembayaran.
- Melihat status pesanan.

**Validasi:**
1. Customer harus memasukkan nomor pesanan.
2. Sistem menampilkan informasi pesanan berdasarkan nomor pesanan yang dimasukkan.
3. Sistem menampilkan produk yang dipesan dan jumlahnya.
4. Sistem menampilkan total pembayaran.
5. Sistem menampilkan status terbaru dari pesanan.
6. Jika nomor pesanan tidak ditemukan, sistem menampilkan pesan bahwa pesanan tidak tersedia.

#### e. Use Case 5 (UC-05): Mengelola Toko

Admin dapat mengelola produk, stok, dan pesanan pelanggan melalui halaman admin.

**Fitur:**

**Pengelolaan Produk:**
- Melihat daftar produk.
- Menambah produk.
- Mengedit produk.
- Menghapus produk.
- Memperbarui stok produk.

**Pengelolaan Pesanan:**
- Melihat daftar pesanan.
- Melihat detail pesanan.
- Memperbarui status pesanan.

**Validasi:**
1. Admin dapat melihat daftar produk yang tersedia.
2. Admin dapat menambahkan produk baru.
3. Admin dapat mengubah informasi produk.
4. Admin dapat menghapus produk.
5. Admin dapat memperbarui jumlah stok produk.
6. Nama produk, harga, dan stok harus diisi saat menambahkan produk.
7. Harga produk harus lebih besar dari nol.
8. Stok produk tidak boleh bernilai negatif.
9. Admin dapat melihat daftar pesanan pelanggan.
10. Admin dapat melihat detail pesanan.
11. Admin dapat mengubah status pesanan menjadi Diproses, Dikirim, atau Selesai.
12. Perubahan produk dan stok ditampilkan pada katalog produk.

#### f. Use Case 6 (UC-06): Lacak Pesanan
Customer dapat melacak perkembangan pesanan menggunakan nomor pesanan yang diperoleh setelah melakukan checkout. Melalui fitur ini, customer dapat mengetahui tahapan pemrosesan pesanan, mulai dari pesanan diproses oleh admin, dikirim, hingga selesai.

**Fitur:**
-Memasukkan nomor pesanan untuk melakukan pelacakan.
-Menampilkan informasi nomor pesanan.
-Menampilkan ringkasan pesanan.
-Menampilkan status terkini pesanan.
-Menampilkan tahapan status pesanan, yaitu Diproses, Dikirim, dan Selesai.

**Validasi:**
1. Customer harus memasukkan nomor pesanan untuk melakukan pelacakan.
2. Sistem memeriksa apakah nomor pesanan tersedia.
3. Jika nomor pesanan ditemukan, sistem menampilkan informasi pesanan yang sesuai.
4. Sistem menampilkan status terkini pesanan berdasarkan data yang tersimpan.
5. Jika status pesanan adalah Diproses, sistem menampilkan bahwa pesanan sedang diproses oleh admin.
6. Jika status pesanan adalah Dikirim, sistem menampilkan bahwa pesanan sedang dalam perjalanan menuju customer.
7. Jika status pesanan adalah Selesai, sistem menampilkan bahwa pesanan telah selesai.
8. Jika nomor pesanan tidak ditemukan, sistem menampilkan pesan bahwa pesanan tidak tersedia.

### 3. Ringkasan Daftar Use Case

| Kode | Nama Use Case |
|---|---|
| UC-01 | Melihat Produk |
| UC-02 | Mengelola Keranjang |
| UC-03 | Checkout Pesanan |
| UC-04 | Melihat Pesanan |
| UC-05 | Mengelola Toko |

### 4. Alur Penggunaan Website

#### Customer

1. Customer membuka website e-commerce toko baju.
2. Customer melihat atau mencari produk yang tersedia.
3. Customer memilih produk, ukuran, dan warna.
4. Customer memasukkan produk ke dalam keranjang.
5. Customer mengatur jumlah produk dan melihat total harga.
6. Customer melakukan checkout.
7. Customer mengisi nama lengkap, nomor HP, alamat pengiriman, dan metode pembayaran.
8. Sistem memvalidasi data dan ketersediaan stok.
9. Jika berhasil, sistem membuat pesanan dan menampilkan nomor pesanan.
10. Customer menggunakan nomor pesanan untuk melihat status pesanan.
11. Customer dapat melihat status pesanan mulai dari Diproses, Dikirim, hingga Selesai.

#### Admin

1. Admin membuka halaman admin.
2. Admin melihat daftar produk dan pesanan.
3. Admin dapat menambah, mengedit, atau menghapus produk.
4. Admin dapat memperbarui stok produk.
5. Admin melihat detail pesanan pelanggan.
6. Admin memperbarui status pesanan sesuai proses pemesanan.
7. Perubahan produk, stok, dan status pesanan ditampilkan pada sistem.
