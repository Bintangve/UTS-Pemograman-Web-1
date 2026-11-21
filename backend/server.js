const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Data dummy (sama dengan Project 1: frontend/js/data.js)
let informasi = [
  { id: 1, judul: "Profil Perusahaan Nabati", ringkasan: "Mengenal Nabati Group, produsen makanan ringan asal Indonesia.", isi: ["Paragraf 1...", "Paragraf 2...", "Paragraf 3..."] },
  { id: 2, judul: "Produk Unggulan Nabati", ringkasan: "Ragam produk wafer, biskuit, dan cokelat dari Nabati.", isi: ["Paragraf 1...", "Paragraf 2...", "Paragraf 3..."] },
  { id: 3, judul: "Komitmen Kualitas dan Inovasi", ringkasan: "Cara Nabati menjaga mutu produk dan terus berinovasi.", isi: ["Paragraf 1...", "Paragraf 2...", "Paragraf 3..."] }
];
let nextId = 4;

app.get("/", (req, res) => res.json({ message: "Nabati API berjalan" }));

// READ - semua data
app.get("/api/informasi", (req, res) => res.json({ data: informasi }));

// READ - satu data
app.get("/api/informasi/:id", (req, res) => {
  const item = informasi.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Data tidak ditemukan" });
  res.json({ data: item });
});

// CREATE
app.post("/api/informasi", (req, res) => {
  const { judul, ringkasan, isi } = req.body;
  if (!judul || !ringkasan || !Array.isArray(isi))
    return res.status(400).json({ message: "judul, ringkasan, dan isi (array) wajib diisi" });
  const item = { id: nextId++, judul, ringkasan, isi };
  informasi.push(item);
  res.status(201).json({ message: "Data berhasil ditambahkan", data: item });
});

// UPDATE
app.put("/api/informasi/:id", (req, res) => {
  const item = informasi.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Data tidak ditemukan" });
  const { judul, ringkasan, isi } = req.body;
  if (judul) item.judul = judul;
  if (ringkasan) item.ringkasan = ringkasan;
  if (Array.isArray(isi)) item.isi = isi;
  res.json({ message: "Data berhasil diubah", data: item });
});

// DELETE
app.delete("/api/informasi/:id", (req, res) => {
  const idx = informasi.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Data tidak ditemukan" });
  const [deleted] = informasi.splice(idx, 1);
  res.json({ message: "Data berhasil dihapus", data: deleted });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
