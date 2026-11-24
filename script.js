// StudiKu - Script sederhana tanpa framework agar mudah dipahami & dipertanggungjawabkan
// ponytail: state disimpan langsung di DOM (tanpa localStorage/backend); cukup untuk demo prototipe IMK 1 sesi, upgrade ke localStorage/REST API SIAKAD UB untuk produksi.

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
    icon: "🤖",
    persen: "75%",
    sksCocok: "18 <small>/ 24 SKS</small>",
    mkBaru: "4 <small>Matkul</small>",
    saran: "Pindah ke jalur AI & Automation masih sangat aman dan tidak menghambat kelulusan jika mata kuliah prasyarat mulai diambil di Semester 4 mendatang.",
    matkul: [
      ["Kecerdasan Artifisial Dasar", "3 SKS • CIF62002 • Jadwal: Semester 4", "Prioritas KRS"],
      ["Machine Learning & Pola", "4 SKS • CIF62010 • Jadwal: Semester 5", "Prasyarat AI"],
      ["Probabilitas & Statistika Lanjut", "3 SKS • CIF62007 • Jadwal: Semester 4", "Prioritas KRS"]
    ]
  },
  rpl: {
    nama: "Rekayasa Perangkat Lunak",
    short: "Software Engineering",
    icon: "💻",
    persen: "83%",
    sksCocok: "20 <small>/ 24 SKS</small>",
    mkBaru: "3 <small>Matkul</small>",
    saran: "Jalur RPL memiliki irisan mata kuliah tertinggi dengan histori SKS Anda saat ini. Transisi dapat dilakukan langsung pada KRS Semester 4.",
    matkul: [
      ["Analisis & Desain Perangkat Lunak", "4 SKS • CIF62021 • Jadwal: Semester 4", "Prioritas KRS"],
      ["Pengujian Perangkat Lunak", "3 SKS • CIF62025 • Jadwal: Semester 5", "Lanjutan"],
      ["Manajemen Proyek Perangkat Lunak", "3 SKS • CIF62029 • Jadwal: Semester 5", "Lanjutan"]
    ]
  }
};

// 1. Fungsi pindah tab utama
function bukaTab(namaTab) {
  document.querySelectorAll("main .screen").forEach((el) => el.classList.remove("active"));
  document.getElementById("screen-" + namaTab).classList.add("active");

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === namaTab);
  });

  document.getElementById("header-subtitle").textContent = SUBTITLES[namaTab] || "StudiKu";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 2. Fungsi pesan notifikasi singkat (toast)
let toastTimer;
function tampilPesan(teks) {
  const toast = document.getElementById("toast");
  toast.textContent = teks;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
}

// 3. Fungsi murni hitung IPK dari daftar pasangan [sks, bobot]
function hitungIPKData(daftarNilai) {
  let totalMutu = 0;
  let totalSks = 0;
  for (const [sks, bobot] of daftarNilai) {
    if (!Number.isNaN(bobot)) {
      totalMutu += sks * bobot;
      totalSks += sks;
    }
  }
  return totalSks > 0 ? (totalMutu / totalSks).toFixed(2) : "0.00";
}

// 4. Hitung ulang Audit Nilai & sinkronkan ke halaman Home/Banding
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
  document.getElementById("audit-mk").textContent = mkTerinput + " MK";
  document.getElementById("audit-sks").textContent = (37 + sksLulus) + " SKS";
  document.getElementById("home-sks").textContent = 37 + sksLulus;
  document.getElementById("audit-ulang").textContent = wajibUlang + " MK";

  // Cek status khusus Matematika Diskrit
  const nilaiMatdis = Number(document.getElementById("select-matdis").value);
  const matdisLulus = nilaiMatdis >= 2;

  document.getElementById("diag-matdis").hidden = matdisLulus;
  document.getElementById("diag-count").textContent = (matdisLulus ? 1 : 2) + " ISU TEMUAN";
  document.getElementById("home-perhatian").textContent = (matdisLulus ? 1 : 2) + " Matkul";
  document.getElementById("sem2-badge").textContent = matdisLulus ? "Tuntas" : "1 Perlu Perbaikan";
  document.getElementById("sem2-badge").className = "badge " + (matdisLulus ? "badge-teal" : "badge-red");
  document.getElementById("badge-matdis-home").textContent = matdisLulus ? "Sudah Diperbaiki" : "Perlu Ulang";
  document.getElementById("desc-matdis-home").textContent = matdisLulus ? "✓ Syarat Min. C Terpenuhi" : "⚠ Nilai D (Syarat Min. C)";
}

// 5. Hitung total SKS pada halaman Rencana KRS (maksimal 24 SKS)
function hitungKRS(changedBox) {
  const checks = document.querySelectorAll(".krs-check");
  let total = 0;
  checks.forEach((cb) => {
    if (cb.checked) total += Number(cb.value);
  });

  if (total > 24 && changedBox) {
    changedBox.checked = false;
    tampilPesan("Batas maksimal KRS adalah 24 SKS!");
    return hitungKRS();
  }

  document.getElementById("krs-total-sks").textContent = total;
  document.getElementById("krs-bar").style.width = Math.min(100, Math.round((total / 24) * 100)) + "%";
}

// 6. Render perubahan jalur target di tab Banding
function renderTargetJalur() {
  const key = document.getElementById("select-target").value;
  const data = TARGET_JALUR[key];
  document.getElementById("target-nama").textContent = data.icon + " " + data.nama;
  document.getElementById("stat-persen").textContent = data.persen;
  document.getElementById("stat-sks-cocok").innerHTML = data.sksCocok;
  document.getElementById("stat-mk-baru").innerHTML = data.mkBaru;
  document.getElementById("advisor-text").textContent = data.saran;

  const container = document.getElementById("matrix-target-list");
  container.innerHTML = data.matkul.map(([nama, info, label]) => `
    <div class="matrix-row">
      <div>
        <strong>${nama}</strong>
        <p class="muted">${info}</p>
      </div>
      <span class="badge badge-red">${label}</span>
    </div>
  `).join("");
}

