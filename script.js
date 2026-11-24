// StudiKu - Prototipe IMK Kelompok 1 (HTML, CSS, dan JS murni sederhana)
// ponytail: seluruh sinkronisasi lintas layar (Layar 1-5) mengalir dari satu sumber DOM: hitungAudit() -> sinkronKRS() -> hitungKRS().

const SUBTITLES = {
  home: "Learning Path",
  banding: "Banding Jalur",
  nilai: "Input Nilai",
  krs: "Rencana KRS"
};

// Katalog 4 jalur peminatan & lintas prodi FILKOM UB (Layar 2, 3, dan 5)
const URUTAN_JALUR = ["ai", "rpl", "si", "game"];
let jalurAktif = "game";
let indexTarget = 0; // default target pembanding: "ai"

const DATA_JALUR = {
  game: {
    nama: "Game Development & Interactive Systems",
    short: "Game Dev",
    prodi: "S1 Teknik Informatika",
    prodiBadge: "Jalur Awal • TIF",
    persen: "✓ 88%",
    sksCocok: "21 <small>/ 24 SKS</small>",
    mkBaru: "2 <small>Matkul</small>",
    keahlian: "5 / 21 Selesai",
    barPct: 24,
    homePct: "40%",
    capstone: "78%",
    btnLabel: "Simulasi Kembali ke Jalur Game Dev",
    saran: "Kembali ke jalur <strong>Game Development</strong> langsung melanjutkan progres fondasi <strong>Grafika Komputer</strong> tanpa tambahan mata kuliah transisi.",
    wajibSem4: { nama: "Pemrograman Gim", kode: "CIF62015", kelas: "Kelas D (Lab GII)" },
    proyeksiSem5: { nama: "Pengembangan Gim Terpadu", kodeSks: "CIF63042 • 4 SKS" },
    matkul: [
      ["Pemrograman Gim", "Wajib Pokok", "3 SKS • Kode: CIF62015 • Jadwal: Semester 4", "Siap Diambil", "Prioritas KRS"],
      ["Pengembangan Gim Terpadu", "Lanjutan", "4 SKS • Kode: CIF63042 • Jadwal: Semester 5", "Prasyarat Gim", "Masa Datang"],
      ["Kecerdasan Buatan dalam Gim", "Inti Gim", "3 SKS • Kode: CIF62089 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"]
    ]
  },
  ai: {
    nama: "AI & Automation Engineering",
    short: "AI & Automation",
    prodi: "S1 Teknik Informatika",
    prodiBadge: "Pilihan 1 • TIF",
    persen: "✓ 75%",
    sksCocok: "18 <small>/ 24 SKS</small>",
    mkBaru: "4 <small>Matkul</small>",
    keahlian: "4 / 21 Selesai",
    barPct: 19,
    homePct: "38%",
    capstone: "75%",
    btnLabel: "Simulasi Ambil Jalur AI Ini",
    saran: "Pindah ke jalur <strong>AI &amp; Automation</strong> masih sangat aman dan <strong>tidak menghambat kelulusan</strong> jika mata kuliah prasyarat mulai diambil di <strong>Semester 4</strong> mendatang.",
    wajibSem4: { nama: "Kecerdasan Artifisial Dasar", kode: "CIF62002", kelas: "Kelas A (Lab AI)" },
    proyeksiSem5: { nama: "Machine Learning & Pola", kodeSks: "CIF62010 • 4 SKS" },
    matkul: [
      ["Kecerdasan Artifisial Dasar", "Wajib Pokok", "3 SKS • Kode: CIF62002 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"],
      ["Machine Learning & Pola", "Lanjutan", "4 SKS • Kode: CIF62010 • Jadwal: Semester 5", "Prasyarat AI Dasar", "Masa Datang"],
      ["Probabilitas & Statistika Lanjut", "Statistika AI", "3 SKS • Kode: CIF62007 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"]
    ]
  },
  rpl: {
    nama: "Rekayasa Perangkat Lunak",
    short: "Software Eng",
    prodi: "S1 Teknik Informatika",
    prodiBadge: "Pilihan 2 • TIF",
    persen: "✓ 83%",
    sksCocok: "20 <small>/ 24 SKS</small>",
    mkBaru: "3 <small>Matkul</small>",
    keahlian: "6 / 21 Selesai",
    barPct: 29,
    homePct: "45%",
    capstone: "83%",
    btnLabel: "Simulasi Ambil Jalur RPL Ini",
    saran: "Pindah ke jalur <strong>Rekayasa Perangkat Lunak</strong> memiliki kecocokan SKS tertinggi dan <strong>lulus tepat waktu</strong> mulai <strong>Semester 4</strong>.",
    wajibSem4: { nama: "Analisis & Desain Perangkat Lunak", kode: "CIF62021", kelas: "Kelas B (Gedung F.401)" },
    proyeksiSem5: { nama: "Pengujian Perangkat Lunak", kodeSks: "CIF62025 • 3 SKS" },
    matkul: [
      ["Analisis & Desain Perangkat Lunak", "Wajib Pokok", "3 SKS • Kode: CIF62021 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"],
      ["Pengujian Perangkat Lunak", "Lanjutan", "3 SKS • Kode: CIF62025 • Jadwal: Semester 5", "Prasyarat ADPL", "Masa Datang"],
      ["Manajemen Proyek Perangkat Lunak", "Inti RPL", "3 SKS • Kode: CIF62029 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"]
    ]
  },
  si: {
    nama: "Enterprise & Data Analytics (Lintas Prodi SI)",
    short: "Sistem Informasi",
    prodi: "S1 Sistem Informasi (Lintas Prodi)",
    prodiBadge: "Lintas Prodi • SI",
    persen: "✓ 67%",
    sksCocok: "16 <small>/ 24 SKS</small>",
    mkBaru: "5 <small>Matkul</small>",
    keahlian: "3 / 21 Selesai",
    barPct: 14,
    homePct: "32%",
    capstone: "67%",
    btnLabel: "Simulasi Ambil Jalur SI Ini",
    saran: "Eksplorasi lintas prodi ke <strong>Sistem Informasi</strong> memerlukan 5 mata kuliah tata kelola &amp; proses bisnis mulai <strong>Semester 4</strong>.",
    wajibSem4: { nama: "Analisis Proses Bisnis", kode: "CSI62001", kelas: "Kelas SI-A (Gedung A.301)" },
    proyeksiSem5: { nama: "Sistem Enterprise (ERP)", kodeSks: "CSI62014 • 3 SKS" },
    matkul: [
      ["Analisis Proses Bisnis", "Inti SI", "3 SKS • Kode: CSI62001 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"],
      ["Sistem Enterprise (ERP)", "Wajib Jalur", "3 SKS • Kode: CSI62014 • Jadwal: Semester 5", "Prasyarat APB", "Masa Datang"],
      ["Tata Kelola TI", "Wajib Jalur", "3 SKS • Kode: CSI62018 • Jadwal: Semester 4", "Belum Ada", "Prioritas KRS"]
    ]
  }
};

