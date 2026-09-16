import { useEffect, useState } from "react";
import {
  Bell,
  WalletCards,
} from "lucide-react";

import PhoneShell from "../components/PhoneShell";
import BottomNav from "../components/BottomNav";
import {
  API,
  getAuthHeaders,
  parseResponse,
} from "../api";

const fallbackPrices = [
  {
    name: "Plastik PET",
    price: 3000,
  },
  {
    name: "Kardus / HVS",
    price: 2000,
  },
  {
    name: "Besi / Logam",
    price: 6500,
  },
];

export default function Dashboard({
  onNavigate,
  onLogout,
}) {
  const [profile, setProfile] =
    useState(null);

  const [profileError, setProfileError] =
    useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(
          API.profile,
          {
            headers: getAuthHeaders(),
          }
        );

        const data =
          await parseResponse(response);

        setProfile(
          data?.data || data
        );
      } catch (err) {
        setProfileError(
          err.message ||
            "Gagal memuat data profil."
        );
      }
    };

    loadProfile();
  }, []);

  const name =
    profile?.nama_nasabah ||
    profile?.nama ||
    "Rahma Fauziah";

  const saldo =
    profile?.saldo ??
    profile?.balance ??
    142500;

  const nav = (id) => {
    if (id === "profile") {
      onNavigate("profile");
    } else if (id === "withdraw") {
      onNavigate("withdraw");
    } else if (id === "chat") {
      onNavigate("chat");
    }
  };

  return (
    <PhoneShell
      bottom={
        <BottomNav
          active="dashboard"
          onNavigate={nav}
        />
      }
    >
      <div className="min-h-[820px] bg-slate-50">

        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              Selamat Datang,
            </p>

            <h1 className="font-poppins text-lg font-bold text-emerald-900">
              {name}
            </h1>
          </div>

          <button
            type="button"
            className="relative flex size-10 items-center justify-center rounded-full bg-emerald-50"
          >
            <Bell
              size={18}
              className="text-emerald-600"
            />

            <span className="absolute right-1 top-1 size-2 rounded-sm bg-red-500" />
          </button>
        </header>

        <main className="space-y-5 px-6 py-5">

          {/* Saldo */}
          <section className="rounded-2xl bg-gradient-to-bl from-emerald-900 to-emerald-600 p-5 text-white shadow-[0_10px_20px_rgba(5,150,105,.20)]">
            <p className="text-xs">
              Total Saldo Tabungan Sampah
            </p>

            <p className="mt-2 font-poppins text-2xl font-bold">
              Rp{" "}
              {Number(saldo).toLocaleString(
                "id-ID"
              )}
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs opacity-80">
              <WalletCards size={13} />

              <span>
                Siap ditarik kapan saja ke
                rekeningmu
              </span>
            </div>
          </section>

          {/* Pengumuman */}
          <section className="rounded-2xl border border-amber-200 bg-amber-100 p-4">
            <div className="flex gap-3">
              <Bell
                size={17}
                className="mt-1 shrink-0 text-amber-500"
              />

              <div>
                <p className="font-poppins text-xs font-bold text-amber-800">
                  Pengumuman Admin
                </p>

                <p className="mt-2 text-xs leading-4 text-amber-700">
                  Jadwal operasional bank
                  sampah minggu ini libur
                  pada hari Kamis dalam
                  rangka pemeliharaan mesin
                  sortir.
                </p>
              </div>
            </div>
          </section>

          {/* Harga Sampah */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-poppins text-sm text-slate-800">
                Update Harga Sampah / kg
              </h2>

              <button
                type="button"
                className="text-xs font-bold text-emerald-600"
              >
                Lihat Semua
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {fallbackPrices.map(
                (item) => (
                  <div
                    key={item.name}
                    className="flex h-16 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white"
                  >
                    <span className="text-center text-[11px] font-semibold text-slate-500">
                      {item.name}
                    </span>

                    <b className="mt-1 text-xs text-emerald-600">
                      Rp{" "}
                      {item.price.toLocaleString(
                        "id-ID"
                      )}
                    </b>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Setoran Terakhir */}
          <section>
            <h2 className="mb-3 font-poppins text-sm text-slate-800">
              Setoran Terakhir
            </h2>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Plastik PET & Kardus
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  2 Juli 2026 • 14:46 WIB
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-emerald-600">
                  + Rp 13.750
                </p>

                <span className="mt-1 inline-block rounded-sm bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-500">
                  Berhasil
                </span>
              </div>
            </div>
          </section>

          {/* Profile Error */}
          {profileError && (
            <p className="text-[11px] text-amber-700">
              Data profil belum dapat
              dimuat: {profileError}
            </p>
          )}

        </main>
      </div>
    </PhoneShell>
  );
}