import { useEffect, useState } from "react";
import {
  ChevronDown,
  Users,
  Download,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { API, getAuthHeaders } from "../api";

export default function LaporanPenjualan() {
  const [openNasabah, setOpenNasabah] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statistik, setStatistik] = useState({
    totalTransaksi: 0,
    totalBerat: 0,
    totalPembayaran: 0,
  });

  const [jenisSampah, setJenisSampah] = useState([]);
  const [nasabahRows, setNasabahRows] = useState([]);

  // ======================================================
  // FETCH RIWAYAT TRANSAKSI
  // ======================================================
  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        setLoading(true);
        setError("");

        /*
          Sesuai endpoint PDF:
          GET http://localhost:8000/transaksi/history
        */
        const response = await fetch(API.transaksiHistory, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(
            "Gagal mengambil riwayat transaksi."
          );
        }

        const result = await response.json();

        /*
          Antisipasi response:
          [
            {...},
            {...}
          ]

          atau:

          {
            data: [...]
          }
        */
        const history = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
          ? result.data
          : [];

        /*
          Backend bisa mengirim detail transaksi
          dalam bentuk array.

          Contoh:
          {
            nik: "...",
            detail: [
              {
                id_jenis: 1,
                berat: 5
              }
            ]
          }

          Kita flatten supaya bisa ditampilkan
          satu baris per jenis sampah.
        */
        const flattened = history.flatMap(
          (trx) => {
            const details = Array.isArray(
              trx.detail
            )
              ? trx.detail
              : Array.isArray(trx.details)
              ? trx.details
              : null;

            // Kalau tidak ada detail array,
            // gunakan transaksi langsung.
            if (!details) {
              return [trx];
            }

            return details.map(
              (detail, index) => ({
                ...trx,
                ...detail,

                id_transaksi:
                  trx.id_transaksi ??
                  trx.transaksi_id ??
                  trx.id ??
                  `TRX-${index + 1}`,

                nik:
                  trx.nik ??
                  trx.nik_nasabah ??
                  "",

                jenis_sampah:
                  detail.nama_jenis ??
                  detail.jenis_sampah ??
                  trx.jenis_sampah ??
                  trx.nama_jenis ??
                  "Tidak diketahui",

                berat:
                  detail.berat ??
                  trx.berat ??
                  0,

                total:
                  detail.total ??
                  detail.nominal ??
                  trx.total ??
                  trx.nominal ??
                  trx.jumlah ??
                  0,
              })
            );
          }
        );

        /*
          Karena laporan yang dipakai hanya transaksi
          nasabah, ambil data yang memiliki NIK.
        */
        const nasabah = flattened.filter(
          (item) => item.nik
        );

        setNasabahRows(nasabah);

        // ==================================================
        // TOTAL BERAT
        // ==================================================
        const totalBerat =
          nasabah.reduce(
            (sum, item) =>
              sum +
              Number(item.berat || 0),
            0
          );

        // ==================================================
        // TOTAL PEMBAYARAN
        // ==================================================
        const totalPembayaran =
          nasabah.reduce(
            (sum, item) =>
              sum +
              Number(
                item.total ??
                  item.nominal ??
                  item.jumlah ??
                  0
              ),
            0
          );

        // ==================================================
        // JENIS SAMPAH TERBANYAK
        // ==================================================
        const byJenis = {};

        nasabah.forEach((item) => {
          const nama =
            item.jenis_sampah ??
            item.nama_jenis ??
            "Tidak diketahui";

          byJenis[nama] =
            (byJenis[nama] || 0) +
            Number(item.berat || 0);
        });

        const jenisData = Object.entries(
          byJenis
        )
          .map(([nama, berat]) => ({
            nama,
            berat,
          }))
          .sort(
            (a, b) =>
              b.berat - a.berat
          );

        setJenisSampah(jenisData);

        // ==================================================
        // STATISTIK
        // ==================================================
        setStatistik({
          totalTransaksi:
            history.length,
          totalBerat,
          totalPembayaran,
        });
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Terjadi kesalahan saat mengambil data laporan."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLaporan();
  }, []);

  // ======================================================
  // FORMAT RUPIAH
  // ======================================================
  const formatRupiah = (value) => {
    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(Number(value || 0));
  };

  // ======================================================
  // FORMAT BERAT
  // ======================================================
  const formatBerat = (value) => {
    return `${Number(
      value || 0
    ).toLocaleString("id-ID")} kg`;
  };

  // ======================================================
  // TOTAL BERAT SEMUA JENIS SAMPAH
  // ======================================================
  const totalBeratSampah =
    jenisSampah.reduce(
      (total, item) =>
        total +
        Number(item.berat || 0),
      0
    );

  // ======================================================
  // DOWNLOAD LAPORAN
  // ======================================================
  const downloadExcel = () => {
    if (nasabahRows.length === 0) {
      alert(
        "Belum ada data transaksi nasabah."
      );
      return;
    }

    const headers = [
      "Tanggal",
      "ID Transaksi",
      "NIK Nasabah",
      "Jenis Sampah",
      "Berat (kg)",
      "Total",
    ];

    const rows =
      nasabahRows.map((row) => [
        row.tanggal ??
          row.created_at ??
          "",

        row.id_transaksi ??
          row.transaksi_id ??
          row.id ??
          "",

        row.nik ??
          row.nik_nasabah ??
          "",

        row.jenis_sampah ??
          row.nama_jenis ??
          "",

        row.berat ?? 0,

        row.total ??
          row.nominal ??
          row.jumlah ??
          0,
      ]);

    /*
      Dibuat CSV supaya bisa dibuka
      menggunakan Excel.
    */
    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value
              ).replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      ["\ufeff" + csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "laporan-transaksi-nasabah.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  };

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <PageHeader title="Laporan Penjualan" />

      {/* ==================================================
          ERROR
      ================================================== */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* ==================================================
          LOADING
      ================================================== */}
      {loading && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-500 shadow-sm">
          Memuat data laporan...
        </div>
      )}

      {/* ==================================================
          STATISTIK
      ================================================== */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* TOTAL TRANSAKSI */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">
            Total Transaksi
          </p>

          <p className="mt-2 break-words font-['Poppins'] text-2xl font-bold text-emerald-900">
            {statistik.totalTransaksi.toLocaleString(
              "id-ID"
            )}
          </p>
        </div>

        {/* TOTAL BERAT */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">
            Total Berat
          </p>

          <p className="mt-2 break-words font-['Poppins'] text-2xl font-bold text-emerald-900">
            {formatBerat(
              statistik.totalBerat
            )}
          </p>
        </div>

        {/* TOTAL PEMBAYARAN */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">
            Total Pembayaran
          </p>

          <p className="mt-2 break-words font-['Poppins'] text-2xl font-bold text-emerald-900">
            {formatRupiah(
              statistik.totalPembayaran
            )}
          </p>
        </div>
      </div>

      {/* ==================================================
          JENIS SAMPAH TERBANYAK
      ================================================== */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

        <h2 className="mb-5 font-['Poppins'] text-xl font-bold text-slate-800">
          Jenis Sampah Terbanyak
        </h2>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">

          {/* ==================================================
              DONUT CHART
          ================================================== */}
          <div className="flex justify-center">
            <div className="relative h-64 w-64">

              <svg
                viewBox="0 0 100 100"
                className="h-full w-full -rotate-90"
              >
                {/* BACKGROUND CIRCLE */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="18"
                />

                {(() => {
                  const circumference =
                    2 *
                    Math.PI *
                    40;

                  let offset = 0;

                  const colors = [
                    "#3b82f6",
                    "#a855f7",
                    "#f59e0b",
                    "#eab308",
                  ];

                  return jenisSampah
                    .slice(0, 4)
                    .map(
                      (
                        item,
                        index
                      ) => {
                        const percentage =
                          totalBeratSampah >
                          0
                            ? Number(
                                item.berat
                              ) /
                              totalBeratSampah
                            : 0;

                        const dash =
                          percentage *
                          circumference;

                        const currentOffset =
                          offset;

                        offset += dash;

                        return (
                          <circle
                            key={
                              item.nama
                            }
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={
                              colors[
                                index
                              ] ||
                              "#94a3b8"
                            }
                            strokeWidth="18"
                            strokeDasharray={`${dash} ${circumference}`}
                            strokeDashoffset={
                              -currentOffset
                            }
                          />
                        );
                      }
                    );
                })()}
              </svg>

              {/* CENTER TEXT */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">

                  <p className="text-xs text-slate-400">
                    Total
                  </p>

                  <p className="font-['Poppins'] text-xl font-bold text-emerald-900">
                    {formatBerat(
                      totalBeratSampah
                    )}
                  </p>

                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              LEGEND
          ================================================== */}
          <div className="space-y-4">

            {jenisSampah.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                Belum ada data jenis sampah.
              </div>
            ) : (
              jenisSampah.map(
                (item, index) => {
                  const persen =
                    totalBeratSampah >
                    0
                      ? (
                          (Number(
                            item.berat
                          ) /
                            totalBeratSampah) *
                          100
                        ).toFixed(2)
                      : 0;

                  return (
                    <div
                      key={
                        item.nama
                      }
                      className="flex flex-wrap items-center justify-between gap-3"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <span
                          className={`h-3.5 w-3.5 shrink-0 rounded-md ${
                            index === 0
                              ? "bg-blue-500"
                              : index === 1
                              ? "bg-purple-500"
                              : index === 2
                              ? "bg-amber-500"
                              : "bg-yellow-300"
                          }`}
                        />

                        <span className="break-words text-base text-slate-800">
                          {item.nama}
                        </span>

                      </div>

                      <div className="shrink-0 text-right">

                        <b className="font-['Poppins'] text-lg text-slate-800">
                          {formatBerat(
                            item.berat
                          )}
                        </b>

                        <p className="text-xs text-slate-400">
                          {persen}%
                        </p>

                      </div>

                    </div>
                  );
                }
              )
            )}

          </div>
        </div>
      </section>

      {/* ==================================================
          LAPORAN NASABAH
      ================================================== */}
      <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">

          <div className="flex min-w-0 items-center gap-3">

            <Users
              size={20}
              className="shrink-0 text-emerald-600"
            />

            <div className="min-w-0">

              <h2 className="break-words font-['Poppins'] text-lg font-bold text-emerald-900">
                Laporan Nasabah
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Riwayat transaksi sampah dari nasabah
              </p>

            </div>
          </div>

          {/* BUTTON */}
          <div className="flex flex-wrap gap-2">

            {/* DOWNLOAD */}
            <button
              onClick={
                downloadExcel
              }
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <Download
                size={16}
              />

              <span>
                Download Excel
              </span>
            </button>

            {/* TOGGLE */}
            <button
              onClick={() =>
                setOpenNasabah(
                  !openNasabah
                )
              }
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              <span>
                {openNasabah
                  ? "Tutup Laporan"
                  : "Lihat Laporan"}
              </span>

              <ChevronDown
                size={17}
                className={`transition ${
                  openNasabah
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

          </div>
        </div>

        {/* ==================================================
            TABLE
        ================================================== */}
        {openNasabah && (
          <div className="border-t border-slate-200 p-4 sm:p-6">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left text-sm">

                <thead className="bg-slate-100 text-xs font-bold uppercase text-slate-500">

                  <tr>

                    <th className="px-5 py-4">
                      Tanggal
                    </th>

                    <th className="px-5 py-4">
                      ID Transaksi
                    </th>

                    <th className="px-5 py-4">
                      NIK Nasabah
                    </th>

                    <th className="px-5 py-4">
                      Jenis Sampah
                    </th>

                    <th className="px-5 py-4">
                      Berat
                    </th>

                    <th className="px-5 py-4">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {nasabahRows.length >
                  0 ? (
                    nasabahRows.map(
                      (
                        row,
                        index
                      ) => (
                        <tr
                          key={
                            row.id ||
                            row.id_transaksi ||
                            index
                          }
                          className="border-t border-slate-100"
                        >

                          <td className="px-5 py-4">
                            {row.tanggal ??
                              row.created_at ??
                              "-"}
                          </td>

                          <td className="px-5 py-4 font-semibold">
                            {row.id_transaksi ??
                              row.transaksi_id ??
                              row.id ??
                              "-"}
                          </td>

                          <td className="px-5 py-4 font-mono text-xs">
                            {row.nik ??
                              row.nik_nasabah ??
                              "-"}
                          </td>

                          <td className="px-5 py-4">
                            {row.jenis_sampah ??
                              row.nama_jenis ??
                              "-"}
                          </td>

                          <td className="px-5 py-4">
                            {formatBerat(
                              row.berat
                            )}
                          </td>

                          <td className="px-5 py-4 font-bold text-emerald-700">
                            {formatRupiah(
                              row.total ??
                                row.nominal ??
                                row.jumlah ??
                                0
                            )}
                          </td>

                        </tr>
                      )
                    )
                  ) : (
                    <tr>

                      <td
                        colSpan="6"
                        className="px-5 py-8 text-center text-slate-400"
                      >
                        Belum ada data transaksi nasabah.
                      </td>

                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}