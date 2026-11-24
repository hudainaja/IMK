// StudiKu - Prototipe IMK Kelompok 1 (HTML, CSS, dan JS murni sederhana)
// ponytail: state disimpan langsung di DOM selama sesi berjalan; tambahkan localStorage/REST API SIAKAD UB hanya jika butuh penyimpanan permanen.

const SUBTITLES = {
  home: "Learning Path",
  banding: "Banding Jalur",
  nilai: "Input Nilai",
  krs: "Rencana KRS"
};

// Opsi pembanding lintas peminatan & lintas prodi FILKOM UB (Bab 1 Hal. 1 & Layar 3)
const DAFTAR_TARGET = ["ai", "rpl", "si"];
let indexTarget = 0;

const TARGET_JALUR = {
  ai: {
    nama: "AI & Automation Engineering",
    short: "AI & Automation",
    prodiBadge: "Pilihan 1 • TIF",
    persen: "✓ 75%",
    sksCocok: "18 <small>/ 24 SKS</small>",
    mkBaru: "4 <small>Matkul</small>",
    btnLabel: "Simulasi Ambil Jalur AI Ini",
    saran: "Pindah ke jalur <strong>AI &amp; Automation</strong> masih sangat aman dan <strong>tidak menghambat kelulusan</strong> jika mata kuliah prasyarat mulai diambil di <strong>Semester 4</strong> mendatang.",
    matkul: [
      ["Kecerdasan Artifisial Dasar", "Wajib Pokok", "3 SKS • Kode: CIF62002 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"],
      ["Machine Learning & Pola", "Lanjutan", "4 SKS • Kode: CIF62010 • Jadwal: Semester 5", "Prasyarat AI Dasar", "Masa Datang"],
      ["Probabilitas & Statistika Lanjut", "Statistika AI", "3 SKS • Kode: CIF62007 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"]
    ]
  },
  rpl: {
    nama: "Rekayasa Perangkat Lunak",
    short: "Software Eng",
    prodiBadge: "Pilihan 2 • TIF",
    persen: "✓ 83%",
    sksCocok: "20 <small>/ 24 SKS</small>",
    mkBaru: "3 <small>Matkul</small>",
    btnLabel: "Simulasi Ambil Jalur RPL Ini",
    saran: "Pindah ke jalur <strong>Rekayasa Perangkat Lunak</strong> memiliki kecocokan SKS tertinggi dan <strong>lulus tepat waktu</strong> mulai <strong>Semester 4</strong>.",
    matkul: [
      ["Analisis & Desain Perangkat Lunak", "Wajib Pokok", "3 SKS • Kode: CIF62021 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"],
      ["Pengujian Perangkat Lunak", "Lanjutan", "3 SKS • Kode: CIF62025 • Jadwal: Semester 5", "Prasyarat RPL", "Masa Datang"],
      ["Manajemen Proyek Perangkat Lunak", "Inti RPL", "3 SKS • Kode: CIF62029 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"]
    ]
  },
  si: {
    nama: "Enterprise & Data Analytics (Lintas Prodi SI)",
    short: "Sistem Informasi",
    prodiBadge: "Lintas Prodi • SI",
    persen: "✓ 67%",
    sksCocok: "16 <small>/ 24 SKS</small>",
    mkBaru: "5 <small>Matkul</small>",
    btnLabel: "Simulasi Ambil Jalur SI Ini",
    saran: "Eksplorasi lintas prodi ke <strong>Sistem Informasi</strong> memerlukan 5 mata kuliah tata kelola &amp; proses bisnis mulai <strong>Semester 4</strong>.",
    matkul: [
      ["Analisis Proses Bisnis", "Inti SI", "3 SKS • Kode: CSI62001 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"],
      ["Sistem Enterprise (ERP)", "Wajib Jalur", "3 SKS • Kode: CSI62014 • Jadwal: Semester 5", "Prasyarat APB", "Masa Datang"],
      ["Tata Kelola TI", "Wajib Jalur", "3 SKS • Kode: CSI62018 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"]
    ]
  }
};

// 1. Pindah antar 4 layar utama di dalam aplikasi
function bukaTab(namaTab) {
  document.querySelectorAll("main .screen").forEach((el) => el.classList.remove("active"));
  document.getElementById("screen-" + namaTab).classList.add("active");

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === namaTab);
  });

  document.getElementById("header-subtitle").textContent = SUBTITLES[namaTab] || "Learning Path";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 2. Masuk dari Layar 1 (Opening) ke Layar 2 (Home / Learning Path)
function masukAplikasi() {
  document.getElementById("screen-opening").classList.remove("active");
  document.getElementById("app-header").hidden = false;
  document.getElementById("app-main").hidden = false;
  document.getElementById("bottom-nav").hidden = false;
  bukaTab("home");
  tampilPesan("Selamat datang di StudiKu, Joseph!");
}

