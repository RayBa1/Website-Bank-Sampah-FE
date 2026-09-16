import { useState } from "react";
import {
  ArrowLeft,
  Loader2,
} from "lucide-react";
import PhoneShell from "../components/PhoneShell";
import {
  API,
  parseResponse,
} from "../api";

export default function Login({
  onNavigate,
  onLoggedIn,
}) {
  const [nik, setNik] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ======================================================
  // SUBMIT LOGIN
  // ======================================================
  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (!nik.trim()) {
      setError("NIK harus diisi.");
      return;
    }

    if (!/^\d{16}$/.test(nik)) {
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
      // POST /auth/nasabah/login
      //
      // Body:
      // {
      //   nik: "1234567890123456"
      // }
      // ==================================================
      const response = await fetch(
        API.login,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            nik: nik.trim(),
          }),
        }
      );

      const result =
        await parseResponse(response);

      // Ambil token jika backend mengembalikannya
      const token =
        result?.access_token ||
        result?.token ||
        result?.data?.access_token ||
        result?.data?.token ||
        result?.session_token;

      if (token) {
        localStorage.setItem(
          "nasabah_access_token",
          token
        );
      }

      // Simpan NIK untuk kebutuhan aplikasi
      localStorage.setItem(
        "nasabah_nik",
        nik.trim()
      );

      onLoggedIn();
    } catch (err) {
      setError(
        err.message ||
          "Login gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneShell>
      <main className="min-h-[calc(100vh-40px)] bg-gradient-to-b from-white to-emerald-50 px-7 py-10 sm:min-h-[820px]">

        {/* ==================================================
            BACK BUTTON
        ================================================== */}
        <button
          type="button"
          onClick={() =>
            onNavigate("welcome")
          }
          className="text-slate-500"
        >
          <ArrowLeft size={20} />
        </button>

        {/* ==================================================
            TITLE
        ================================================== */}
        <div className="mt-14 text-center">
          <h1 className="font-poppins text-2xl font-bold text-emerald-900">
            Login Nasabah
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Masuk menggunakan NIK Anda.
          </p>
        </div>

        {/* ==================================================
            LOGIN FORM
        ================================================== */}
        <form
          onSubmit={submit}
          className="mx-auto mt-12 max-w-sm space-y-5"
        >

          {/* NIK */}
          <label className="block">
            <span className="text-xs font-bold text-slate-500">
              NIK{" "}
              <b className="text-red-500">
                *
              </b>
            </span>

            <input
              type="text"
              inputMode="numeric"
              maxLength={16}
              value={nik}
              onChange={(e) =>
                setNik(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              placeholder="Masukkan 16 digit NIK"
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-500"
            />
          </label>

          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 font-poppins font-semibold text-white disabled:opacity-60"
          >
            {loading && (
              <Loader2
                size={17}
                className="animate-spin"
              />
            )}

            {loading
              ? "Memproses..."
              : "Login"}
          </button>
        </form>

        {/* ==================================================
            REGISTER LINK
        ================================================== */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() =>
              onNavigate("register")
            }
            className="font-bold text-emerald-600"
          >
            Daftar sekarang
          </button>
        </p>

      </main>
    </PhoneShell>
  );
}