// ==================== EVENT LISTENERS ====================

// Login SSO & Logout
document.getElementById("btn-open-sso").addEventListener("click", () => {
  document.getElementById("dialog-sso").showModal();
});

document.getElementById("form-sso").addEventListener("submit", () => {
  const nama = document.getElementById("input-nama").value.trim() || "Joseph";
  const nim = document.getElementById("input-nim").value.trim() || "225150201111003";
  document.getElementById("mhs-nama").textContent = nama;
  document.getElementById("mhs-nim").textContent = nim;
  document.getElementById("nilai-nim").textContent = nim;

  document.getElementById("screen-login").classList.remove("active");
  document.getElementById("app-header").hidden = false;
  document.getElementById("app-main").hidden = false;
  document.getElementById("bottom-nav").hidden = false;
  bukaTab("home");
  tampilPesan("Selamat datang, " + nama + "!");
});

document.getElementById("btn-logout").addEventListener("click", () => {
  document.getElementById("app-header").hidden = true;
  document.getElementById("app-main").hidden = true;
  document.getElementById("bottom-nav").hidden = true;
  document.getElementById("screen-login").classList.add("active");
});

// Tutup modal tombol Batal
document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => document.getElementById(btn.dataset.close).close());
});

// Navigasi bawah & tombol pintas antar tab
document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => bukaTab(btn.dataset.tab));
});

document.querySelectorAll("[data-goto]").forEach((btn) => {
  btn.addEventListener("click", () => bukaTab(btn.dataset.goto));
});

// Filter tahapan semester di Home
document.querySelectorAll(".sem-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".sem-pill").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    const target = pill.dataset.sem;
    document.querySelectorAll("#home-timeline .tl-item").forEach((item) => {
      item.hidden = target !== "all" && item.dataset.sem !== target && target !== "3";
      if (target === "3") item.hidden = false; // Sem 3 aktif menampilkan alur lengkap
    });
  });
});

// Interaksi Home & PA
document.getElementById("btn-notif").addEventListener("click", () => {
  document.getElementById("notif-dot").hidden = true;
  tampilPesan("Pengingat: Bimbingan Dosen PA Kamis pukul 09.30 di Gedung F Lt. 6.");
});

document.getElementById("btn-sync-cal").addEventListener("click", (e) => {
  e.currentTarget.textContent = "✓ Tersinkron ke Google Kalender";
  tampilPesan("Jadwal bimbingan berhasil ditambahkan ke kalender.");
});

document.getElementById("btn-chat-pa").addEventListener("click", () => {
  tampilPesan("Membuka ruang konsultasi Dosen PA: Bapak Mahardeka Tri Ananta.");
});

// Interaksi Banding Jalur
document.getElementById("select-target").addEventListener("change", renderTargetJalur);

document.getElementById("btn-toggle-target").addEventListener("click", () => {
  const sel = document.getElementById("select-target");
  sel.value = sel.value === "ai" ? "rpl" : "ai";
  renderTargetJalur();
  tampilPesan("Target pembanding diubah.");
});

document.getElementById("btn-simulasi-jalur").addEventListener("click", () => {
  const data = TARGET_JALUR[document.getElementById("select-target").value];
  document.getElementById("home-jalur-nama").textContent = data.nama;
  document.getElementById("home-jalur-short").textContent = data.short;
  document.getElementById("banding-jalur-aktif").textContent = data.short;
  document.getElementById("compare-current").textContent = data.nama;
  document.getElementById("krs-jalur").textContent = data.nama;
  bukaTab("krs");
  tampilPesan("Simulasi jalur " + data.short + " diterapkan ke Rencana KRS!");
});

document.getElementById("btn-konsul-banding").addEventListener("click", () => {
  tampilPesan("Permintaan konsultasi pindah jalur dikirim ke Dosen PA.");
});

// Interaksi Nilai & Tambah MK
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
  const small = document.createElement("small");
  small.className = "muted";
  small.textContent = "MK Tambahan • " + sks + " SKS";
  info.append(strong, small);

  const select = document.createElement("select");
  select.className = "grade-select";
  [["4", "A"], ["3.5", "B+"], ["3", "B"], ["2", "C"], ["1", "D"]].forEach(([val, huruf]) => {
    const opt = new Option(huruf, val, false, val === nilai);
    select.add(opt);
  });

  row.append(info, select);
  document.getElementById("list-sem-2").appendChild(row);
  inputNama.value = "";
  hitungAudit();
  tampilPesan("Mata kuliah " + nama + " ditambahkan.");
});

document.getElementById("btn-simpan-nilai").addEventListener("click", () => {
  hitungAudit();
  bukaTab("krs");
  tampilPesan("Audit disimpan. Rencana KRS diperbarui!");
});

// Interaksi Rencana KRS
document.getElementById("krs-list").addEventListener("change", (e) => {
  if (e.target.classList.contains("krs-check")) hitungKRS(e.target);
});

document.getElementById("btn-ajukan-krs").addEventListener("click", () => {
  const badge = document.getElementById("krs-status-badge");
  badge.textContent = "Menunggu PA";
  badge.className = "badge badge-teal";
  tampilPesan("Rencana KRS berhasil diajukan ke Dosen PA!");
});

// Inisialisasi awal + self-check ringan untuk memastikan rumus IPK akurat
console.assert(hitungIPKData([[4, 4], [4, 3]]) === "3.50", "Rumus IPK harus menghasilkan 3.50");
hitungAudit();
hitungKRS();