// 3. Status 6 FSM (Bab 3.1 Hal. 30): Loading spinner + cegah klik ganda (prevent double submission)
function jalankanLoading(tombol, aksiSelesai) {
  if (tombol.disabled) return;
  const labelEl = tombol.querySelector(".btn-label") || tombol;
  const teksAsli = labelEl.innerHTML;

  tombol.disabled = true;
  labelEl.innerHTML = '<span class="spinner" aria-hidden="true"></span> Menyimpan...';

  setTimeout(() => {
    tombol.disabled = false;
    labelEl.innerHTML = teksAsli;
    aksiSelesai();
  }, 450);
}

// 4. Notifikasi feedback singkat (Toast)
let toastTimer;
function tampilPesan(teks) {
  const toast = document.getElementById("toast");
  toast.textContent = teks;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
}

// 5. Fungsi murni hitung IPK dari array pasangan [sks, bobot]
function hitungIPKData(daftarNilai) {
  let totalMutu = 0;
  let totalSks = 0;
  for (const [sks, bobot] of daftarNilai) {
    totalMutu += sks * bobot;
    totalSks += sks;
  }
  return totalSks > 0 ? (totalMutu / totalSks).toFixed(2) : "0.00";
}

// 6. Kalkulasi Audit Nilai & pembaruan Dual-Signifier (Layar 2, 3, 4, 5)
function hitungAudit() {
  const rows = document.querySelectorAll(".mk-row");
  const daftarNilai = [];
  let mkTerinput = 0;
  let sksLulus = 0;
  let wajibUlang = 0;

  rows.forEach((row) => {
    const sks = Number(row.dataset.sks);
    const val = row.querySelector(".grade-select").value;
    if (val === "-") return;

    const bobot = Number(val);
    daftarNilai.push([sks, bobot]);
    mkTerinput += 1;
    if (bobot >= 2) sksLulus += sks;
    else wajibUlang += 1;
  });

  const ipk = hitungIPKData(daftarNilai);
  document.getElementById("audit-ipk").textContent = ipk;
  document.getElementById("home-ipk").textContent = ipk;
  document.getElementById("banding-ipk").textContent = ipk;
  document.getElementById("krs-ips").textContent = ipk;

  document.getElementById("audit-mk").textContent = 12 + mkTerinput;
  document.getElementById("audit-sks").textContent = 34 + sksLulus;
  document.getElementById("home-sks").textContent = 37 + sksLulus; // 54/144 SKS saat awal sesuai Bab 1.1
  document.getElementById("audit-ulang").textContent = wajibUlang;

  // Evaluasi otomatis prasyarat Matematika Diskrit (Syarat Min. C / bobot >= 2)
  const nilaiMatdis = Number(document.getElementById("select-matdis").value);
  const lulusMatdis = nilaiMatdis >= 2;

  document.getElementById("diag-matdis").hidden = lulusMatdis;
  document.getElementById("diag-count").textContent = (lulusMatdis ? 1 : 2) + " ISU TEMUAN";
  document.getElementById("home-perhatian").textContent = (lulusMatdis ? 1 : 2) + " Matkul";
  document.getElementById("sem2-badge").textContent = lulusMatdis ? "✓ Tuntas" : "↻ 1 Gagal";
  document.getElementById("sem2-badge").className = "tag " + (lulusMatdis ? "tag-success" : "tag-danger");
  document.getElementById("matdis-sub").textContent = lulusMatdis
    ? "CIF62003 • 3 SKS • ✓ Syarat terpenuhi"
    : "CIF62003 • 3 SKS • Perlu perbaikan";
  document.getElementById("badge-matdis-home").textContent = lulusMatdis ? "✓ Lulus" : "↻ Perlu Ulang";
  document.getElementById("badge-matdis-home").className = "tag " + (lulusMatdis ? "tag-success" : "tag-danger");
}

// 7. Kalkulasi real-time kuota SKS pada Layar 5 (maksimal 24 SKS)
function hitungKRS(changedBox) {
  const checks = document.querySelectorAll(".krs-check");
  let totalSks = 0;
  let totalMk = 0;

  checks.forEach((cb) => {
    if (cb.checked) {
      totalSks += Number(cb.value);
      totalMk += 1;
    }
  });

  if (totalSks > 24 && changedBox) {
    changedBox.checked = false;
    tampilPesan("! Melebihi batas maksimal 24 SKS.");
    return hitungKRS();
  }

  document.getElementById("krs-total-sks").textContent = totalSks;
  document.getElementById("krs-sisa-sks").textContent = 24 - totalSks;
  document.getElementById("krs-total-mk").textContent = totalMk + " Mata Kuliah";
  return { totalSks, totalMk };
}

