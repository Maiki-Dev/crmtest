# BizFlow CRM - Mongolian SaaS for Small Businesses

BizFlow CRM нь сошиал худалдаа эрхлэгчдэд (Instagram/Facebook) зориулсан хэрэглэгчийн харилцааг удирдах (CRM) систем юм.

## 🚀 Технологийн багц
- **Next.js 14** (App Router)
- **Supabase** (Auth, Database, Realtime)
- **TailwindCSS** (Styling)
- **TypeScript**

---

## ⚙️ Суурилуулалт (Setup Guide)

### 1. Supabase тохиргоо
Supabase дээр шинэ төсөл үүсгээд `supabase/schema.sql` файлыг SQL Editor дээр ажиллуулна уу. Энэ нь шаардлагатай хүснэгтүүд болон RLS (Row Level Security) дүрмүүдийг үүсгэх болно.

### 2. Орчны хувьсагчид (.env)
`.env.local` файл үүсгээд дараах мэдээллийг оруулна уу:
```env
NEXT_PUBLIC_SUPABASE_URL=таны-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=таны-supabase-anon-key
```

### 3. Хамаарлуудыг суулгах
```bash
npm install
```

### 4. Хөгжүүлэлтийн горимд ажиллуулах
```bash
npm run dev
```

---

## 🧩 Системийн боломжууд
- **Хяналтын самбар**: Нийт хэрэглэгч, орлого, нэхэмжлэлийн тойм.
- **Хэрэглэгчийн удирдлага**: Хэрэглэгч нэмэх, засах, хайх.
- **Нэхэмжлэх систем**: Нэхэмжлэл үүсгэх, төлөлтийн төлөв өөрчлөх.
- **Чаат**: Хэрэглэгч бүртэй харилцсан түүхийг хадгалах.
- **SaaS Subscription**: Free болон Pro эрхийн хязгаарлалт.

---

## 🧪 Демо дата (Seed Data)
Та бүртгүүлээд нэвтэрснийхээ дараа хэрэглэгч болон нэхэмжлэл нэмж туршиж үзэх боломжтой. Pro эрх рүү "Тохиргоо" хэсгээс шилжих боломжтой (Mock payment).

---

## 🏗️ Бүтэц
- `/src/app` - Next.js хуудаснууд
- `/src/components` - UI болон Layout компонентууд
- `/src/lib` - Supabase клиент болон туслах функцууд
- `/src/types` - TypeScript төрлүүд
- `/supabase` - SQL схем
