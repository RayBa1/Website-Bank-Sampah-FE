import {
  ArrowLeft,
  MessageCircle,
  WalletCards,
} from "lucide-react";
import PhoneShell from "../components/PhoneShell";

export default function Placeholder({ type, onNavigate }) {
  const chat = type === "chat";

  return (
    <PhoneShell>
      <main className="min-h-[820px] bg-slate-50 px-6 py-6">
        <button
          onClick={() => onNavigate("dashboard")}
          className="text-slate-500"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="mt-20 flex justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-emerald-50">
            {chat ? (
              <MessageCircle className="text-emerald-600" />
            ) : (
              <WalletCards className="text-emerald-600" />
            )}
          </div>
        </div>

        <h1 className="mt-6 text-center font-poppins text-xl font-bold text-emerald-900">
          {chat ? "Live Chat" : "Penarikan Saldo"}
        </h1>

        <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-5 text-slate-500">
          Tampilan navigasi ini dipertahankan dari desain nasabah.
          Endpoint untuk fitur ini tidak tercantum di ENDPOINT.pdf,
          jadi belum dibuat request API palsu.
        </p>
      </main>
    </PhoneShell>
  );
}