// State ringan untuk menjaga sinkronisasi perubahan antara Layar 3, 4, dan 5
let batasMaksSks = 24;
let krsTerkunci = false;
let matdisSedangLulus = false;
let pboSedangTerkunci = false;
const statusCekRemediasi = new Map();

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

// 3. Status 6 FSM (Bab 3.1 Hal. 30): Loading spinner + cegah klik ganda
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

// 5. Helper murni: IPK, kuota SKS kurikulum UB, teks nilai huruf, & reset draf KRS
function hitungIPKData(daftarNilai) {
  let totalMutu = 0;
  let totalSks = 0;
  for (const [sks, bobot] of daftarNilai) {
    totalMutu += sks * bobot;
    totalSks += sks;
  }
  return totalSks > 0 ? (totalMutu / totalSks).toFixed(2) : "0.00";
}

function batasSksDariIPK(ipkNum) {
  if (ipkNum >= 3.0) return 24;
  if (ipkNum >= 2.5) return 21;
  if (ipkNum >= 2.0) return 18;
  return 15;
}

function hurufNilai(selectEl) {
  return selectEl.options[selectEl.selectedIndex].text.split(" ")[0];
}

function escapeHtml(teks) {
  const div = document.createElement("div");
  div.textContent = teks;
  return div.innerHTML;
}

function bukaKunciDrafKRS() {
  if (!krsTerkunci) return;
  krsTerkunci = false;
  document.getElementById("btn-ajukan-krs").disabled = false;
  document.getElementById("btn-kunci-label").textContent = "Kunci & Kirim Rencana ke Sistem KRS";
  document.getElementById("krs-status-badge").textContent = "↻ Draf Diperbarui";
}

