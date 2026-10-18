/* ==========================================================
   MONOKROM - Data layer (localStorage)
   Dipakai oleh halaman customer (index.html) dan admin (admin.html)
   ========================================================== */
var Store = (function () {
  'use strict';

  var KEY = {
    P: 'monokrom_products',
    C: 'monokrom_cart',
    O: 'monokrom_orders',
    A: 'monokrom_admin',
    SEED: 'monokrom_seeded_v1'
  };
  var PAYMENTS = ['Transfer Bank', 'E-Wallet', 'Bayar di Tempat (COD)'];
  var STATUSES = ['Diproses', 'Dikirim', 'Selesai'];
  var ADMIN_USER = 'admin';
  var ADMIN_PASS = 'admin123';

  /* ---------- util ---------- */
  function read(k, def) {
    try {
      var v = localStorage.getItem(k);
      return v ? JSON.parse(v) : def;
    } catch (e) { return def; }
  }
  function write(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  }
  function ok(extra) { return $.extend ? $.extend({ ok: true }, extra) : mix({ ok: true }, extra); }
  function mix(a, b) { for (var k in b) { if (b.hasOwnProperty(k)) a[k] = b[k]; } return a; }
  function fail(msg, extra) { return mix({ ok: false, msg: msg }, extra || {}); }
  function success(extra) { return mix({ ok: true }, extra || {}); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rupiah(n) {
    return 'Rp ' + Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /* ---------- foto placeholder (SVG, hitam putih) ---------- */
  function shirt(bg, fill, stroke, label, type) {
    var body = type === 'pants'
      ? 'M140 70 L260 70 L292 420 L215 420 L200 210 L185 420 L108 420 Z'
      : 'M130 70 L170 50 Q200 82 230 50 L270 70 L340 130 L305 175 L280 155 L280 400 L120 400 L120 155 L95 175 L60 130 Z';
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480">' +
      '<rect width="400" height="480" fill="' + bg + '"/>' +
      '<path d="' + body + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<text x="200" y="452" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" letter-spacing="8" fill="' + stroke + '">' + label + '</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ---------- seed data ---------- */
  function seed() {
    try { if (localStorage.getItem(KEY.SEED)) return; } catch (e) { return; }
    var S = ['S', 'M', 'L', 'XL'];
    var prods = [
      { id: 'p1', name: 'Kaos Oversize Basic', price: 129000, stock: 25, sizes: S, colors: ['Hitam', 'Putih'],
        desc: 'Kaos oversize berbahan cotton combed 24s yang adem dan tebal. Potongan boxy, cocok untuk harian.',
        photo: shirt('#1b1b1b', '#0a0a0a', '#8c8c8c', 'MONOKROM') },
      { id: 'p2', name: 'Kaos Lengan Panjang Abu', price: 159000, stock: 14, sizes: S, colors: ['Abu-abu', 'Hitam'],
        desc: 'Kaos lengan panjang dengan bahan rib lembut, nyaman dipakai berlapis.',
        photo: shirt('#2a2a2a', '#6f6f6f', '#d0d0d0', 'MONOKROM') },
      { id: 'p3', name: 'Kemeja Flannel Monokrom', price: 249000, stock: 9, sizes: S, colors: ['Hitam', 'Abu-abu'],
        desc: 'Kemeja flannel motif kotak hitam putih. Bahan tebal dan hangat dengan kancing depan penuh.',
        photo: shirt('#141414', '#3b3b3b', '#bdbdbd', 'FLANNEL') },
      { id: 'p4', name: 'Hoodie Zipper Hitam', price: 349000, stock: 12, sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Hitam'],
        desc: 'Hoodie zipper fleece 280gsm dengan kantong depan dan tali serut. Tebal tapi tidak gerah.',
        photo: shirt('#202020', '#050505', '#9a9a9a', 'HOODIE') },
      { id: 'p5', name: 'Jaket Bomber Polos', price: 399000, stock: 6, sizes: ['M', 'L', 'XL'], colors: ['Hitam'],
        desc: 'Jaket bomber water repellent dengan lining halus dan rib elastis di ujung lengan.',
        photo: shirt('#181818', '#0e0e0e', '#a5a5a5', 'BOMBER') },
      { id: 'p6', name: 'Celana Chino Slim', price: 279000, stock: 18, sizes: ['S', 'M', 'L', 'XL'], colors: ['Hitam', 'Abu-abu'],
        desc: 'Celana chino slim fit stretch, nyaman untuk kerja maupun santai.',
        photo: shirt('#1f1f1f', '#4a4a4a', '#c8c8c8', 'CHINO', 'pants') },
      { id: 'p7', name: 'Kemeja Oxford Putih', price: 259000, stock: 10, sizes: S, colors: ['Putih'],
        desc: 'Kemeja oxford putih klasik, kerah button-down dengan jahitan rapi.',
        photo: shirt('#d9d9d9', '#fbfbfb', '#555555', 'OXFORD') },
      { id: 'p8', name: 'Kaos Polos Putih Premium', price: 99000, stock: 0, sizes: S, colors: ['Putih'],
        desc: 'Kaos polos putih premium cotton combed 30s. Saat ini sedang habis, segera restock.',
        photo: shirt('#cfcfcf', '#ffffff', '#666666', 'BASIC') }
    ];
    write(KEY.P, prods);

    var now = Date.now();
    write(KEY.O, [
      { id: 'MK-DEMO0001', createdAt: now - 86400000 * 2, customer: { name: 'Budi Santoso', phone: '081234567890', address: 'Jl. Gajah Mada No. 12, Pontianak, Kalimantan Barat' },
        payment: 'Transfer Bank', items: [{ pid: 'p1', name: 'Kaos Oversize Basic', size: 'L', color: 'Hitam', price: 129000, qty: 2 }],
        total: 258000, status: 'Dikirim', courier: 'JNE', resi: 'JNE1234567890' },
      { id: 'MK-DEMO0002', createdAt: now - 3600000 * 5, customer: { name: 'Siti Rahma', phone: '085712345678', address: 'Jl. Ahmad Yani No. 45, Pontianak, Kalimantan Barat' },
        payment: 'Bayar di Tempat (COD)', items: [{ pid: 'p4', name: 'Hoodie Zipper Hitam', size: 'M', color: 'Hitam', price: 349000, qty: 1 }],
        total: 349000, status: 'Diproses', courier: '', resi: '' }
    ]);
    try { localStorage.setItem(KEY.SEED, '1'); } catch (e) {}
  }
  seed();

  /* ---------- produk ---------- */
  function getProducts() { return read(KEY.P, []); }
  function getProduct(id) {
    var l = getProducts();
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  }

  function saveProduct(d) {
    var errors = {};
    var name = String(d.name || '').trim();
    var price = Number(d.price);
    var stockRaw = d.stock === '' || d.stock == null ? NaN : Number(d.stock);
    if (!name) errors.name = 'Nama produk wajib diisi.';
    if (!d.photo) errors.photo = 'Foto produk wajib diisi.';
    if (d.price === '' || d.price == null || !isFinite(price) || price <= 0) errors.price = 'Harga harus berupa angka lebih dari nol.';
    if (!isFinite(stockRaw) || stockRaw < 0 || Math.floor(stockRaw) !== stockRaw) errors.stock = 'Stok harus berupa bilangan bulat dan tidak boleh negatif.';
    if (Object.keys(errors).length) return fail('Periksa kembali isian produk.', { errors: errors });

    var list = getProducts();
    var item = {
      id: d.id || ('p' + Date.now().toString(36)),
      name: name,
      price: Math.round(price),
      stock: stockRaw,
      desc: String(d.desc || '').trim(),
      sizes: d.sizes || [],
      colors: d.colors || [],
      photo: d.photo
    };
    var found = false;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === item.id) { list[i] = item; found = true; break; }
    }
    if (!found) list.unshift(item);
    if (!write(KEY.P, list)) return fail('Gagal menyimpan (penyimpanan browser penuh). Gunakan foto yang lebih kecil.');
    return success({ product: item });
  }

  function deleteProduct(id) {
    var list = getProducts().filter(function (p) { return p.id !== id; });
    write(KEY.P, list);
    return success();
  }

  function setStock(id, n) {
    n = Number(n);
    if (!isFinite(n) || n < 0 || Math.floor(n) !== n) return fail('Stok harus bilangan bulat dan tidak boleh negatif.');
    var list = getProducts();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) { list[i].stock = n; write(KEY.P, list); return success(); }
    }
    return fail('Produk tidak ditemukan.');
  }

  /* ---------- keranjang ---------- */
  function rawCart() { return read(KEY.C, []); }

  function normalizedCart() {
    var cart = rawCart();
    var clean = cart.filter(function (l) { return !!getProduct(l.pid); });
    if (clean.length !== cart.length) write(KEY.C, clean);
    return clean;
  }

  function qtyOf(cart, pid, exceptIndex) {
    var t = 0;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].pid === pid && i !== exceptIndex) t += cart[i].qty;
    }
    return t;
  }

  function addToCart(pid, size, color, qty) {
    var p = getProduct(pid);
    if (!p) return fail('Silakan pilih produk terlebih dahulu.');
    if (p.stock <= 0) return fail('Maaf, stok produk ini habis.');
    if (p.sizes.length && !size) return fail('Pilih ukuran terlebih dahulu.');
    if (p.colors.length && !color) return fail('Pilih warna terlebih dahulu.');
    qty = parseInt(qty, 10);
    if (!(qty > 0)) return fail('Jumlah produk harus lebih dari nol.');

    var cart = normalizedCart();
    var inCart = qtyOf(cart, pid, -1);
    if (inCart + qty > p.stock) {
      return fail('Jumlah melebihi stok. Stok tersedia ' + p.stock + ', sudah di keranjang ' + inCart + '.');
    }
    var merged = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].pid === pid && cart[i].size === (size || '') && cart[i].color === (color || '')) {
        cart[i].qty += qty; merged = true; break;
      }
    }
    if (!merged) cart.push({ pid: pid, size: size || '', color: color || '', qty: qty });
    write(KEY.C, cart);
    return success();
  }

  function updateQty(index, qty) {
    var cart = normalizedCart();
    var line = cart[index];
    if (!line) return fail('Item tidak ditemukan.');
    qty = parseInt(qty, 10);
    if (!(qty > 0)) return fail('Jumlah produk harus lebih dari nol. Gunakan tombol hapus untuk membuang item.');
    var p = getProduct(line.pid);
    var others = qtyOf(cart, line.pid, index);
    if (others + qty > p.stock) return fail('Jumlah melebihi stok. Stok tersedia: ' + p.stock + '.');
    line.qty = qty;
    write(KEY.C, cart);
    return success();
  }

  function removeItem(index) {
    var cart = normalizedCart();
    cart.splice(index, 1);
    write(KEY.C, cart);
    return success();
  }

  function clearCart() { write(KEY.C, []); }

  function cartCount() {
    return normalizedCart().reduce(function (s, l) { return s + l.qty; }, 0);
  }

  function cartDetail() {
    var cart = normalizedCart();
    var totals = {};
    cart.forEach(function (l) { totals[l.pid] = (totals[l.pid] || 0) + l.qty; });
    return cart.map(function (l, i) {
      var p = getProduct(l.pid);
      return {
        index: i, pid: l.pid, name: p.name, photo: p.photo, price: p.price,
        size: l.size, color: l.color, qty: l.qty, stock: p.stock,
        subtotal: p.price * l.qty, lack: totals[l.pid] > p.stock
      };
    });
  }

  function cartTotal() {
    return cartDetail().reduce(function (s, l) { return s + l.subtotal; }, 0);
  }

  /* ---------- pesanan ---------- */
  function getOrders() { return read(KEY.O, []).sort(function (a, b) { return b.createdAt - a.createdAt; }); }

  function newOrderId() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', id, existing = read(KEY.O, []);
    do {
      id = 'MK-';
      for (var i = 0; i < 8; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    } while (existing.some(function (o) { return o.id === id; }));
    return id;
  }

  function createOrder(data) {
    var lines = cartDetail();
    if (!lines.length) return fail('Keranjang masih kosong.');

    var errors = {};
    var name = String(data.name || '').trim();
    var phone = String(data.phone || '').replace(/[\s-]/g, '');
    var address = String(data.address || '').trim();
    if (!name) errors.name = 'Nama lengkap wajib diisi.';
    if (!phone) errors.phone = 'Nomor HP wajib diisi.';
    else if (!/^(\+?62|0)[0-9]{8,13}$/.test(phone)) errors.phone = 'Format nomor HP tidak valid (contoh: 081234567890).';
    if (!address) errors.address = 'Alamat pengiriman wajib diisi.';
    if (PAYMENTS.indexOf(data.payment) < 0) errors.payment = 'Pilih metode pembayaran.';

    // cek ulang stok
    var totals = {}, issues = [];
    lines.forEach(function (l) { totals[l.pid] = (totals[l.pid] || 0) + l.qty; });
    var prods = getProducts();
    prods.forEach(function (p) {
      if (totals[p.id] && totals[p.id] > p.stock) {
        issues.push({ name: p.name, stock: p.stock, qty: totals[p.id] });
      }
    });

    if (Object.keys(errors).length || issues.length) {
      return fail('Pesanan belum bisa dibuat.', { errors: errors, stockIssues: issues });
    }

    // kurangi stok
    prods.forEach(function (p) { if (totals[p.id]) p.stock -= totals[p.id]; });
    if (!write(KEY.P, prods)) return fail('Gagal menyimpan pesanan.');

    var order = {
      id: newOrderId(),
      createdAt: Date.now(),
      customer: { name: name, phone: phone, address: address },
      payment: data.payment,
      items: lines.map(function (l) {
        return { pid: l.pid, name: l.name, size: l.size, color: l.color, price: l.price, qty: l.qty };
      }),
      total: lines.reduce(function (s, l) { return s + l.subtotal; }, 0),
      status: 'Diproses', courier: '', resi: ''
    };
    var orders = read(KEY.O, []);
    orders.push(order);
    write(KEY.O, orders);
    clearCart();
    return success({ order: order });
  }

  function findOrder(id) {
    id = String(id || '').trim().toUpperCase();
    if (!id) return null;
    var orders = read(KEY.O, []);
    for (var i = 0; i < orders.length; i++) if (orders[i].id === id) return orders[i];
    return null;
  }

  function updateOrder(id, patch) {
    var orders = read(KEY.O, []);
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].id === id) {
        if (patch.status && STATUSES.indexOf(patch.status) < 0) return fail('Status tidak valid.');
        mix(orders[i], patch);
        write(KEY.O, orders);
        return success({ order: orders[i] });
      }
    }
    return fail('Pesanan tidak ditemukan.');
  }

  /* ---------- admin auth ---------- */
  function login(u, p) {
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      try { sessionStorage.setItem(KEY.A, '1'); } catch (e) {}
      return true;
    }
    return false;
  }
  function logout() { try { sessionStorage.removeItem(KEY.A); } catch (e) {} }
  function isAdmin() { try { return sessionStorage.getItem(KEY.A) === '1'; } catch (e) { return false; } }

  var api = {
    PAYMENTS: PAYMENTS, STATUSES: STATUSES,
    esc: esc, rupiah: rupiah,
    getProducts: getProducts, getProduct: getProduct, saveProduct: saveProduct,
    deleteProduct: deleteProduct, setStock: setStock,
    addToCart: addToCart, updateQty: updateQty, removeItem: removeItem,
    clearCart: clearCart, cartCount: cartCount, cartDetail: cartDetail, cartTotal: cartTotal,
    getOrders: getOrders, createOrder: createOrder, findOrder: findOrder, updateOrder: updateOrder,
    login: login, logout: logout, isAdmin: isAdmin
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  return api;
})();