/* ==========================================================
   MONOKROM - Halaman customer (UC-01 s/d UC-04)
   ========================================================== */
$(function () {
  'use strict';

  var esc = Store.esc, rp = Store.rupiah;
  var VIEWS = ['katalog', 'keranjang', 'checkout', 'pesanan', 'sukses'];
  var sel = { pid: null, size: null, color: null };

  /* ---------- helper ---------- */
  function toast(msg, type) {
    var $t = $('#toast');
    $t.text(msg).removeClass('error').addClass(type === 'error' ? 'error' : '').addClass('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { $t.removeClass('show'); }, 3000);
  }
  function badge() { $('#cartCount').text(Store.cartCount()); }
  function fmtDate(ts) {
    return new Date(ts).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  function ss(k, v) {
    try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) {}
  }

  /* ---------- running strip ---------- */
  (function () {
    var t = 'MONOKROM &nbsp;&bull;&nbsp; HITAM PUTIH &nbsp;&bull;&nbsp; GRATIS RETUR 7 HARI &nbsp;&bull;&nbsp; KUALITAS PREMIUM &nbsp;&bull;&nbsp; ';
    $('#strip').html(new Array(9).join(t));
  })();

  /* ---------- routing ---------- */
  function route() {
    var h = (location.hash || '#katalog').replace('#', '');
    if (VIEWS.indexOf(h) < 0) h = 'katalog';
    if (h === 'checkout' && !Store.cartDetail().length) {
      toast('Keranjang masih kosong.', 'error');
      location.hash = '#keranjang';
      return;
    }
    if (h === 'sukses' && !ss('monokrom_last')) { location.hash = '#katalog'; return; }

    $('.view').addClass('hidden');
    $('#view-' + h).removeClass('hidden');
    $('.nav a').removeClass('active').filter('[data-route="' + h + '"]').addClass('active');

    if (h === 'katalog') renderCatalog();
    if (h === 'keranjang') renderCart();
    if (h === 'checkout') renderCheckout();
    if (h === 'sukses') renderSuccess();
    if (h === 'pesanan') {
      var pre = ss('monokrom_prefill');
      if (pre) {
        $('#trackInput').val(pre);
        ss('monokrom_prefill', '');
        doTrack(pre);
      }
    }
    badge();
    window.scrollTo(0, 0);
  }
  $(window).on('hashchange', route);

  /* ==========================================================
     UC-01  KATALOG
     ========================================================== */
  function renderCatalog() {
    var q = $.trim($('#search').val()).toLowerCase();
    var all = Store.getProducts();
    var list = all.filter(function (p) { return p.name.toLowerCase().indexOf(q) > -1; });
    var $g = $('#productGrid').empty();

    if (!list.length) {
      $('#noResult').removeClass('hidden');
      $('#noResult h3').text(all.length ? 'Produk tidak ditemukan' : 'Belum ada produk');
      $('#noResult p').text(all.length ? 'Tidak ada produk yang cocok dengan "' + $.trim($('#search').val()) + '".' : 'Produk akan segera tersedia.');
      $('#resultInfo').text('');
      return;
    }
    $('#noResult').addClass('hidden');
    $('#resultInfo').text(list.length + ' produk' + (q ? ' ditemukan' : ' tersedia'));

    list.forEach(function (p) {
      var out = p.stock <= 0;
      var tag = out ? '<span class="tag dark">Stok Habis</span>' : (p.stock <= 5 ? '<span class="tag">Sisa ' + p.stock + '</span>' : '');
      $g.append(
        '<article class="card' + (out ? ' soldout' : '') + '" data-id="' + esc(p.id) + '">' +
          '<div class="thumb"><img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" loading="lazy">' + tag + '</div>' +
          '<div class="info"><h3>' + esc(p.name) + '</h3><div class="price">' + rp(p.price) + '</div></div>' +
        '</article>'
      );
    });
  }

  $('#search').on('input', renderCatalog);
  $('#searchForm').on('submit', function (e) { e.preventDefault(); renderCatalog(); });
  $('#btnShop').on('click', function () {
    var el = document.getElementById('produk');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- detail produk (modal) ---------- */
  function openDetail(id) {
    var p = Store.getProduct(id);
    if (!p) return;
    var out = p.stock <= 0;
    sel = {
      pid: id,
      size: p.sizes.length === 1 ? p.sizes[0] : null,
      color: p.colors.length === 1 ? p.colors[0] : null
    };

    var sizes = p.sizes.map(function (s) {
      return '<button type="button" class="chip' + (sel.size === s ? ' active' : '') + '" data-size="' + esc(s) + '">' + esc(s) + '</button>';
    }).join('');
    var colors = p.colors.map(function (c) {
      return '<button type="button" class="chip' + (sel.color === c ? ' active' : '') + '" data-color="' + esc(c) + '">' + esc(c) + '</button>';
    }).join('');

    var html =
      '<div class="detail">' +
        '<div class="dimg"><img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '"></div>' +
        '<div class="dinfo">' +
          '<h2>' + esc(p.name) + '</h2>' +
          '<div class="price">' + rp(p.price) + '</div>' +
          '<p class="desc">' + esc(p.desc || 'Belum ada deskripsi.') + '</p>' +
          (out ? '<div class="notice warn">Stok produk ini sedang habis.</div>' : '') +
          (p.sizes.length ? '<div class="opt"><label>Ukuran</label><div class="chips" id="sizeChips">' + sizes + '</div></div>' : '') +
          (p.colors.length ? '<div class="opt"><label>Warna</label><div class="chips" id="colorChips">' + colors + '</div></div>' : '') +
          '<div class="opt"><label>Jumlah</label>' +
            '<div class="qty"><button type="button" id="dMinus">&minus;</button><input type="number" id="dQty" value="1" min="1"><button type="button" id="dPlus">+</button></div>' +
            '<span class="stock-note">' + (out ? 'Stok habis' : 'Stok: ' + p.stock) + '</span>' +
          '</div>' +
          '<button class="btn btn-primary btn-block" id="btnAdd"' + (out ? ' disabled' : '') + '>' + (out ? 'Stok Habis' : 'Tambah ke Keranjang') + '</button>' +
        '</div>' +
      '</div>';

    $('#modalBody').html(html);
    $('#modal').addClass('open');
    $('body').addClass('noscroll');
  }
  function closeModal() { $('#modal').removeClass('open'); $('body').removeClass('noscroll'); }

  $('#productGrid').on('click', '.card', function () { openDetail($(this).data('id')); });
  $('#modalClose').on('click', closeModal);
  $('#modal').on('click', function (e) { if (e.target === this) closeModal(); });
  $(document).on('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  $('#modalBody')
    .on('click', '[data-size]', function () {
      sel.size = String($(this).data('size'));
      $('#sizeChips .chip').removeClass('active'); $(this).addClass('active');
    })
    .on('click', '[data-color]', function () {
      sel.color = String($(this).data('color'));
      $('#colorChips .chip').removeClass('active'); $(this).addClass('active');
    })
    .on('click', '#dMinus', function () {
      var v = parseInt($('#dQty').val(), 10) || 1;
      $('#dQty').val(Math.max(1, v - 1));
    })
    .on('click', '#dPlus', function () {
      var p = Store.getProduct(sel.pid);
      var v = parseInt($('#dQty').val(), 10) || 0;
      if (p && v + 1 > p.stock) { toast('Jumlah tidak boleh melebihi stok (' + p.stock + ').', 'error'); return; }
      $('#dQty').val(v + 1);
    })
    .on('click', '#btnAdd', function () {
      var res = Store.addToCart(sel.pid, sel.size, sel.color, $('#dQty').val());
      if (!res.ok) { toast(res.msg, 'error'); return; }
      badge();
      closeModal();
      toast('Produk ditambahkan ke keranjang.');
    });

  /* ==========================================================
     UC-02  KERANJANG
     ========================================================== */
  function renderCart() {
    var lines = Store.cartDetail();
    var $b = $('#cartBody');
    if (!lines.length) {
      $b.html('<div class="empty"><h3>Keranjang kosong</h3><p>Belum ada produk di keranjangmu.</p><a href="#katalog" class="btn btn-primary">Lihat Katalog</a></div>');
      $('#cartSummary').addClass('hidden');
      return;
    }
    $('#cartSummary').removeClass('hidden');
    var html = '', total = 0, items = 0, warn = false;
    lines.forEach(function (l) {
      total += l.subtotal; items += l.qty;
      if (l.lack) warn = true;
      html +=
        '<div class="cart-row" data-i="' + l.index + '">' +
          '<img src="' + esc(l.photo) + '" alt="">' +
          '<div>' +
            '<h4>' + esc(l.name) + '</h4>' +
            '<div class="meta">' + [l.size && 'Ukuran ' + esc(l.size), l.color && esc(l.color)].filter(Boolean).join(' · ') + ' · ' + rp(l.price) + '</div>' +
            '<div class="qty"><button class="q-minus" type="button">&minus;</button><input class="q-input" type="number" min="1" value="' + l.qty + '"><button class="q-plus" type="button">+</button></div>' +
            (l.lack ? '<div class="err">Stok tersedia: ' + l.stock + '. Kurangi jumlah.</div>' : '') +
          '</div>' +
          '<div class="sub"><b>' + rp(l.subtotal) + '</b><button class="lnk q-del" type="button">Hapus</button></div>' +
        '</div>';
    });
    $b.html(html);
    $('#cartItems').text(items);
    $('#cartTotal').text(rp(total));
    $('#btnToCheckout').toggleClass('disabled', warn);
  }

  function changeQty(i, val) {
    var res = Store.updateQty(i, val);
    if (!res.ok) toast(res.msg, 'error');
    badge(); renderCart();
  }
  $('#cartBody')
    .on('click', '.q-minus', function () {
      var $r = $(this).closest('.cart-row'); changeQty($r.data('i'), (parseInt($r.find('.q-input').val(), 10) || 1) - 1);
    })
    .on('click', '.q-plus', function () {
      var $r = $(this).closest('.cart-row'); changeQty($r.data('i'), (parseInt($r.find('.q-input').val(), 10) || 0) + 1);
    })
    .on('change', '.q-input', function () {
      var $r = $(this).closest('.cart-row'); changeQty($r.data('i'), $(this).val());
    })
    .on('click', '.q-del', function () {
      Store.removeItem($(this).closest('.cart-row').data('i'));
      badge(); renderCart(); toast('Produk dihapus dari keranjang.');
    });
  $('#btnToCheckout').on('click', function (e) {
    if ($(this).hasClass('disabled')) { e.preventDefault(); toast('Sesuaikan jumlah produk dengan stok terlebih dahulu.', 'error'); }
  });

  /* ==========================================================
     UC-03  CHECKOUT
     ========================================================== */
  function clearErrors() {
    $('.err[data-err]').text('');
    $('.field').removeClass('bad');
    $('#stockAlert').addClass('hidden').empty();
  }

  function renderCheckout() {
    clearErrors();
    var lines = Store.cartDetail(), html = '', total = 0;
    lines.forEach(function (l) {
      total += l.subtotal;
      html += '<div class="sum-item"><span>' + esc(l.name) + (l.size ? ' (' + esc(l.size) + (l.color ? ', ' + esc(l.color) : '') + ')' : '') + ' &times; ' + l.qty + '</span><span>' + rp(l.subtotal) + '</span></div>';
    });
    $('#checkoutSummary').html(html);
    $('#checkoutTotal').text(rp(total));
  }

  $('#checkoutForm').on('submit', function (e) {
    e.preventDefault();
    clearErrors();
    var res = Store.createOrder({
      name: $('#cName').val(),
      phone: $('#cPhone').val(),
      address: $('#cAddress').val(),
      payment: $('input[name=payment]:checked').val()
    });

    if (res.ok) {
      ss('monokrom_last', res.order.id);
      badge();
      location.hash = '#sukses';
      return;
    }
    if (res.errors) {
      $.each(res.errors, function (k, m) {
        $('[data-err="' + k + '"]').text(m).closest('.field').addClass('bad');
      });
    }
    if (res.stockIssues && res.stockIssues.length) {
      var li = res.stockIssues.map(function (s) {
        return '<li>' + esc(s.name) + ': diminta ' + s.qty + ', stok tersisa ' + s.stock + '</li>';
      }).join('');
      $('#stockAlert').html('<strong>Stok tidak mencukupi.</strong><ul style="margin:6px 0 0 18px">' + li + '</ul><p style="margin-top:8px">Silakan sesuaikan jumlah di <a href="#keranjang" style="text-decoration:underline">keranjang</a>.</p>').removeClass('hidden');
      window.scrollTo(0, 0);
    }
    if (res.msg && !res.errors && !res.stockIssues) toast(res.msg, 'error');
    else if (res.errors && Object.keys(res.errors).length) toast('Lengkapi data pemesanan dengan benar.', 'error');
  });

  /* ---------- halaman sukses ---------- */
  function renderSuccess() {
    var o = Store.findOrder(ss('monokrom_last'));
    if (!o) { location.hash = '#katalog'; return; }
    var payNote = {
      'Transfer Bank': 'Lakukan transfer sesuai total pembayaran. Instruksi lengkap akan dikirim ke nomor HP-mu.',
      'E-Wallet': 'Selesaikan pembayaran melalui e-wallet. Tautan pembayaran akan dikirim ke nomor HP-mu.',
      'Bayar di Tempat (COD)': 'Siapkan uang tunai sebesar total pembayaran saat pesanan tiba.'
    }[o.payment] || '';
    $('#successBody').html(
      '<div class="check">&#10003;</div>' +
      '<h2>Pesanan Berhasil Dibuat</h2>' +
      '<p style="color:var(--muted);margin-top:6px">Simpan nomor pesananmu untuk melacak status pesanan.</p>' +
      '<div class="order-no">' + esc(o.id) + '</div>' +
      '<button class="btn btn-ghost btn-sm" id="btnCopy" type="button">Salin Nomor</button>' +
      '<div style="margin:26px 0 6px" class="sum-total"><span>Total Pembayaran</span><span>' + rp(o.total) + '</span></div>' +
      '<p style="color:var(--muted);font-size:.85rem;margin-bottom:24px"><b style="color:var(--text)">' + esc(o.payment) + '</b><br>' + payNote + '</p>' +
      '<a href="#pesanan" class="btn btn-primary" id="btnTrackNow">Lacak Pesanan</a> ' +
      '<a href="#katalog" class="btn btn-ghost">Belanja Lagi</a>'
    );
  }
  $('#successBody')
    .on('click', '#btnCopy', function () {
      var id = ss('monokrom_last');
      if (navigator.clipboard) { navigator.clipboard.writeText(id).then(function () { toast('Nomor pesanan disalin.'); }); }
      else { toast('Salin manual: ' + id); }
    })
    .on('click', '#btnTrackNow', function () { ss('monokrom_prefill', ss('monokrom_last')); });

  /* ==========================================================
     UC-04  LIHAT PESANAN
     ========================================================== */
  function doTrack(id) {
    var $r = $('#trackResult');
    id = $.trim(id);
    if (!id) { $r.html('<div class="notice warn">Masukkan nomor pesanan terlebih dahulu.</div>'); return; }
    var o = Store.findOrder(id);
    if (!o) {
      $r.html('<div class="empty"><h3>Pesanan tidak ditemukan</h3><p>Periksa kembali nomor pesanan <b>' + esc(id.toUpperCase()) + '</b>.</p></div>');
      return;
    }
    var idx = Store.STATUSES.indexOf(o.status);
    var steps = Store.STATUSES.map(function (s, i) {
      return '<div class="step' + (i <= idx ? ' done' : '') + (i === idx ? ' current' : '') + '"><div class="dot">' + (i + 1) + '</div>' + s + '</div>';
    }).join('');
    var items = o.items.map(function (it) {
      var p = Store.getProduct(it.pid);
      return '<div class="sum-item"><span>' + (p ? '' : '') + esc(it.name) + (it.size || it.color ? ' (' + [it.size, it.color].filter(Boolean).map(esc).join(', ') + ')' : '') + ' &times; ' + it.qty + '</span><span>' + rp(it.price * it.qty) + '</span></div>';
    }).join('');
    $r.html(
      '<div class="panel" style="max-width:720px">' +
        '<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;align-items:center">' +
          '<div><div class="lbl" style="margin:0">Nomor Pesanan</div><h2 style="letter-spacing:.1em">' + esc(o.id) + '</h2></div>' +
          '<span class="badge ' + esc(o.status) + '">' + esc(o.status) + '</span>' +
        '</div>' +
        '<div class="stepper">' + steps + '</div>' +
        '<dl class="kv">' +
          '<dt>Tanggal</dt><dd>' + fmtDate(o.createdAt) + '</dd>' +
          '<dt>Pembayaran</dt><dd>' + esc(o.payment) + '</dd>' +
          '<dt>Pengiriman</dt><dd>' + (o.resi ? esc(o.courier || 'Kurir') + ' — ' + esc(o.resi) : 'Belum ada nomor resi') + '</dd>' +
        '</dl>' +
        '<h3 class="lbl">Produk Dipesan</h3>' +
        '<div class="items-list">' + items + '</div>' +
        '<div class="sum-total"><span>Total Pembayaran</span><span>' + rp(o.total) + '</span></div>' +
      '</div>'
    );
  }
  $('#trackForm').on('submit', function (e) { e.preventDefault(); doTrack($('#trackInput').val()); });

  /* ---------- start ---------- */
  badge();
  if (!location.hash) location.hash = '#katalog'; else route();
  if (location.hash === '#katalog') route();
});