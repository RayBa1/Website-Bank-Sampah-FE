import {
  MessageCircle,
  UserRound,
  WalletCards,
  Recycle,
} from "lucide-react";

export default function BottomNav({
  active,
  onNavigate,
}) {
  const items = [
    {
      id: "dashboard",
      label: "Transaksi",
      icon: Recycle,
    },
    {
      id: "withdraw",
      label: "Penarikan",
      icon: WalletCards,
    },
    {
      id: "chat",
      label: "Live Chat",
      icon: MessageCircle,
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserRound,
    },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-20 flex h-16 items-center justify-around border-t border-slate-200 bg-white">
      {items.map(
        ({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() =>
              onNavigate(id)
            }
            className={`
              flex
              h-full
              w-1/4
              flex-col
              items-center
              justify-center
              gap-1
              text-xs
              font-semibold
              ${
                active === id
                  ? "text-emerald-600"
                  : "text-slate-500"
              }
            `}
          >
            <Icon size={17} />

            <span>{label}</span>
          </button>
        )
      )}
    </nav>
  );
}