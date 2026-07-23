import React from 'react';
import { Microscope, BarChart3, Store, ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'AI Crop Doctor',
    description:
      'Upload a photo of your crop to receive instant diagnosis of diseases and detailed treatment recommendations powered by neural networks.',
    icon: <Microscope className="w-6 h-6 text-[#16503b]" />,
    link: 'Get Diagnosis',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    title: 'AI Farm Analyzer',
    description:
      'Analyze historical yield trends and weather patterns to predict future harvest outputs with up to 92% accuracy across multiple crop types.',
    icon: <BarChart3 className="w-6 h-6 text-[#8b5e34]" />,
    link: 'View Trends',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    title: 'Smart Marketplace',
    description:
      'Directly buy and sell agricultural products, seeds, and specialized machinery with transparent pricing and verified buyer ratings.',
    icon: <Store className="w-6 h-6 text-[#8b5e34]" />,
    link: 'Start Trading',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
];

const Features = () => {
  return (
    <section className="py-20 w-full bg-[#f8faf9] dark:bg-gray-950 px-4 transition-colors">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Intelligent Ecosystem for Agriculture
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Seamlessly integrated tools designed to maximize your harvest and
            streamline your operations through advanced artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all border border-transparent dark:border-gray-800"
            >
              <div
                className={`${feature.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-8`}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {feature.description}
              </p>
              <button className="flex items-center gap-2 text-[#16503b] dark:text-green-500 font-bold hover:underline cursor-pointer">
                {feature.link} <ArrowRight size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