// 6. Kalkulasi Audit Nilai & sinkronisasi penuh ke Layar 2, 3, 4, dan 5
function hitungAudit(dariInteraksi = false) {
  if (dariInteraksi) bukaKunciDrafKRS();

  const rows = document.querySelectorAll(".mk-row");
  const daftarNilai = [];
  const mkGagalLain = [];
  let mkTerinput = 0;
  let sksLulus = 0;
  let wajibUlang = 0;
  let lulusAok = false;
  let lulusJarkom = false;

  rows.forEach((row, idx) => {
    const sks = Number(row.dataset.sks);
    const kode = row.dataset.kode || "MK Tambahan";
    const nama = row.querySelector("strong").textContent.trim();
    const select = row.querySelector(".grade-select");
    const val = select.value;

    if (val === "-") {
      select.classList.remove("grade-warn");
      return;
    }

    const bobot = Number(val);
    const gagal = bobot < 2;
    const huruf = hurufNilai(select);

    select.classList.toggle("grade-warn", gagal);
    daftarNilai.push([sks, bobot]);
    mkTerinput += 1;

    if (!gagal) {
      sksLulus += sks;
      if (/\baok\b|arsitektur/i.test(nama)) lulusAok = true;
      if (/\bjarkom\b|jaringan komputer/i.test(nama)) lulusJarkom = true;
    } else {
      wajibUlang += 1;
      if (select.id !== "select-matdis") {
        mkGagalLain.push({ key: kode, nama, kode, sks, huruf });
      }
    }
  });

  // Perbarui ringkasan subjudul & badge Tuntas / Gagal untuk setiap blok semester di Layar 4
  document.querySelectorAll(".sem-accordion").forEach((acc) => {
    const baseSks = Number(acc.dataset.baseSks || 0);
    const pasanganSem = [];
    let sksTerisi = 0;
    let sksSemLulus = 0;
    let gagalSem = 0;

    acc.querySelectorAll(".mk-row").forEach((r) => {
      const val = r.querySelector(".grade-select").value;
      if (val === "-") return;
      const sks = Number(r.dataset.sks);
      const bobot = Number(val);
      sksTerisi += sks;
      pasanganSem.push([sks, bobot]);
      if (bobot < 2) gagalSem += 1;
      else sksSemLulus += sks;
    });

    const badge = acc.querySelector("summary .tag");
    const numBox = acc.querySelector(".sem-num");
    const subEl = acc.querySelector(".sem-summary-sub");

    if (pasanganSem.length === 0) {
      badge.textContent = "● Aktif";
      badge.className = "tag tag-purple";
      numBox.className = "sem-num num-purple";
      subEl.textContent = "Estimasi Nilai Sementara";
    } else if (gagalSem > 0) {
      badge.textContent = "↻ " + gagalSem + " Gagal";
      badge.className = "tag tag-danger";
      numBox.className = "sem-num num-red";
      subEl.textContent = (baseSks + sksTerisi) + " SKS Tercatat • " + gagalSem + " Perlu Evaluasi";
    } else {
      badge.textContent = "✓ Tuntas";
      badge.className = "tag tag-success";
      numBox.className = "sem-num num-teal";
      subEl.textContent = (baseSks + sksSemLulus) + " SKS Lulus • IPS " + hitungIPKData(pasanganSem);
    }
  });

  // Statistik global lintas layar (Layar 2, 3, 4, 5)
  const ipk = hitungIPKData(daftarNilai);
  const terlewatCount = lulusAok ? 0 : 1;
  const totalIsu = terlewatCount + wajibUlang;

  document.getElementById("audit-ipk").textContent = ipk;
  document.getElementById("home-ipk").textContent = ipk;
  document.getElementById("banding-ipk").textContent = ipk;
  document.getElementById("krs-ips").textContent = ipk;

  document.getElementById("audit-mk").textContent = 12 + mkTerinput;
  document.getElementById("audit-sks").textContent = 34 + sksLulus;
  document.getElementById("home-sks").textContent = 37 + sksLulus;
  document.getElementById("audit-ulang").textContent = wajibUlang;
  document.getElementById("audit-terlewat").textContent = terlewatCount;
  document.getElementById("home-perhatian").textContent = totalIsu + " Matkul";

  const perhatianSub = document.getElementById("home-perhatian-sub");
  if (totalIsu === 0) {
    perhatianSub.textContent = "✓ Semua Syarat Aman";
  } else if (wajibUlang > 0 && terlewatCount > 0) {
    perhatianSub.textContent = "! Nilai D/E & Prasyarat";
  } else if (wajibUlang > 0) {
    perhatianSub.textContent = "! " + wajibUlang + " MK Wajib Ulang";
  } else {
    perhatianSub.textContent = "! 1 MK Terlewat (AOK)";
  }

  // Diagnosis Otomatis Layar 4 + Kartu Matematika Diskrit & PBO di Layar 2
  const selMatdis = document.getElementById("select-matdis");
  const hurufMatdis = hurufNilai(selMatdis);
  const lulusMatdis = Number(selMatdis.value) >= 2;

  const selPbo = document.getElementById("select-pbo");
  const hurufPbo = hurufNilai(selPbo);
  const lulusPbo = Number(selPbo.value) >= 2;

  document.getElementById("diag-matdis").hidden = lulusMatdis;
  document.getElementById("diag-matdis-tag").textContent = "↻ Wajib Ulang (" + hurufMatdis + ")";
  document.getElementById("diag-aok").hidden = lulusAok;
  document.getElementById("diag-aman").hidden = totalIsu > 0;

  const diagCount = document.getElementById("diag-count");
  diagCount.textContent = totalIsu > 0 ? totalIsu + " ISU TEMUAN" : "✓ 0 ISU";
  diagCount.className = "tag " + (totalIsu > 0 ? "tag-purple" : "tag-success");

  document.getElementById("diag-extra-list").innerHTML = mkGagalLain.map((m) => `
    <div class="alert-card">
      <div class="row-between">
        <div class="row-gap">
          <span class="tag tag-danger">↻ Wajib Ulang (${escapeHtml(m.huruf)})</span>
          <strong>${escapeHtml(m.nama)}</strong>
        </div>
        <span class="mono-code">${m.sks} SKS</span>
      </div>
      <p class="muted mt-8">Otomatis ditambahkan ke daftar prioritas remediasi pada <strong>Rencana KRS</strong>.</p>
    </div>
  `).join("");

  const matdisSub = document.getElementById("matdis-sub");
  matdisSub.textContent = lulusMatdis
    ? "CIF62003 • 3 SKS • ✓ Syarat terpenuhi"
    : "CIF62003 • 3 SKS • Perlu perbaikan";
  matdisSub.className = "mono-code " + (lulusMatdis ? "text-cyan" : "text-salmon");

  // Kartu PBO & Matematika Diskrit di Timeline Layar 2 (Home)
  const badgePboHome = document.getElementById("badge-pbo-home");
  badgePboHome.textContent = (lulusPbo ? "✓ Nilai " : "↻ Nilai ") + hurufPbo;
  badgePboHome.className = "tag " + (lulusPbo ? "tag-dark" : "tag-danger");

  document.getElementById("dot-matdis-home").className = "tl-dot " + (lulusMatdis ? "teal" : "red");
  document.getElementById("box-matdis-home").className = "tl-card " + (lulusMatdis ? "tl-teal" : "tl-red");
  document.getElementById("kode-matdis-home").className = "mono-code " + (lulusMatdis ? "text-cyan" : "text-rose");
  document.getElementById("badge-matdis-home").textContent = lulusMatdis ? "✓ Nilai " + hurufMatdis : "↻ Perlu Ulang";
  document.getElementById("badge-matdis-home").className = "tag " + (lulusMatdis ? "tag-success" : "tag-danger");
  document.getElementById("desc-matdis-home").className = "row-gap " + (lulusMatdis ? "text-cyan-sm" : "text-salmon");
  document.getElementById("icon-matdis-home").hidden = lulusMatdis;
  document.getElementById("teks-matdis-home").textContent = lulusMatdis
    ? "✓ Syarat Min. C Terpenuhi"
    : "[!] Nilai " + hurufMatdis + " (Syarat Min. C)";
  document.getElementById("btn-ulang-matdis-home").hidden = lulusMatdis;

  // Teruskan seluruh hasil evaluasi ke Layar 5 (Rencana KRS) & jalur aktif
  sinkronKRS({
    ipk: Number(ipk),
    lulusMatdis,
    hurufMatdis,
    lulusPbo,
    hurufPbo,
    lulusJarkom,
    mkGagalLain
  });
}

