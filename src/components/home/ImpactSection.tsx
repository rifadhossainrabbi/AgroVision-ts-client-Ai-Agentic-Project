'use client';

import Link from 'next/link';
import { ArrowRight, Bot, ShieldCheck, TrendingUp } from 'lucide-react';

const highlights = [
  {
    title: 'AI-guided decisions',
    description:
      'Turn crop diagnosis, pricing, and demand signals into confident next actions.',
    icon: Bot,
  },
  {
    title: 'Trusted transactions',
    description:
      'Every listing is reviewed for quality so buyers and sellers can trade with confidence.',
    icon: ShieldCheck,
  },
  {
    title: 'Live market signals',
    description:
      'See which crops are trending so you can price, list, or plan your farm activities smarter.',
    icon: TrendingUp,
  },
];

const ImpactSection = () => {
  return (
    <section className="bg-[#f5fbf7] dark:bg-[#020617] px-4 py-20">
      <div className="container mx-auto rounded-[2.5rem] border border-gray-200/70 dark:border-gray-800 bg-white/90 dark:bg-gray-900/80 p-8 md:p-12 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16503b] dark:text-green-400">
              Built for modern agriculture
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              From discovery to delivery, AgroVision keeps every farm decision
              moving.
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Use AI to generate product descriptions, understand crop health,
              and discover what the market is rewarding right now.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-full bg-[#16503b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0f3a2a]"
          >
            Explore the marketplace <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {highlights.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-950/50 p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16503b]/10 text-[#16503b] dark:text-green-400">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-lg font-black text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
