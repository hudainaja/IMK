// StudiKu - JavaScript murni sederhana tanpa library/framework
// ponytail: state disimpan langsung di DOM selama sesi berjalan; tambahkan localStorage/REST API SIAKAD UB hanya jika butuh penyimpanan permanen.

const SUBTITLES = {
  home: "Learning Path",
  banding: "Banding Jalur",
  nilai: "Input Nilai",
  krs: "Rencana KRS"
};

const TARGET_JALUR = {
  ai: {
    nama: "AI & Automation Engineering",
    short: "AI & Automation",
    persen: "75%",
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
    persen: "83%",
    sksCocok: "20 <small>/ 24 SKS</small>",
    mkBaru: "3 <small>Matkul</small>",
    btnLabel: "Simulasi Ambil Jalur RPL Ini",
    saran: "Pindah ke jalur <strong>Rekayasa Perangkat Lunak</strong> memiliki kecocokan SKS tertinggi dan <strong>lulus tepat waktu</strong> mulai <strong>Semester 4</strong>.",
    matkul: [
      ["Analisis & Desain Perangkat Lunak", "Wajib Pokok", "3 SKS • Kode: CIF62021 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"],
      ["Pengujian Perangkat Lunak", "Lanjutan", "3 SKS • Kode: CIF62025 • Jadwal: Semester 5", "Prasyarat RPL", "Masa Datang"],
      ["Manajemen Proyek Perangkat Lunak", "Inti RPL", "3 SKS • Kode: CIF62029 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"]
    ]
  }
};

let targetAktif = "ai";

// 1. Pindah antar tab utama aplikasi (Home, Banding, Nilai, KRS)
function bukaTab(namaTab) {
  document.querySelectorAll("main .screen").forEach((el) => el.classList.remove("active"));
  document.getElementById("screen-" + namaTab).classList.add("active");

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === namaTab);
  });

  document.getElementById("header-subtitle").textContent = SUBTITLES[namaTab] || "Learning Path";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 2. Masuk ke aplikasi utama setelah login
function masukAplikasi() {
  const rawId = document.getElementById("input-nim").value.trim() || "225150201111003";
  const nim = rawId.includes("@") ? "225150201111003" : rawId;

  document.getElementById("mhs-nim").textContent = nim;
  document.getElementById("nilai-nim").textContent = nim;
  document.getElementById("krs-mhs-info").textContent = "Joseph (" + nim + ")";

  document.getElementById("screen-opening").classList.remove("active");
  document.getElementById("screen-sso").classList.remove("active");
  document.getElementById("app-header").hidden = false;
  document.getElementById("app-main").hidden = false;
  document.getElementById("bottom-nav").hidden = false;

  bukaTab("home");
  tampilPesan("Selamat datang di StudiKu, Joseph!");
}

// 3. Tampilkan notifikasi singkat (toast)
let toastTimer;
function tampilPesan(teks) {
  const toast = document.getElementById("toast");
  toast.textContent = teks;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
}

// 4. Fungsi murni hitung IPK dari daftar pasangan [sks, bobot]
function hitungIPKData(daftarNilai) {
  let totalMutu = 0;
  let totalSks = 0;
  for (const [sks, bobot] of daftarNilai) {
    totalMutu += sks * bobot;
    totalSks += sks;
  }
  return totalSks > 0 ? (totalMutu / totalSks).toFixed(2) : "0.00";
}

