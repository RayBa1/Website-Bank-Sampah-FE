import { ArrowRight, Recycle } from 'lucide-react'
import PhoneShell from '../components/PhoneShell'

export default function Welcome({ onNavigate }) {
  return (
    <PhoneShell>
      <main className="min-h-[calc(100vh-40px)] sm:min-h-[820px] bg-gradient-to-b from-white to-emerald-50 px-7 flex flex-col items-center">
        <div className="mt-24 size-28 rounded-[30px] bg-emerald-600 shadow-[0_15px_30px_rgba(5,150,105,.30)] flex items-center justify-center">
          <Recycle size={52} className="text-white" strokeWidth={2.2} />
        </div>
        <div className="mt-24 text-center">
          <h1 className="font-poppins text-3xl font-bold leading-9 text-emerald-900">Selamat Datang di Bank Sampah</h1>
          <p className="mt-10 text-base leading-5 text-slate-500">Kelola sampahmu, ubah jadi tabungan berharga, dan ikut serta menjaga kelestarian lingkungan dengan sistem cerdas kami.</p>
        </div>
        <div className="mt-auto mb-8 w-full space-y-3">
          <button onClick={() => onNavigate('register')} className="w-full h-12 rounded-xl bg-emerald-600 text-white font-poppins text-sm font-semibold shadow-[0_4px_12px_rgba(5,150,105,.20)]">Mulai Registrasi</button>
          <button onClick={() => onNavigate('login')} className="w-full h-12 rounded-xl border-2 border-emerald-600 text-emerald-900 font-poppins text-sm font-semibold">Sudah Punya Akun (Login)</button>
        </div>
      </main>
    </PhoneShell>
  )
}
