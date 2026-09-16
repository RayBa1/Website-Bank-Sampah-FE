import {
  Wifi,
  Signal,
  BatteryFull,
} from "lucide-react";

export default function PhoneShell({
  children,
  bottom = null,
}) {
  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-200 py-0 sm:py-6">

      <div
        className="
          relative
          min-h-screen
          w-full
          max-w-[412px]
          overflow-hidden
          bg-slate-50
          sm:min-h-[860px]
          sm:max-h-[900px]
          sm:rounded-[40px]
          sm:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
          sm:outline
          sm:outline-8
          sm:outline-offset-[-8px]
          sm:outline-slate-800
        "
      >

        {/* Status Bar */}
        <div className="flex h-10 items-center justify-between bg-white px-7 text-slate-800">

          <span className="text-sm font-bold">
            09:41
          </span>

          <div className="flex items-center gap-2">
            <Signal size={13} />
            <Wifi size={13} />
            <BatteryFull size={15} />
          </div>

        </div>

        {/* Content */}
        <div className="h-[calc(100vh-40px)] overflow-y-auto pb-20 sm:h-[820px]">
          {children}
        </div>

        {/* Bottom Navigation */}
        {bottom}

      </div>
    </div>
  );
}