function aturCatatan(rowId, iconId, judulId, descId, badgeId, status, teksDesc) {
  const konfigurasi = {
    ok:    ["assets/krs/025bb.svg", false, "✓ Memenuhi", "text-cyan-sm"],
    lulus: ["assets/krs/025bb.svg", false, "✓ Tuntas",   "text-cyan-sm"],
    ulang: ["assets/krs/1a0ef.svg", false, "↻ Ulang",    "text-peach-bold"],
    kunci: ["assets/krs/16829.svg", true,  "🔒 Terkunci", "text-salmon-sm"]
  };
  const [ikon, terkunci, teksBadge, kelasBadge] = konfigurasi[status];
  document.getElementById(rowId).classList.toggle("locked-row", terkunci);
  document.getElementById(iconId).src = ikon;
  if (judulId) document.getElementById(judulId).classList.toggle("strike", terkunci);
  document.getElementById(descId).textContent = teksDesc;
  const badge = document.getElementById(badgeId);
  badge.textContent = teksBadge;
  badge.className = kelasBadge;
}

// 7. Sinkronisasi hasil Audit Nilai (Layar 4) & Jalur Aktif (Layar 3) ke Rencana KRS (Layar 5) & Home (Layar 2)
function sinkronKRS(state) {
  const d = DATA_JALUR[jalurAktif];

  // A. Sinkron atribut jalur aktif ke Layar 2, Layar 3, dan Layar 5
  document.getElementById("home-jalur-nama").textContent = d.nama;
  document.getElementById("home-prodi-label").textContent = d.prodi + " • Angkatan 2025";
  document.getElementById("home-keahlian-selesai").textContent = d.keahlian;
  document.getElementById("home-progress-track").setAttribute("aria-valuenow", d.barPct);
  document.getElementById("home-progress-fill").style.width = d.barPct + "%";
  document.getElementById("home-jalur-pct").textContent = d.homePct;
  document.getElementById("home-jalur-short").textContent = d.short;
  document.getElementById("unlock-pbo-home").textContent = d.wajibSem4.nama;
  document.getElementById("kode-sem4-home").textContent = d.wajibSem4.kode + " • 3 SKS";
  document.getElementById("nama-sem4-home").textContent = d.wajibSem4.nama;
  document.getElementById("kode-sem5-home").textContent = d.proyeksiSem5.kodeSks;
  document.getElementById("nama-sem5-home").textContent = d.proyeksiSem5.nama;

  document.getElementById("dot-sem4-home").className = "tl-dot " + (state.lulusPbo ? "teal" : "red");
  document.getElementById("box-sem4-home").className = "tl-card " + (state.lulusPbo ? "tl-teal" : "tl-red");
  document.getElementById("kode-sem4-home").className = "mono-code " + (state.lulusPbo ? "text-cyan" : "text-rose");
  document.getElementById("badge-sem4-home").textContent = state.lulusPbo ? "✓ Siap Diambil" : "🔒 Terkunci";
  document.getElementById("badge-sem4-home").className = "tag " + (state.lulusPbo ? "tag-success" : "tag-danger");
  document.getElementById("desc-sem4-home").textContent = state.lulusPbo
    ? "Prasyarat PBO terpenuhi. Direkomendasikan untuk KRS Sem 4."
    : "Terkunci sementara: Nilai PBO (" + state.hurufPbo + ") belum memenuhi minimal C.";

  document.getElementById("mhs-prodi-banding").textContent = d.prodi;
  document.getElementById("banding-jalur-aktif").textContent = d.short;
  document.getElementById("compare-current").textContent = d.nama;

  document.getElementById("krs-capstone-pct").textContent = d.capstone;
  document.getElementById("krs-jalur").textContent = d.short;
  document.getElementById("note-jalur-nama").textContent = d.wajibSem4.nama;
  document.getElementById("krs-mk-jalur-nama").textContent = d.wajibSem4.nama;
  document.getElementById("krs-mk-jalur-info").innerHTML =
    '<span class="mono-inline">' + d.wajibSem4.kode + "</span> • " + d.wajibSem4.kelas;

  // B. Rantai prasyarat PBO -> Mata Kuliah Wajib Peminatan di Layar 5
  const cbJalur = document.getElementById("cb-krs-jalur");
  const itemJalur = document.getElementById("krs-item-jalur");
  const judulJalur = document.getElementById("krs-mk-jalur-judul");
  const tagJalur = document.getElementById("krs-mk-jalur-tag");

  aturCatatan(
    "note-wajib-jalur", "note-jalur-icon", "note-jalur-nama", "note-jalur-desc", "note-jalur-badge",
    state.lulusPbo ? "ok" : "kunci",
    state.lulusPbo ? "Prasyarat PBO (" + state.hurufPbo + ") terpenuhi" : "Prasyarat PBO (" + state.hurufPbo + ") belum lulus (Min. C)"
  );

  itemJalur.classList.toggle("disabled", !state.lulusPbo);
  judulJalur.classList.toggle("strike", !state.lulusPbo);
  tagJalur.textContent = state.lulusPbo ? "✓ Wajib" : "🔒 Terkunci";
  tagJalur.className = "krs-tag " + (state.lulusPbo ? "text-cyan-sm" : "text-salmon-sm");
  cbJalur.disabled = !state.lulusPbo;

  if (!state.lulusPbo) {
    cbJalur.checked = false;
    cbJalur.removeAttribute("data-saran");
    pboSedangTerkunci = true;
  } else {
    cbJalur.setAttribute("data-saran", "true");
    if (pboSedangTerkunci) {
      cbJalur.checked = true;
      pboSedangTerkunci = false;
    }
  }

  // C. Remediasi Matematika Diskrit di Layar 5
  const itemMatdis = document.getElementById("krs-item-matdis");
  const cbMatdis = document.getElementById("cb-krs-matdis");

  aturCatatan(
    "note-matdis", "note-matdis-icon", null, "note-matdis-desc", "note-matdis-badge",
    state.lulusMatdis ? "lulus" : "ulang",
    state.lulusMatdis
      ? "Nilai " + state.hurufMatdis + " telah lulus (tidak perlu remediasi)"
      : "Prioritas remediasi nilai " + state.hurufMatdis + " sebelum Tugas Akhir"
  );

  itemMatdis.hidden = state.lulusMatdis;
  cbMatdis.disabled = state.lulusMatdis;
  if (state.lulusMatdis) {
    cbMatdis.checked = false;
    cbMatdis.removeAttribute("data-saran");
    matdisSedangLulus = true;
  } else {
    cbMatdis.setAttribute("data-saran", "true");
    if (matdisSedangLulus) {
      cbMatdis.checked = true;
      matdisSedangLulus = false;
    }
  }

  // D. Remediasi dinamis untuk mata kuliah lain yang bernilai D/E di Layar 4
  const aktifKeys = new Set(state.mkGagalLain.map((m) => m.key));
  for (const k of statusCekRemediasi.keys()) {
    if (!aktifKeys.has(k)) statusCekRemediasi.delete(k);
  }

  document.getElementById("note-extra-remediasi").innerHTML = state.mkGagalLain.map((m) => `
    <div class="note-row">
      <div class="row-gap">
        <img src="assets/krs/1a0ef.svg" alt="">
        <div>
          <strong>${escapeHtml(m.nama)}</strong>
          <p class="muted">Remediasi nilai ${escapeHtml(m.huruf)} dari semester lalu</p>
        </div>
      </div>
      <span class="text-peach-bold">↻ Ulang</span>
    </div>
  `).join("");

  document.getElementById("krs-remediasi-list").innerHTML = state.mkGagalLain.map((m) => {
    const checked = statusCekRemediasi.has(m.key) ? statusCekRemediasi.get(m.key) : true;
    statusCekRemediasi.set(m.key, checked);
    return `
      <label class="krs-item">
        <input type="checkbox" class="krs-check" value="${m.sks}" data-remediasi-key="${escapeHtml(m.key)}" data-saran="true" ${checked ? "checked" : ""}>
        <div class="krs-info">
          <div>
            <strong>${escapeHtml(m.nama)} <span class="krs-tag text-peach-bold">↻ Remediasi (${escapeHtml(m.huruf)})</span></strong>
            <p class="muted"><span class="mono-inline">${escapeHtml(m.kode)}</span> • Kelas Perbaikan</p>
          </div>
          <span class="sks-label mono-num">${m.sks} SKS</span>
        </div>
      </label>
    `;
  }).join("");

  document.getElementById("krs-note-count").textContent = (3 + state.mkGagalLain.length) + " Catatan";

  // E. Buka kunci Keamanan Informasi jika Jaringan Komputer ditambahkan & lulus (>= C) di Layar 4
  const lockedItem = document.getElementById("krs-locked-item");
  const cbKeamanan = document.getElementById("cb-krs-keamanan");

  aturCatatan(
    "note-keamanan", "note-keamanan-icon", "note-keamanan-judul", "note-keamanan-desc", "note-keamanan-badge",
    state.lulusJarkom ? "ok" : "kunci",
    state.lulusJarkom ? "Prasyarat Jaringan Komputer terpenuhi" : "Menunggu nilai Jarkom keluar"
  );

  lockedItem.classList.toggle("disabled", !state.lulusJarkom);
  document.getElementById("krs-keamanan-judul").classList.toggle("strike", !state.lulusJarkom);
  document.getElementById("krs-keamanan-tag").textContent = state.lulusJarkom ? "✓ Pilihan" : "🔒 Terkunci";
  document.getElementById("krs-keamanan-tag").className = "krs-tag " + (state.lulusJarkom ? "text-cyan-sm" : "text-salmon-sm");
  document.getElementById("krs-keamanan-desc").innerHTML = state.lulusJarkom
    ? '<span class="mono-inline">CIF62005</span> • Kelas A (Lab Jarkom)'
    : '<span class="mono-inline">CIF62005</span> • Prasyarat belum tuntas';

  if (state.lulusJarkom) {
    lockedItem.removeAttribute("aria-disabled");
    lockedItem.removeAttribute("role");
    lockedItem.removeAttribute("tabindex");
    cbKeamanan.disabled = false;
    cbKeamanan.classList.add("krs-check");
    cbKeamanan.removeAttribute("tabindex");
  } else {
    lockedItem.setAttribute("aria-disabled", "true");
    lockedItem.setAttribute("role", "button");
    lockedItem.setAttribute("tabindex", "0");
    cbKeamanan.checked = false;
    cbKeamanan.disabled = true;
    cbKeamanan.classList.remove("krs-check");
    cbKeamanan.setAttribute("tabindex", "-1");
  }

  // F. Beban maksimal SKS dinamis sesuai IPK/IPS & hitung ulang total KRS
  batasMaksSks = batasSksDariIPK(state.ipk);
  document.getElementById("krs-max-sks").textContent = batasMaksSks;
  hitungKRS();
}

