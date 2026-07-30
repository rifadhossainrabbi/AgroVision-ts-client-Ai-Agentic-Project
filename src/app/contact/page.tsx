import Link from 'next/link';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-16 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16503b] dark:text-green-400">
            Contact us
          </p>
          <h1 className="mt-3 text-3xl font-black text-gray-900 dark:text-white">
            Need help launching your next AI-assisted farm workflow?
          </h1>
          <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Reach the AgroVision team for marketplace onboarding, AI support, or
            partnership questions.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-gray-950">
              <Mail className="text-[#16503b] dark:text-green-400" size={18} />
              <span>support@agrovision.ai</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-gray-950">
              <Phone className="text-[#16503b] dark:text-green-400" size={18} />
              <span>+1 (555) 010-2048</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-gray-950">
              <MapPin
                className="text-[#16503b] dark:text-green-400"
                size={18}
              />
              <span>123 Agri-Tech Lane, Silicon Valley</span>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-gray-200 bg-[#16503b] p-8 text-white shadow-sm dark:border-gray-800 md:p-12">
          <h2 className="text-2xl font-black">Ready to start?</h2>
          <p className="mt-4 text-sm leading-8 text-green-100">
            Join the marketplace, add your own products, and let AI help you
            showcase them with polished descriptions.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#16503b] transition hover:bg-green-50"
          >
            Create your account <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
