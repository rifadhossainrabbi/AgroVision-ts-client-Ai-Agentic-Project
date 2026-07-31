import React from 'react';
import { UserPlus, ScanSearch, Handshake } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    description:
      'Sign up in seconds as a farmer, buyer, or supplier and set up your profile to start using AgroVision.',
    icon: UserPlus,
  },
  {
    step: '02',
    title: 'Diagnose & Discover',
    description:
      'Use AI Crop Doctor and Farm Analyzer to catch issues early, or browse verified listings across the marketplace.',
    icon: ScanSearch,
  },
  {
    step: '03',
    title: 'Trade with Confidence',
    description:
      'List products, connect with buyers or sellers, and close deals knowing every listing is reviewed and transparent.',
    icon: Handshake,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 w-full bg-white dark:bg-gray-900 px-4 transition-colors">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16503b] dark:text-green-400 mb-3">
            Simple by design
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How AgroVision Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From sign-up to sale, get up and running in three straightforward
            steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-[#f8faf9] dark:bg-gray-950 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800"
              >
                <span className="absolute top-6 right-8 text-5xl font-black text-gray-100 dark:text-gray-800 select-none">
                  {item.step}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-[#c2f2da] dark:bg-green-900/30 flex items-center justify-center mb-8">
                  <Icon className="w-6 h-6 text-[#16503b] dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