// 8. Kalkulasi real-time kuota SKS pada Layar 5 sesuai batasMaksSks
function hitungKRS(changedBox) {
  const checks = [...document.querySelectorAll(".krs-check")].filter((cb) => !cb.disabled);
  let totalSks = 0;
  let totalMk = 0;

  checks.forEach((cb) => {
    if (cb.checked) {
      totalSks += Number(cb.value);
      totalMk += 1;
    }
  });

  if (totalSks > batasMaksSks) {
    if (changedBox) {
      changedBox.checked = false;
      if (changedBox.dataset.remediasiKey) statusCekRemediasi.set(changedBox.dataset.remediasiKey, false);
      tampilPesan("! Melebihi batas maksimal " + batasMaksSks + " SKS.");
      return hitungKRS();
    }
    // Jika kuota turun akibat penurunan IPK, kurangi centang non-remediasi lebih dulu dari bawah
    const urutanPangkas = [
      ...checks.filter((cb) => cb.checked && !cb.dataset.remediasiKey && cb.id !== "cb-krs-matdis").reverse(),
      ...checks.filter((cb) => cb.checked).reverse()
    ];
    for (const cb of urutanPangkas) {
      if (totalSks <= batasMaksSks) break;
      if (!cb.checked) continue;
      cb.checked = false;
      if (cb.dataset.remediasiKey) statusCekRemediasi.set(cb.dataset.remediasiKey, false);
      totalSks -= Number(cb.value);
      totalMk -= 1;
    }
  }

  document.getElementById("krs-total-sks").textContent = totalSks;
  document.getElementById("krs-sisa-sks").textContent = batasMaksSks - totalSks;
  document.getElementById("krs-total-mk").textContent = totalMk + " Mata Kuliah";
  return { totalSks, totalMk };
}

