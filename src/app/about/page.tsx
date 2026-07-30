import Link from 'next/link';
import { ArrowRight, Bot, Leaf, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-16 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-12">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16503b] dark:text-green-400">
          About AgroVision AI
        </p>
        <h1 className="mt-3 text-3xl font-black text-gray-900 dark:text-white md:text-4xl">
          A marketplace and AI workspace built for modern farmers.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8">
          AgroVision AI connects growers, buyers, and agribusiness teams through
          intelligent product discovery, crop diagnostics, and actionable market
          insight.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Agentic AI support',
              description:
                'Use AI to generate polished product descriptions and understand farm conditions faster.',
              icon: Bot,
            },
            {
              title: 'Trust-first marketplace',
              description:
                'Every listing is curated and reviewed to make buying and selling easier.',
              icon: ShieldCheck,
            },
            {
              title: 'Sustainable growth',
              description:
                'The platform helps applicants and farmers choose the right tools and timing.',
              icon: Leaf,
            },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16503b]/10 text-[#16503b] dark:text-green-400">
                  <Icon size={20} />
                </div>
                <h2 className="mt-4 text-lg font-black text-gray-900 dark:text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-full bg-[#16503b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0f3a2a]"
          >
            Browse marketplace <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-black text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Contact the team
          </Link>
        </div>
      </div>
    </div>
  );
}
