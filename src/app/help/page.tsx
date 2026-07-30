import Link from 'next/link';
import {
  ArrowRight,
  LifeBuoy,
  MessageCircleQuestion,
  ShieldCheck,
} from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-16 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-12">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16503b] dark:text-green-400">
          Help center
        </p>
        <h1 className="mt-3 text-3xl font-black text-gray-900 dark:text-white">
          Quick answers for getting started with AgroVision AI.
        </h1>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'How do I add a product?',
              description:
                'Create a listing from your farmer dashboard and publish it to the marketplace.',
              icon: LifeBuoy,
            },
            {
              title: 'Can I change my password?',
              description:
                'Yes—update it from your profile page with a current password and a strong new one.',
              icon: ShieldCheck,
            },
            {
              title: 'How do I reach support?',
              description:
                'Use the contact page or email support for onboarding and account help.',
              icon: MessageCircleQuestion,
            },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16503b]/10 text-[#16503b] dark:text-green-400">
                  <Icon size={18} />
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
        <div className="mt-8">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-black text-[#16503b] dark:text-green-400"
          >
            Contact support <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
