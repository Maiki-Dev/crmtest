import { createClient } from '@/lib/supabase-server';
import { Users, CreditCard, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Нэвтрээгүй байна</div>;
  }

  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (businessError || !business) {
    console.error('Business fetch error:', businessError);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 max-w-md">
          <h1 className="text-xl font-bold text-yellow-800 mb-2">Бизнес олдсонгүй</h1>
          <p className="text-yellow-700 text-sm mb-6">
            Таны бизнесийн мэдээлэл олдсонгүй. Та бүртгэлээ баталгаажуулна уу эсвэл системд дахин нэвтэрнэ үү.
          </p>
          <a 
            href="/login"
            className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-yellow-700 transition-colors"
          >
            Дахин нэвтрэх
          </a>
        </div>
      </div>
    );
  }

  const { count: customerCount } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id);

  const { data: invoices } = await supabase
    .from('invoices')
    .select('amount, status')
    .eq('business_id', business.id);

  const totalRevenue = invoices
    ?.filter((i: { amount: number; status: string }) => i.status === 'paid')
    .reduce((sum: number, i: { amount: number; status: string }) => sum + Number(i.amount), 0) || 0;

  const pendingInvoices = invoices?.filter((i: { amount: number; status: string }) => i.status === 'pending').length || 0;

  const stats = [
    {
      title: 'Нийт хэрэглэгч',
      value: customerCount || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Нийт орлого',
      value: `${totalRevenue.toLocaleString()} ₮`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Хүлээгдэж буй нэхэмжлэл',
      value: pendingInvoices,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
    {
      title: 'Нийт нэхэмжлэл',
      value: invoices?.length || 0,
      icon: CreditCard,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Хяналтын самбар</h1>
        <p className="text-gray-500">Таны бизнесийн ерөнхий тойм</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <div className={cn('p-2 rounded-lg', stat.bg)}>
                <stat.icon className={cn('h-4 w-4', stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80 flex items-center justify-center text-gray-400">
        График удахгүй...
      </div>
    </div>
  );
}