// 8. Ganti jalur pembanding di Layar 3 (AI -> RPL -> Lintas Prodi SI)
function gantiTargetPembanding() {
  indexTarget = (indexTarget + 1) % DAFTAR_TARGET.length;
  const key = DAFTAR_TARGET[indexTarget];
  const d = TARGET_JALUR[key];

  document.getElementById("target-nama").textContent = d.nama;
  document.getElementById("target-prodi-badge").textContent = d.prodiBadge;
  document.getElementById("stat-persen").textContent = d.persen;
  document.getElementById("stat-sks-cocok").innerHTML = d.sksCocok;
  document.getElementById("stat-mk-baru").innerHTML = d.mkBaru;
  document.getElementById("advisor-text").innerHTML = d.saran;
  document.getElementById("btn-simulasi-label").textContent = d.btnLabel;

  document.getElementById("matrix-target-list").innerHTML = d.matkul.map(([nama, pil, info, status, sub]) => `
    <div class="matrix-item">
      <div>
        <strong>${nama} <span class="mini-pill-red">${pil}</span></strong>
        <p class="muted">${info}</p>
      </div>
      <div class="text-right">
        <span class="text-salmon-sm">● ${status}</span>
        <small class="block-muted">${sub}</small>
      </div>
    </div>
  `).join("");

  tampilPesan("Pembanding diubah ke: " + d.nama);
}

// ==================== EVENT LISTENERS ====================

document.getElementById("btn-go-sso").addEventListener("click", masukAplikasi);

document.getElementById("btn-logout").addEventListener("click", () => {
  document.getElementById("app-header").hidden = true;
  document.getElementById("app-main").hidden = true;
  document.getElementById("bottom-nav").hidden = true;
  document.getElementById("screen-opening").classList.add("active");
});

document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => bukaTab(btn.dataset.tab));
});

document.querySelectorAll("[data-goto]").forEach((btn) => {
  btn.addEventListener("click", () => bukaTab(btn.dataset.goto));
});

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => document.getElementById(btn.dataset.close).close());
});

// Filter Tahapan Semester (Layar 2)
document.querySelectorAll(".sem-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".sem-pill").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    const sem = pill.dataset.sem;
    document.querySelectorAll("#home-timeline .tl-item").forEach((item) => {
      item.hidden = sem !== "all" && item.dataset.sem !== sem;
    });
  });
});

// Notifikasi & Jadwal PA (Layar 2)
document.getElementById("btn-notif").addEventListener("click", () => {
  document.getElementById("notif-dot").hidden = true;
  tampilPesan("Pengingat: Bimbingan PA Kamis 15 Feb pukul 09:30 di Gedung F Lt. 6.");
});

document.getElementById("btn-sync-cal").addEventListener("click", (e) => {
  jalankanLoading(e.currentTarget, () => {
    document.getElementById("sync-cal-text").textContent = "✓ Tersinkron ke Google Kalender";
    tampilPesan("Jadwal bimbingan berhasil disinkronkan ke Google Kalender!");
  });
});

document.getElementById("btn-chat-pa").addEventListener("click", () => {
  tampilPesan("Membuka ruang konsultasi Dosen PA: Bapak Mahardeka Tri Ananta.");
});

// Komparasi & Simulasi Jalur (Layar 3)
document.getElementById("btn-ganti-target-top").addEventListener("click", gantiTargetPembanding);
document.getElementById("btn-toggle-target").addEventListener("click", gantiTargetPembanding);

document.getElementById("btn-simulasi-jalur").addEventListener("click", (e) => {
  const d = TARGET_JALUR[DAFTAR_TARGET[indexTarget]];
  jalankanLoading(e.currentTarget, () => {
    document.getElementById("home-jalur-nama").textContent = d.nama;
    document.getElementById("home-jalur-short").textContent = d.short;
    document.getElementById("banding-jalur-aktif").textContent = d.short;
    document.getElementById("compare-current").textContent = d.nama;
    document.getElementById("krs-jalur").textContent = d.short;
    bukaTab("krs");
    tampilPesan("Simulasi jalur " + d.short + " diterapkan ke draf Rencana KRS!");
  });
});

document.getElementById("btn-konsul-banding").addEventListener("click", () => {
  tampilPesan("Permohonan konsultasi pindah jalur dikirim ke Dosen PA.");
});

// Input Nilai & Validasi Form Bebas Error (Layar 4 & Bab 3.2)
document.getElementById("screen-nilai").addEventListener("change", (e) => {
  if (e.target.classList.contains("grade-select")) hitungAudit();
});

document.getElementById("btn-open-tambah").addEventListener("click", () => {
  document.getElementById("error-mk-nama").hidden = true;
  document.getElementById("dialog-tambah").showModal();
});

