import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  Loader2,
} from "lucide-react";
import PhoneShell from "../components/PhoneShell";
import { API, parseResponse } from "../api";

const initialForm = {
  nik: "",
  nama_nasabah: "",
  no_hp: "",
  no_rekening: "",
  nama_bank: "",
  nama_pemilik_rekening: "",
  alamat: "",
  foto: null,
};

// ======================================================
// FIELD COMPONENT
// Dibuat di luar Register agar input tidak kehilangan
// focus setiap kali user mengetik.
// ======================================================
function Field({
  label,
  name,
  placeholder,
  required = true,
  value,
  onChange,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-500">
        {label}{" "}
        {required && (
          <b className="text-red-500">*</b>
        )}
      </span>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs outline-none focus:border-emerald-500"
      />
    </label>
  );
}

export default function Register({ onNavigate }) {
  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ======================================================
  // UPDATE FORM
  // ======================================================
  const update = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // SUBMIT REGISTER
  // ======================================================
  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Field yang wajib sesuai endpoint PDF
    const required = [
      "nik",
      "nama_nasabah",
      "no_hp",
      "no_rekening",
      "nama_bank",
      "nama_pemilik_rekening",
    ];

    if (
      required.some(
        (key) =>
          !String(form[key]).trim()
      )
    ) {
      setError(
        "Lengkapi semua data yang wajib diisi."
      );

      return;
    }

    // Validasi NIK 16 digit
    if (!/^\d{16}$/.test(form.nik)) {
      setError(
        "NIK harus terdiri dari 16 digit."
      );

      return;
    }

    setLoading(true);

    try {
      // ==================================================
      // ENDPOINT SESUAI PDF
      //
      // POST http://localhost:8000/nasabah/register
      //
      // Body:
      // nik
      // nama_nasabah
      // no_hp
      // no_rekening
      // nama_bank
      // nama_pemilik_rekening
      // alamat
      // ==================================================
      const payload = {
        nik: form.nik,
        nama_nasabah: form.nama_nasabah,
        no_hp: form.no_hp,
        no_rekening: form.no_rekening,
        nama_bank: form.nama_bank,
        nama_pemilik_rekening:
          form.nama_pemilik_rekening,
        alamat: form.alamat,
      };

      const response = await fetch(
        API.register,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      await parseResponse(response);

      setSuccess(
        "Registrasi berhasil. Silakan login menggunakan NIK."
      );

      setTimeout(() => {
        onNavigate("login");
      }, 900);
    } catch (err) {
      setError(
        err.message ||
          "Registrasi gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneShell>
      <div className="min-h-[1115px] bg-slate-50">

        {/* ==================================================
            HEADER
        ================================================== */}
        <header className="sticky top-0 z-10 flex h-12 items-center gap-4 border-b border-slate-300 bg-white px-6">
          <button
            type="button"
            onClick={() =>
              onNavigate("welcome")
            }
          >
            <ArrowLeft
              size={18}
              className="text-slate-500"
            />
          </button>

          <h1 className="font-poppins text-sm font-bold text-emerald-900">
            Registrasi & Data Nasabah
          </h1>
        </header>

        {/* ==================================================
            FORM
        ================================================== */}
        <form
          onSubmit={submit}
          className="space-y-8 px-6 py-5"
        >

          {/* ==================================================
              1. INFORMASI IDENTITAS
          ================================================== */}
          <section>
            <h2 className="font-poppins text-base font-bold text-emerald-900">
              1. Informasi Identitas (Profil)
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Masukkan data diri sesuai
              identitas resmi Anda.
            </p>

            <div className="mt-5 space-y-4">

              <Field
                label="NIK"
                name="nik"
                placeholder="16 digit NIK unik (PK)"
                value={form.nik}
                onChange={update}
              />

              <Field
                label="Nama Nasabah"
                name="nama_nasabah"
                placeholder="Nama lengkap sesuai KTP"
                value={
                  form.nama_nasabah
                }
                onChange={update}
              />

              <Field
                label="No. HP / WhatsApp"
                name="no_hp"
                placeholder="Contoh: 08123456789"
                value={form.no_hp}
                onChange={update}
              />

            </div>
          </section>

          {/* ==================================================
              2. INFORMASI REKENING
          ================================================== */}
          <section>
            <h2 className="font-poppins text-base font-bold text-emerald-900">
              2. Informasi Rekening Pencairan
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Rekening tujuan untuk penarikan
              saldo hasil sampah.
            </p>

            <div className="mt-5 space-y-4">

              <Field
                label="Nomor Rekening / E-Wallet"
                name="no_rekening"
                placeholder="Contoh: 1234567890"
                value={
                  form.no_rekening
                }
                onChange={update}
              />

              <Field
                label="Nama Bank / E-Wallet"
                name="nama_bank"
                placeholder="Contoh: BCA / DANA / OVO"
                value={
                  form.nama_bank
                }
                onChange={update}
              />

              <Field
                label="Nama Pemilik Rekening"
                name="nama_pemilik_rekening"
                placeholder="Nama pemilik sesuai buku rekening"
                value={
                  form.nama_pemilik_rekening
                }
                onChange={update}
              />

            </div>
          </section>

          {/* ==================================================
              3. INFORMASI TAMBAHAN
          ================================================== */}
          <section>
            <h2 className="font-poppins text-base font-bold text-emerald-900">
              3. Informasi Tambahan
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Alamat domisili dan foto profil
              akun.
            </p>

            <div className="mt-5 space-y-4">

              {/* ALAMAT */}
              <label className="block">
                <span className="text-xs font-bold text-slate-500">
                  Alamat
                </span>

                <textarea
                  name="alamat"
                  value={form.alamat}
                  onChange={update}
                  placeholder="Alamat lengkap tempat tinggal..."
                  className="mt-2 h-20 w-full rounded-lg border border-slate-300 bg-white p-3 text-xs outline-none focus:border-emerald-500"
                />
              </label>

              {/* FOTO PROFIL */}
              <label className="block cursor-pointer">
                <span className="text-xs font-bold text-slate-500">
                  Foto Profil (Opsional)
                </span>

                <div className="mt-2 flex h-14 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-500">

                  <span className="flex size-9 items-center justify-center rounded-2xl bg-emerald-50">
                    <Camera
                      size={17}
                      className="text-emerald-600"
                    />
                  </span>

                  <span className="min-w-0 truncate">
                    {form.foto
                      ? form.foto.name
                      : "Ketuk untuk unggah foto profil"}
                  </span>

                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      foto:
                        e.target.files?.[0] ||
                        null,
                    }))
                  }
                />
              </label>

            </div>
          </section>

          {/* ==================================================
              ERROR
          ================================================== */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* ==================================================
              SUCCESS
          ================================================== */}
          {success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
              {success}
            </div>
          )}

          {/* ==================================================
              SUBMIT
          ================================================== */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-emerald-600 font-poppins text-sm font-semibold text-white shadow-[0_4px_12px_rgba(5,150,105,.20)] disabled:opacity-60"
          >
            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            {loading
              ? "Menyimpan..."
              : "Konfirmasi & Simpan Data"}
          </button>

        </form>
      </div>
    </PhoneShell>
  );
}