// 9. Render & ganti jalur pembanding di Layar 3 (selalu melewati jalurAktif agar tidak membandingkan jalur yang sama)
function renderTargetPembanding() {
  const key = URUTAN_JALUR[indexTarget];
  const d = DATA_JALUR[key];

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
}

function gantiTargetPembanding(tampilkanToast = true) {
  do {
    indexTarget = (indexTarget + 1) % URUTAN_JALUR.length;
  } while (URUTAN_JALUR[indexTarget] === jalurAktif);

  renderTargetPembanding();
  if (tampilkanToast) {
    tampilPesan("Pembanding diubah ke: " + DATA_JALUR[URUTAN_JALUR[indexTarget]].nama);
  }
}

// ==================== EVENT LISTENERS ====================

document.getElementById("btn-go-sso").addEventListener("click", masukAplikasi);

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

// Komparasi & Simulasi Jalur (Layar 3 -> Layar 2 & Layar 5)
document.getElementById("btn-ganti-target-top").addEventListener("click", () => gantiTargetPembanding(true));
document.getElementById("btn-toggle-target").addEventListener("click", () => gantiTargetPembanding(true));

document.getElementById("btn-simulasi-jalur").addEventListener("click", (e) => {
  const targetKey = URUTAN_JALUR[indexTarget];
  const d = DATA_JALUR[targetKey];
  jalankanLoading(e.currentTarget, () => {
    jalurAktif = targetKey;
    bukaKunciDrafKRS();
    gantiTargetPembanding(false);
    hitungAudit(false);
    bukaTab("krs");
    tampilPesan("Simulasi jalur " + d.short + " diterapkan ke Home & Rencana KRS!");
  });
});

