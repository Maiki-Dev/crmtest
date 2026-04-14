import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  BarChart3, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  ArrowRight,
  Check
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-200">B</div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">BizFlow <span className="text-blue-600">CRM</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Боломжууд</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Үнэ</a>
            <div className="h-4 w-px bg-gray-200"></div>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Нэвтрэх</Link>
            <Link href="/register">
              <Button size="sm" className="shadow-lg shadow-blue-100 px-6">Бүртгүүлэх</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pt-20 pb-28 lg:pt-32 lg:pb-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
              <Zap className="h-4 w-4 fill-blue-700" />
              <span>Монголын анхны сошиал худалдаа эрхлэгчдэд зориулсан CRM</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]">
              Бизнесээ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ухаалгаар</span> <br />удирдаарай
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed">
              Инстаграм, Фэйсбүүк худалдаа эрхлэгчдэд зориулсан хамгийн энгийн бөгөөд хүчирхэг систем. Хэрэглэгч, нэхэмжлэл, чаат бүгд нэг дор.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10 h-14 rounded-2xl shadow-xl shadow-blue-200">
                  Үнэгүй эхлэх
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 h-14 rounded-2xl border-2 hover:bg-gray-50 transition-all">
                  Демо үзэх
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Таны бизнест хэрэгтэй бүхэн</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Бид таны өдөр тутмын ажлыг хөнгөвчлөх зорилготой</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <FeatureCard 
                icon={BarChart3} 
                title="Хяналтын самбар" 
                desc="Бизнесийнхээ өсөлт, орлогыг нэг дороос хянаж, шийдвэр гаргалтаа сайжруулаарай." 
              />
              <FeatureCard 
                icon={MessageSquare} 
                title="Чаат & Түүх" 
                desc="Хэрэглэгч бүртэй харилцсан түүхээ хадгалж, үйлчилгээний чанараа нэмэгдүүлээрэй." 
              />
              <FeatureCard 
                icon={ShieldCheck} 
                title="Нэхэмжлэл" 
                desc="Хэдхэн секундэд нэхэмжлэл үүсгэж, төлөлтийг хянах боломжтой." 
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-12">Энгийн үнийн нөхцөл</h2>
            <div className="max-w-md mx-auto p-8 rounded-3xl border-2 border-blue-600 bg-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-4 py-1 rounded-bl-xl font-bold">PRO</div>
              <h3 className="text-2xl font-bold mb-2">Бүгдийг багтаасан</h3>
              <div className="text-4xl font-extrabold mb-6">49,000  <span className="text-sm font-normal text-gray-500">/ сар</span></div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center text-gray-700 font-medium">
                  <Check className="h-5 w-5 text-green-500 mr-3" /> Хязгааргүй хэрэглэгч
                </li>
                <li className="flex items-center text-gray-700 font-medium">
                  <Check className="h-5 w-5 text-green-500 mr-3" /> Хязгааргүй нэхэмжлэл
                </li>
                <li className="flex items-center text-gray-700 font-medium">
                  <Check className="h-5 w-5 text-green-500 mr-3" /> Нарийвчилсан график
                </li>
              </ul>
              <Link href="/register">
                <Button className="w-full py-6 text-lg rounded-xl shadow-lg shadow-blue-100">Одоо эхлэх</Button>
              </Link>
              <p className="mt-4 text-sm text-gray-500">14 хоног үнэгүй туршиж үзээрэй</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:col-span-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">B</div>
              <span className="text-2xl font-bold tracking-tight">BizFlow CRM</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Монгол дахь сошиал худалдаа эрхлэгчдийн хамгийн найдвартай түнш. Бизнесээ шинэ түвшинд гаргахад тань бид тусална.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Холбоос</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Бидний тухай</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Боломжууд</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Үнэ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Холбоо барих</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center"><ChevronRight className="h-4 w-4 mr-2" /> help@bizflow.mn</li>
              <li className="flex items-center"><ChevronRight className="h-4 w-4 mr-2" /> +976 8888-8888</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
           2026 BizFlow CRM. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-200/30 transition-all group">
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}