document.getElementById("form-tambah").addEventListener("submit", (e) => {
  e.preventDefault();
  const inputNama = document.getElementById("mk-nama-baru");
  const errorEl = document.getElementById("error-mk-nama");
  const nama = inputNama.value.trim();

  if (!nama) {
    errorEl.hidden = false;
    inputNama.focus();
    return;
  }
  errorEl.hidden = true;

  const sks = document.getElementById("mk-sks-baru").value;
  const nilai = document.getElementById("mk-nilai-baru").value;

  const row = document.createElement("div");
  row.className = "mk-row";
  row.dataset.sks = sks;

  const info = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = nama;
  const span = document.createElement("span");
  span.className = "mono-code";
  span.textContent = "MK Tambahan • " + sks + " SKS";
  info.append(strong, span);

  const select = document.createElement("select");
  select.className = "grade-select";
  [["4", "A"], ["3.5", "B+"], ["3", "B"], ["2.5", "C+"], ["2", "C"], ["1", "D"], ["0", "E"]].forEach(([val, huruf]) => {
    select.add(new Option(huruf, val, false, val === nilai));
  });

  row.append(info, select);
  document.getElementById("list-sem-2").appendChild(row);
  inputNama.value = "";
  document.getElementById("dialog-tambah").close();
  hitungAudit();
  tampilPesan("Mata kuliah " + nama + " berhasil ditambahkan.");
});

document.getElementById("btn-simpan-nilai").addEventListener("click", (e) => {
  jalankanLoading(e.currentTarget, () => {
    hitungAudit();
    bukaTab("krs");
    tampilPesan("Audit kurikulum selesai! Mengarahkan ke Rencana KRS.");
  });
});

// Penyusunan KRS, Error Prevention Matkul Terkunci, & Dialog Konfirmasi 4 Elemen (Layar 5)
document.getElementById("krs-list").addEventListener("change", (e) => {
  if (e.target.classList.contains("krs-check")) hitungKRS(e.target);
});

// Trigger Error Prevention (Bab 1.2 Layar 5 Hal. 17)
const lockedItem = document.getElementById("krs-locked-item");
function tampilBlokirPrasyarat() {
  tampilPesan("🔒 Diblokir: Prasyarat Keamanan Informasi belum tuntas (Menunggu nilai Jarkom keluar).");
}
lockedItem.addEventListener("click", tampilBlokirPrasyarat);
lockedItem.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    tampilBlokirPrasyarat();
  }
});

document.getElementById("btn-pilih-saran").addEventListener("click", () => {
  document.querySelectorAll(".krs-check[data-saran]").forEach((cb) => { cb.checked = true; });
  hitungKRS();
  tampilPesan("✓ Seluruh mata kuliah saran (18 SKS) dipilih.");
});

document.getElementById("btn-draft-pdf").addEventListener("click", () => {
  tampilPesan("Menyiapkan ekspor ringkasan draf Pra-KRS...");
  setTimeout(() => window.print(), 300);
});

// Buka Modal Dialog Konfirmasi 4 Elemen Wajib (Bab 3.2 Hal. 31-32)
document.getElementById("btn-ajukan-krs").addEventListener("click", () => {
  const { totalSks, totalMk } = hitungKRS();
  if (totalMk === 0) {
    tampilPesan("! Pilih minimal 1 mata kuliah sebelum mengunci KRS.");
    return;
  }
  document.getElementById("konfirmasi-judul").textContent =
    "Kunci Rencana Studi Semester 4 (" + totalSks + " SKS) & Kirim ke SIAM?";
  document.getElementById("konfirmasi-deskripsi").textContent =
    "Setelah dikunci, draf " + totalMk + " mata kuliah ini akan masuk ke antrean validasi Dosen PA (Mahardeka Tri Ananta, S.Kom., M.T., M.Sc.) dan tidak dapat diubah sebelum dibuka kembali oleh PA.";
  document.getElementById("dialog-konfirmasi").showModal();
});

document.getElementById("btn-konfirmasi-ya").addEventListener("click", (e) => {
  jalankanLoading(e.currentTarget, () => {
    document.getElementById("dialog-konfirmasi").close();
    document.getElementById("krs-status-badge").textContent = "✓ Terkunci di Antrean SIAM";
    document.getElementById("btn-kunci-label").textContent = "✓ Rencana KRS Terkunci & Terkirim";
    document.getElementById("btn-ajukan-krs").disabled = true;
    tampilPesan("✓ Rencana KRS resmi dikunci & dikirim ke antrean validasi Dosen PA!");
  });
});

// Self-check rumus IPK & inisialisasi awal
console.assert(hitungIPKData([[4, 4], [4, 3]]) === "3.50", "Self-check IPK harus 3.50");
hitungAudit();
hitungKRS();