document.getElementById("btn-konsul-banding").addEventListener("click", () => {
  tampilPesan("Permohonan konsultasi pindah jalur dikirim ke Dosen PA.");
});

// Input Nilai & Validasi Form Bebas Error (Layar 4 -> otomatis sinkron ke Layar 2, 3, 5)
["change", "input"].forEach((evt) => {
  document.getElementById("screen-nilai").addEventListener(evt, (e) => {
    if (e.target.classList.contains("grade-select")) hitungAudit(true);
  });
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

  const sem = document.getElementById("mk-sem-baru").value;
  const sks = document.getElementById("mk-sks-baru").value;
  const nilai = document.getElementById("mk-nilai-baru").value;

  const row = document.createElement("div");
  row.className = "mk-row";
  row.dataset.sks = sks;
  row.dataset.kode = "MKT6" + sem + String(document.querySelectorAll(".mk-row").length + 1).padStart(3, "0");

  const info = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = nama;
  const span = document.createElement("span");
  span.className = "mono-code";
  span.textContent = row.dataset.kode + " • " + sks + " SKS";
  info.append(strong, span);

  const select = document.createElement("select");
  select.className = "grade-select";
  select.setAttribute("aria-label", "Nilai " + nama);
  [["4", "A"], ["3.5", "B+"], ["3", "B"], ["2.5", "C+"], ["2", "C"], ["1", "D"], ["0", "E"]].forEach(([val, huruf]) => {
    select.add(new Option(huruf, val, false, val === nilai));
  });

  row.append(info, select);
  document.getElementById("list-sem-" + sem).appendChild(row);
  inputNama.value = "";
  document.getElementById("dialog-tambah").close();
  hitungAudit(true);
  tampilPesan("Mata kuliah " + nama + " ditambahkan ke Semester " + sem + ".");
});

