/* ==========================================================
   MONOKROM - Halaman admin (UC-05)
   ========================================================== */
$(function () {
  'use strict';

  var esc = Store.esc, rp = Store.rupiah;
  var photoData = '';
  var LOW = 5;

  function toast(msg, type) {
    var $t = $('#toast');
    $t.text(msg).removeClass('error').addClass(type === 'error' ? 'error' : '').addClass('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { $t.removeClass('show'); }, 2800);
  }
  function fmtDate(ts) {
    return new Date(ts).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  /* ---------- login / logout ---------- */
  function gate() {
    if (Store.isAdmin()) {
      $('#loginView').addClass('hidden');
      $('#dashView').removeClass('hidden');
      renderAll();
    } else {
      $('#dashView').addClass('hidden');
      $('#loginView').removeClass('hidden');
    }
  }
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    if (Store.login($.trim($('#lUser').val()), $('#lPass').val())) {
      $('#loginErr').text(''); $('#lPass').val(''); gate();
    } else {
      $('#loginErr').text('Username atau password salah.');
    }
  });
  $('#btnLogout').on('click', function (e) {
    e.preventDefault(); Store.logout(); gate();
  });

  /* ---------- tab ---------- */
  $('.tab').on('click', function () {
    var t = $(this).data('tab');
    $('.tab').removeClass('active'); $(this).addClass('active');
    $('#tab-produk, #tab-pesanan').addClass('hidden');
    $('#tab-' + t).removeClass('hidden');
  });

  function renderAll() { renderStats(); renderProducts(); renderOrders(); }

  function renderStats() {
    var p = Store.getProducts(), o = Store.getOrders();
    $('#stProd').text(p.length);
    $('#stOrder').text(o.length);
    $('#stProc').text(o.filter(function (x) { return x.status === 'Diproses'; }).length);
    $('#stLow').text(p.filter(function (x) { return x.stock <= LOW; }).length);
  }

  /* ==========================================================
     PRODUK
     ========================================================== */
  function renderProducts() {
    var q = $.trim($('#pSearch').val()).toLowerCase();
    var list = Store.getProducts().filter(function (p) { return p.name.toLowerCase().indexOf(q) > -1; });
    var $b = $('#productRows').empty();
    if (!list.length) {
      $b.html('<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:40px">Tidak ada produk.</td></tr>');
      return;
    }
    list.forEach(function (p) {
      var stockBadge = p.stock <= 0 ? ' <span class="badge low">Habis</span>' : (p.stock <= LOW ? ' <span class="badge low">Menipis</span>' : '');
      $b.append(
        '<tr data-id="' + esc(p.id) + '">' +
          '<td><img src="' + esc(p.photo) + '" alt=""></td>' +
          '<td><b>' + esc(p.name) + '</b></td>' +
          '<td>' + rp(p.price) + '</td>' +
          '<td style="color:var(--muted);font-size:.8rem">' + (p.sizes.join(', ') || '-') + '<br>' + (p.colors.join(', ') || '-') + '</td>' +
          '<td><div class="stock-edit"><input type="number" min="0" step="1" class="s-input" value="' + p.stock + '"><button class="btn btn-ghost btn-sm s-save">Simpan</button></div>' + stockBadge + '</td>' +
          '<td><div class="row-actions"><button class="btn btn-ghost btn-sm p-edit">Edit</button><button class="btn btn-danger btn-sm p-del">Hapus</button></div></td>' +
        '</tr>'
      );
    });
  }
  $('#pSearch').on('input', renderProducts);

  $('#productRows')
    .on('click', '.s-save', function () {
      var $tr = $(this).closest('tr');
      var res = Store.setStock($tr.data('id'), $tr.find('.s-input').val());
      if (!res.ok) { toast(res.msg, 'error'); return; }
      toast('Stok diperbarui.'); renderAll();
    })
    .on('click', '.p-edit', function () { openProductForm($(this).closest('tr').data('id')); })
    .on('click', '.p-del', function () {
      var $tr = $(this).closest('tr');
      var p = Store.getProduct($tr.data('id'));
      if (p && window.confirm('Hapus produk "' + p.name + '"? Tindakan ini tidak dapat dibatalkan.')) {
        Store.deleteProduct(p.id); toast('Produk dihapus.'); renderAll();
      }
    });

  /* ---------- form produk ---------- */
  function setPreview(src) {
    if (src) $('#pPreview').attr('src', src).removeClass('hidden');
    else $('#pPreview').addClass('hidden').removeAttr('src');
  }

  function openProductForm(id) {
    var p = id ? Store.getProduct(id) : null;
    $('.err[data-err]').text('');
    $('#pTitle').text(p ? 'Edit Produk' : 'Tambah Produk');
    $('#pId').val(p ? p.id : '');
    $('#pName').val(p ? p.name : '');
    $('#pPrice').val(p ? p.price : '');
    $('#pStock').val(p ? p.stock : '');
    $('#pDesc').val(p ? p.desc : '');
    $('#pColors').val(p ? p.colors.join(', ') : '');
    $('#pSizes input').each(function () { $(this).prop('checked', !!p && p.sizes.indexOf(this.value) > -1); });
    $('#pFile').val('');
    photoData = p ? p.photo : '';
    $('#pUrl').val(p && /^https?:/i.test(p.photo) ? p.photo : '');
    setPreview(photoData);
    openModal('#pModal');
  }
  $('#btnAddProduct').on('click', function () { openProductForm(null); });

  $('#pFile').on('change', function () {
    var f = this.files && this.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) { toast('File harus berupa gambar.', 'error'); this.value = ''; return; }
    var r = new FileReader();
    r.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var max = 700, s = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        photoData = c.toDataURL('image/jpeg', 0.82);
        $('#pUrl').val('');
        setPreview(photoData);
      };
      img.onerror = function () { toast('Gambar tidak dapat dibaca.', 'error'); };
      img.src = e.target.result;
    };
    r.readAsDataURL(f);
  });
  $('#pUrl').on('input', function () {
    var v = $.trim($(this).val());
    if (v) { photoData = v; $('#pFile').val(''); setPreview(v); }
  });

  $('#productForm').on('submit', function (e) {
    e.preventDefault();
    $('.err[data-err]').text('').closest('.field').removeClass('bad');
    var sizes = $('#pSizes input:checked').map(function () { return this.value; }).get();
    var colors = $.trim($('#pColors').val()).split(',').map(function (c) { return $.trim(c); }).filter(Boolean);
    var res = Store.saveProduct({
      id: $('#pId').val() || null,
      name: $('#pName').val(), price: $('#pPrice').val(), stock: $('#pStock').val(),
      desc: $('#pDesc').val(), sizes: sizes, colors: colors, photo: photoData
    });
    if (!res.ok) {
      if (res.errors) $.each(res.errors, function (k, m) { $('[data-err="' + k + '"]').text(m).closest('.field').addClass('bad'); });
      toast(res.msg, 'error');
      return;
    }
    closeModals(); toast('Produk disimpan.'); renderAll();
  });

  /* ==========================================================
     PESANAN
     ========================================================== */
  function renderOrders() {
    var q = $.trim($('#oSearch').val()).toLowerCase(), st = $('#oFilter').val();
    var list = Store.getOrders().filter(function (o) {
      var hit = !q || o.id.toLowerCase().indexOf(q) > -1 || o.customer.name.toLowerCase().indexOf(q) > -1;
      return hit && (!st || o.status === st);
    });
    var $b = $('#orderRows').empty();
    if (!list.length) {
      $b.html('<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:40px">Belum ada pesanan.</td></tr>');
      return;
    }
    list.forEach(function (o) {
      $b.append(
        '<tr data-id="' + esc(o.id) + '">' +
          '<td><b>' + esc(o.id) + '</b></td>' +
          '<td>' + fmtDate(o.createdAt) + '</td>' +
          '<td>' + esc(o.customer.name) + '</td>' +
          '<td>' + rp(o.total) + '</td>' +
          '<td>' + esc(o.payment) + '</td>' +
          '<td><span class="badge ' + esc(o.status) + '">' + esc(o.status) + '</span></td>' +
          '<td><button class="btn btn-ghost btn-sm o-detail">Detail</button></td>' +
        '</tr>'
      );
    });
  }
  $('#oSearch').on('input', renderOrders);
  $('#oFilter').on('change', renderOrders);

  $('#orderRows').on('click', '.o-detail', function () { openOrder($(this).closest('tr').data('id')); });

  function openOrder(id) {
    var o = Store.findOrder(id);
    if (!o) return;
    var items = o.items.map(function (it) {
      return '<div class="sum-item"><span>' + esc(it.name) + (it.size || it.color ? ' (' + [it.size, it.color].filter(Boolean).map(esc).join(', ') + ')' : '') + ' &times; ' + it.qty + '</span><span>' + rp(it.price * it.qty) + '</span></div>';
    }).join('');
    var opts = Store.STATUSES.map(function (s) { return '<option' + (s === o.status ? ' selected' : '') + '>' + s + '</option>'; }).join('');
    $('#oBody').html(
      '<h2>Detail Pesanan</h2>' +
      '<dl class="kv">' +
        '<dt>No. Pesanan</dt><dd><b>' + esc(o.id) + '</b></dd>' +
        '<dt>Tanggal</dt><dd>' + fmtDate(o.createdAt) + '</dd>' +
        '<dt>Nama</dt><dd>' + esc(o.customer.name) + '</dd>' +
        '<dt>No. HP</dt><dd>' + esc(o.customer.phone) + '</dd>' +
        '<dt>Alamat</dt><dd>' + esc(o.customer.address) + '</dd>' +
        '<dt>Pembayaran</dt><dd>' + esc(o.payment) + '</dd>' +
      '</dl>' +
      '<div class="items-list">' + items + '</div>' +
      '<div class="sum-total"><span>Total</span><span>' + rp(o.total) + '</span></div>' +
      '<div class="form-grid">' +
        '<div class="field full"><label for="oStatus">Status Pesanan</label><select id="oStatus">' + opts + '</select></div>' +
        '<div class="field"><label for="oCourier">Kurir</label><input type="text" id="oCourier" value="' + esc(o.courier) + '" placeholder="JNE / J&T / SiCepat"></div>' +
        '<div class="field"><label for="oResi">Nomor Resi</label><input type="text" id="oResi" value="' + esc(o.resi) + '"><small class="err" id="oErr"></small></div>' +
      '</div>' +
      '<div class="form-actions"><button class="btn btn-ghost" data-close type="button">Tutup</button><button class="btn btn-primary" id="oSave" data-id="' + esc(o.id) + '" type="button">Simpan Perubahan</button></div>'
    );
    openModal('#oModal');
  }

  $('#oBody').on('click', '#oSave', function () {
    var status = $('#oStatus').val(), courier = $.trim($('#oCourier').val()), resi = $.trim($('#oResi').val());
    if (status === 'Dikirim' && (!courier || !resi)) {
      $('#oErr').text('Isi kurir dan nomor resi untuk status Dikirim.');
      return;
    }
    var res = Store.updateOrder($(this).data('id'), { status: status, courier: courier, resi: resi });
    if (!res.ok) { toast(res.msg, 'error'); return; }
    closeModals(); toast('Status pesanan diperbarui.'); renderAll();
  });

  /* ---------- modal ---------- */
  function openModal(sel) { $(sel).addClass('open'); $('body').addClass('noscroll'); }
  function closeModals() { $('.modal').removeClass('open'); $('body').removeClass('noscroll'); }
  $(document).on('click', '[data-close]', closeModals);
  $('.modal').on('click', function (e) { if (e.target === this) closeModals(); });
  $(document).on('keydown', function (e) { if (e.key === 'Escape') closeModals(); });

  gate();
});