// 5. Hitung Audit Nilai & perbarui status di Home, Banding, Nilai, dan KRS
function hitungAudit() {
  const rows = document.querySelectorAll(".mk-row");
  const daftarNilai = [];
  let mkTambahan = 0;
  let sksLulus = 0;
  let wajibUlang = 0;

  rows.forEach((row) => {
    const sks = Number(row.dataset.sks);
    const val = row.querySelector(".grade-select").value;
    if (val === "-") return;

    const bobot = Number(val);
    daftarNilai.push([sks, bobot]);
    mkTambahan += 1;
    if (bobot >= 2) sksLulus += sks;
    else wajibUlang += 1;
  });

  const ipk = hitungIPKData(daftarNilai);
  const totalSksLulus = 34 + sksLulus; // Basis histori kurikulum + matkul tampil

  document.getElementById("audit-ipk").textContent = ipk;
  document.getElementById("home-ipk").textContent = ipk;
  document.getElementById("banding-ipk").textContent = ipk;
  document.getElementById("krs-ips").textContent = ipk;
  document.getElementById("audit-mk").textContent = 12 + mkTambahan;
  document.getElementById("audit-sks").textContent = totalSksLulus;
  document.getElementById("home-sks").textContent = totalSksLulus;
  document.getElementById("audit-ulang").textContent = wajibUlang;

  // Evaluasi otomatis Matematika Diskrit
  const nilaiMatdis = Number(document.getElementById("select-matdis").value);
  const lulusMatdis = nilaiMatdis >= 2;

  document.getElementById("diag-matdis").hidden = lulusMatdis;
  document.getElementById("diag-count").textContent = (lulusMatdis ? 1 : 2) + " ISU TEMUAN";
  document.getElementById("home-perhatian").textContent = (lulusMatdis ? 1 : 2) + " Matkul";
  document.getElementById("sem2-badge").textContent = lulusMatdis ? "Tuntas" : "1 Gagal";
  document.getElementById("sem2-badge").className = "tag " + (lulusMatdis ? "tag-cyan-soft" : "tag-red");
  document.getElementById("matdis-sub").textContent = lulusMatdis
    ? "CIF62003 • 3 SKS • Syarat terpenuhi"
    : "CIF62003 • 3 SKS • Perlu perbaikan";
  document.getElementById("badge-matdis-home").textContent = lulusMatdis ? "Lulus Perbaikan" : "Perlu Ulang";
}

// 6. Hitung beban SKS & sisa kuota di halaman Rencana KRS (maksimal 24 SKS)
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
    tampilPesan("Batas maksimal pengambilan adalah 24 SKS!");
    return hitungKRS();
  }

  document.getElementById("krs-total-sks").textContent = totalSks;
  document.getElementById("krs-sisa-sks").textContent = 24 - totalSks;
  document.getElementById("krs-total-mk").textContent = totalMk + " Mata Kuliah";
}

// 7. Ganti pembanding jalur peminatan (AI vs RPL)
function gantiTargetPembanding() {
  targetAktif = targetAktif === "ai" ? "rpl" : "ai";
  const d = TARGET_JALUR[targetAktif];

  document.getElementById("target-nama").textContent = d.nama;
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

  tampilPesan("Target pembanding diubah ke " + d.nama);
}

// ==================== EVENT LISTENERS ====================

// Alur Opening -> Student Login SSO -> Aplikasi Utama
document.getElementById("btn-go-sso").addEventListener("click", () => {
  document.getElementById("screen-opening").classList.remove("active");
  document.getElementById("screen-sso").classList.add("active");
});

document.getElementById("btn-back-opening").addEventListener("click", () => {
  document.getElementById("screen-sso").classList.remove("active");
  document.getElementById("screen-opening").classList.add("active");
});

document.querySelectorAll(".role-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".role-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const isMhs = btn.dataset.role === "Mahasiswa";
    document.getElementById("sso-role-title").textContent = isMhs ? "AKSES AKUN MAHASISWA" : "AKSES DOSEN PA / ADMIN";
    document.getElementById("sso-role-desc").textContent = isMhs
      ? "Akses KRS semester aktif, pantau learning path kurikulum, audit transkrip KHS, dan reservasi bimbingan Dosen PA."
      : "Validasi rencana studi mahasiswa bimbingan, tinjau diagnosis nilai, dan kelola jadwal konsultasi akademik.";
  });
});

document.getElementById("btn-toggle-pass").addEventListener("click", () => {
  const input = document.getElementById("input-pass");
  input.type = input.type === "password" ? "text" : "password";
});

document.getElementById("form-sso").addEventListener("submit", (e) => {
  e.preventDefault();
  masukAplikasi();
});

document.getElementById("btn-quick-sso").addEventListener("click", masukAplikasi);
document.getElementById("btn-lupa-sandi").addEventListener("click", () => tampilPesan("Tautan reset kata sandi dikirim ke email @student.ub.ac.id."));
document.getElementById("btn-daftar-akun").addEventListener("click", () => tampilPesan("Aktivasi akun mahasiswa baru dilakukan melalui SIAM UB."));

document.getElementById("btn-logout").addEventListener("click", () => {
  document.getElementById("app-header").hidden = true;
  document.getElementById("app-main").hidden = true;
  document.getElementById("bottom-nav").hidden = true;
  document.getElementById("screen-opening").classList.add("active");
});

// Navigasi bawah & tombol pintas antar halaman
document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => bukaTab(btn.dataset.tab));
});

document.querySelectorAll("[data-goto]").forEach((btn) => {
  btn.addEventListener("click", () => bukaTab(btn.dataset.goto));
});

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => document.getElementById(btn.dataset.close).close());
});

