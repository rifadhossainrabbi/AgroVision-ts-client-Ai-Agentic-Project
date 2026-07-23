import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Marco Rossini',
    location: 'Tuscany, Italy',
    quote:
      'The AI Crop Doctor saved my entire tomato harvest this season. I caught a fungal infection two weeks earlier than I would have without it.',
    image: 'https://i.pravatar.cc/150?u=marco',
  },
  {
    name: 'Sarah Jenkins',
    location: 'California, USA',
    quote:
      'Predictive analytics allowed me to optimize my irrigation schedule. We reduced water usage by 30% while increasing yield by 15%.',
    image: 'https://i.pravatar.cc/150?u=sarah',
  },
  {
    name: 'Amir Khan',
    location: 'Punjab, India',
    quote:
      'The marketplace connect is incredible. I found organic fertilizers at a price that actually makes my business sustainable for the long run.',
    image: 'https://i.pravatar.cc/150?u=amir',
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 w-full bg-[#f8faf9] dark:bg-gray-950 px-4 border-t border-gray-100 dark:border-gray-900 transition-colors">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Voices from the Field
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Empowering farmers around the globe with actionable intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] shadow-sm border border-transparent dark:border-gray-800"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill="#8b5e34"
                    className="text-[#8b5e34]"
                  />
                ))}
              </div>
              <p className="text-gray-800 dark:text-gray-300 italic mb-8 leading-relaxed">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
