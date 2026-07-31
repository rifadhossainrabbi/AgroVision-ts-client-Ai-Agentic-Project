import React from 'react';

const partners = [
  'GreenFields Co-op',
  'AgroTech Supply',
  'Harvest Bank',
  'FarmLink Logistics',
  'PureSeed Labs',
  'CropGuard Insurance',
];

const TrustedPartners = () => {
  return (
    <section className="py-16 w-full bg-[#f8faf9] dark:bg-gray-950 px-4 border-t border-gray-100 dark:border-gray-900 transition-colors">
      <div className="container mx-auto">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 mb-10">
          Trusted by farms, suppliers &amp; partners worldwide
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {partners.map(name => (
            <div
              key={name}
              className="flex items-center justify-center h-20 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4"
            >
              <span className="text-sm font-bold text-gray-400 dark:text-gray-600 text-center grayscale">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedPartners;