// Filter semester di Home
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

// Aksi Header & PA di Home
document.getElementById("btn-notif").addEventListener("click", () => {
  document.getElementById("notif-dot").hidden = true;
  tampilPesan("Pengingat: Bimbingan PA Kamis 15 Feb pukul 09:30 di Gedung F Lt. 6.");
});

document.getElementById("btn-sync-cal").addEventListener("click", () => {
  document.getElementById("sync-cal-text").textContent = "Tersinkron ke Google Kalender";
  tampilPesan("Jadwal bimbingan berhasil disinkronkan ke Google Kalender!");
});

document.getElementById("btn-chat-pa").addEventListener("click", () => {
  tampilPesan("Membuka pesan konsultasi ke Bapak Mahardeka Tri Ananta.");
});

// Aksi Banding Jalur
document.getElementById("btn-ganti-target-top").addEventListener("click", gantiTargetPembanding);
document.getElementById("btn-toggle-target").addEventListener("click", gantiTargetPembanding);

document.getElementById("btn-simulasi-jalur").addEventListener("click", () => {
  const d = TARGET_JALUR[targetAktif];
  document.getElementById("home-jalur-nama").textContent = d.nama;
  document.getElementById("home-jalur-short").textContent = d.short;
  document.getElementById("banding-jalur-aktif").textContent = d.short;
  document.getElementById("compare-current").textContent = d.nama;
  document.getElementById("krs-jalur").textContent = d.short;
  bukaTab("krs");
  tampilPesan("Simulasi jalur " + d.short + " diterapkan ke Rencana KRS!");
});

document.getElementById("btn-konsul-banding").addEventListener("click", () => {
  tampilPesan("Permohonan konsultasi pindah jalur dikirim ke Dosen PA.");
});

// Aksi Audit Nilai & Tambah MK
document.getElementById("screen-nilai").addEventListener("change", (e) => {
  if (e.target.classList.contains("grade-select")) hitungAudit();
});

document.getElementById("btn-open-tambah").addEventListener("click", () => {
  document.getElementById("dialog-tambah").showModal();
});

document.getElementById("form-tambah").addEventListener("submit", () => {
  const inputNama = document.getElementById("mk-nama-baru");
  const sks = document.getElementById("mk-sks-baru").value;
  const nilai = document.getElementById("mk-nilai-baru").value;
  const nama = inputNama.value.trim();
  if (!nama) return;

  const row = document.createElement("div");
  row.className = "mk-row";
  row.dataset.sks = sks;

  const info = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = nama;
  const span = document.createElement("span");
  span.className = "muted";
  span.textContent = "MK Tambahan • " + sks + " SKS";
  info.append(strong, span);

  const select = document.createElement("select");
  select.className = "grade-select";
  [["4", "A"], ["3.5", "B+"], ["3", "B"], ["2", "C"], ["1", "D"]].forEach(([val, huruf]) => {
    select.add(new Option(huruf, val, false, val === nilai));
  });

  row.append(info, select);
  document.getElementById("list-sem-2").appendChild(row);
  inputNama.value = "";
  hitungAudit();
  tampilPesan("Mata kuliah " + nama + " berhasil ditambahkan.");
});

document.getElementById("btn-simpan-nilai").addEventListener("click", () => {
  hitungAudit();
  bukaTab("krs");
  tampilPesan("Audit nilai disimpan & disinkronkan ke Rencana KRS.");
});

// Aksi Rencana KRS
document.getElementById("krs-list").addEventListener("change", (e) => {
  if (e.target.classList.contains("krs-check")) hitungKRS(e.target);
});

document.getElementById("btn-pilih-saran").addEventListener("click", () => {
  document.querySelectorAll(".krs-check[data-saran]").forEach((cb) => { cb.checked = true; });
  hitungKRS();
  tampilPesan("Seluruh mata kuliah saran (18 SKS) dipilih!");
});

document.getElementById("btn-draft-pdf").addEventListener("click", () => {
  window.print();
});

document.getElementById("btn-ajukan-krs").addEventListener("click", () => {
  document.getElementById("krs-status-badge").textContent = "Terkirim ke SIAM";
  tampilPesan("Rencana KRS berhasil dikunci & dikirim ke antrean validasi SIAM FILKOM UB!");
});

// Inisialisasi & self-check rumus IPK
console.assert(hitungIPKData([[4, 4], [4, 3]]) === "3.50", "Self-check IPK harus 3.50");
hitungAudit();
hitungKRS();