document.getElementById("btn-simpan-nilai").addEventListener("click", (e) => {
  jalankanLoading(e.currentTarget, () => {
    hitungAudit(false);
    bukaTab("krs");
    tampilPesan("Audit kurikulum selesai! Rencana KRS telah diperbarui.");
  });
});

// Penyusunan KRS, Error Prevention Matkul Terkunci, & Dialog Konfirmasi 4 Elemen (Layar 5)
document.getElementById("krs-list").addEventListener("change", (e) => {
  if (e.target.classList.contains("krs-check")) {
    bukaKunciDrafKRS();
    if (e.target.dataset.remediasiKey) {
      statusCekRemediasi.set(e.target.dataset.remediasiKey, e.target.checked);
    }
    hitungKRS(e.target);
  }
});

document.getElementById("krs-item-jalur").addEventListener("click", () => {
  if (document.getElementById("cb-krs-jalur").disabled) {
    tampilPesan("🔒 Diblokir: Prasyarat PBO minimal C untuk mengambil " + DATA_JALUR[jalurAktif].wajibSem4.nama + ".");
  }
});

// Trigger Error Prevention Keamanan Informasi (terkunci saat Jarkom belum lulus, bisa dipilih saat sudah lulus)
const lockedItem = document.getElementById("krs-locked-item");
function interaksiKeamanan(e) {
  const cb = document.getElementById("cb-krs-keamanan");
  if (cb.disabled) {
    tampilPesan("🔒 Diblokir: Prasyarat Keamanan Informasi belum tuntas (Menunggu nilai Jarkom keluar).");
    return;
  }
  if (e.target !== cb) {
    cb.checked = !cb.checked;
    bukaKunciDrafKRS();
    hitungKRS(cb);
  }
}
lockedItem.addEventListener("click", interaksiKeamanan);
lockedItem.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    interaksiKeamanan(e);
  }
});

document.getElementById("btn-pilih-saran").addEventListener("click", () => {
  bukaKunciDrafKRS();
  document.querySelectorAll(".krs-check[data-saran]").forEach((cb) => {
    if (!cb.disabled) {
      cb.checked = true;
      if (cb.dataset.remediasiKey) statusCekRemediasi.set(cb.dataset.remediasiKey, true);
    }
  });
  const { totalSks } = hitungKRS();
  tampilPesan("✓ Mata kuliah saran (" + totalSks + " SKS) berhasil dipilih.");
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
    "Setelah dikunci, draf " + totalMk + " mata kuliah jalur " + DATA_JALUR[jalurAktif].short +
    " ini akan masuk ke antrean validasi Dosen PA (Mahardeka Tri Ananta, S.Kom., M.T., M.Sc.) dan tidak dapat diubah sebelum dibuka kembali oleh PA.";
  document.getElementById("dialog-konfirmasi").showModal();
});

document.getElementById("btn-konfirmasi-ya").addEventListener("click", (e) => {
  jalankanLoading(e.currentTarget, () => {
    krsTerkunci = true;
    document.getElementById("dialog-konfirmasi").close();
    document.getElementById("krs-status-badge").textContent = "✓ Terkunci di Antrean SIAM";
    document.getElementById("btn-kunci-label").textContent = "✓ Rencana KRS Terkunci & Terkirim";
    document.getElementById("btn-ajukan-krs").disabled = true;
    tampilPesan("✓ Rencana KRS resmi dikunci & dikirim ke antrean validasi Dosen PA!");
  });
});

// Self-check rumus IPK & inisialisasi awal seluruh layar
console.assert(hitungIPKData([[4, 4], [4, 3]]) === "3.50", "Self-check IPK harus 3.50");
renderTargetPembanding();
hitungAudit(false);
