import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Loader2,
} from "lucide-react";

import PhoneShell from "../components/PhoneShell";
import {
  API,
  getAuthHeaders,
  parseResponse,
} from "../api";

export default function Profile({
  onNavigate,
  onLogout,
}) {
  const [profile, setProfile] = useState({
    nik: "",
    nama_nasabah: "",
    no_hp: "",
    no_rekening: "",
    nama_bank: "",
    nama_pemilik_rekening: "",
    alamat: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(
          API.profile,
          {
            headers: getAuthHeaders(),
          }
        );

        const data = await parseResponse(
          response
        );

        setProfile((prev) => ({
          ...prev,
          ...(data?.data || data),
        }));
      } catch (err) {
        setError(
          err.message ||
            "Gagal memuat profil."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch(
        API.logout,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      await parseResponse(response);
    } catch {}

    localStorage.removeItem(
      "nasabah_access_token"
    );
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("nasabah_nik");

    onLogout();
  };

  const save = async () => {
    // Belum ada endpoint edit profile
    // di ENDPOINT.pdf.
    setSaving(true);

    setTimeout(() => {
      setSaving(false);

      alert(
        "Endpoint untuk menyimpan perubahan profil belum tersedia di PDF endpoint."
      );
    }, 200);
  };

  return (
    <PhoneShell>
      <div className="min-h-[1100px] bg-slate-50">

        {/* Header */}
        <header className="flex h-12 items-center gap-4 border-b border-slate-300 bg-white px-6">
          <button
            type="button"
            onClick={() =>
              onNavigate("dashboard")
            }
          >
            <ArrowLeft
              size={18}
              className="text-slate-500"
            />
          </button>

          <h1 className="font-poppins text-base font-bold text-emerald-900">
            Edit Profil Nasabah
          </h1>
        </header>

        <main className="px-6 py-5">

          {/* Foto Profil */}
          <div className="flex flex-col items-center">
            <div className="flex size-20 items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-50">
              <Camera
                size={27}
                className="text-emerald-600"
              />
            </div>

            <button
              type="button"
              className="mt-2 text-xs font-bold text-emerald-600"
            >
              Ganti Foto Profil
            </button>
          </div>

          {/* Data Akun & Identitas */}
          <section className="mt-16">
            <h2 className="font-poppins text-base font-bold text-emerald-900">
              Data Akun & Identitas
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              NIK bersifat unik dan tidak
              dapat diubah.
            </p>

            <div className="mt-5 space-y-4">

              {/* NIK */}
              <ReadOnly
                label="NIK (Primary Key)"
                value={
                  profile.nik ||
                  "3201234567890001"
                }
              />

              {/* Nama */}
              <Input
                label="Nama Nasabah"
                value={
                  profile.nama_nasabah ||
                  profile.nama ||
                  ""
                }
                onChange={(value) =>
                  setProfile((prev) => ({
                    ...prev,
                    nama_nasabah: value,
                  }))
                }
              />

              {/* No. HP */}
              <Input
                label="No. HP / WhatsApp"
                value={
                  profile.no_hp ||
                  profile.hp ||
                  ""
                }
                onChange={(value) =>
                  setProfile((prev) => ({
                    ...prev,
                    no_hp: value,
                  }))
                }
              />

            </div>
          </section>

          {/* Informasi Rekening */}
          <section className="mt-10">
            <h2 className="font-poppins text-base font-bold text-emerald-900">
              Informasi Rekening Pencairan
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Perbarui rekening bank tujuan
              transfer saldo.
            </p>

            <div className="mt-5 space-y-4">

              <Input
                label="Nomor Rekening / E-Wallet"
                value={
                  profile.no_rekening || ""
                }
                onChange={(value) =>
                  setProfile((prev) => ({
                    ...prev,
                    no_rekening: value,
                  }))
                }
              />

              <Input
                label="Nama Bank / E-Wallet"
                value={
                  profile.nama_bank || ""
                }
                onChange={(value) =>
                  setProfile((prev) => ({
                    ...prev,
                    nama_bank: value,
                  }))
                }
              />

              <Input
                label="Nama Pemilik Rekening"
                value={
                  profile.nama_pemilik_rekening ||
                  ""
                }
                onChange={(value) =>
                  setProfile((prev) => ({
                    ...prev,
                    nama_pemilik_rekening: value,
                  }))
                }
              />

            </div>
          </section>

          {/* Alamat */}
          <section className="mt-10">
            <h2 className="font-poppins text-base font-bold text-emerald-900">
              Alamat Domisili
            </h2>

            <label className="mt-5 block">
              <span className="text-xs font-bold text-slate-500">
                Alamat
              </span>

              <textarea
                value={profile.alamat || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    alamat: e.target.value,
                  }))
                }
                className="mt-2 h-20 w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-xs outline-none focus:border-emerald-500"
              />
            </label>
          </section>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
              {loading
                ? "Memuat profil..."
                : error}
            </div>
          )}

          {/* Save */}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-emerald-600 font-poppins text-xs font-semibold text-white disabled:opacity-60"
          >
            {saving && (
              <Loader2
                size={15}
                className="animate-spin"
              />
            )}

            {saving
              ? "Menyimpan..."
              : "Simpan Perubahan (Konfirmasi)"}
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className="mt-3 h-11 w-full rounded-[10px] border border-red-200 bg-white font-poppins text-xs font-semibold text-red-600"
          >
            Logout
          </button>

        </main>
      </div>
    </PhoneShell>
  );
}

/* =========================
   Read Only Input
========================= */

function ReadOnly({
  label,
  value,
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-500">
        {label}
      </span>

      <input
        type="text"
        value={value}
        readOnly
        className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-slate-100 px-3 text-xs text-slate-400 outline-none"
      />
    </label>
  );
}

/* =========================
   Input
========================= */

function Input({
  label,
  value,
  onChange,
  placeholder = "",
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-500">
        {label}
      </span>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs outline-none focus:border-emerald-500"
      />
    </label>
  );
}