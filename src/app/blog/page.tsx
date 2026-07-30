import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

const posts = [
  {
    title: 'How AI-generated descriptions improve farm product visibility',
    summary:
      'Learn how better copy leads to more trust, stronger engagement, and faster conversions.',
  },
  {
    title: 'Three ways farmers are using agentic AI to plan the next season',
    summary:
      'From crop health to marketplace timing, AI is giving operators better decisions every day.',
  },
  {
    title: 'Why featured listings matter on modern ag marketplaces',
    summary:
      'A curated section can turn browsing into buying when the right products are surfaced.',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-16 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
      <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16503b] dark:text-green-400">
              AgroVision blog
            </p>
            <h1 className="mt-3 text-3xl font-black text-gray-900 dark:text-white">
              Useful insights for farmers, buyers, and ag teams.
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#16503b]/10 px-4 py-2 text-sm font-bold text-[#16503b] dark:text-green-400">
            <Sparkles size={16} /> Fresh AI perspectives
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map(post => (
            <article
              key={post.title}
              className="rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16503b]/10 text-[#16503b] dark:text-green-400">
                <BookOpen size={18} />
              </div>
              <h2 className="mt-4 text-lg font-black text-gray-900 dark:text-white">
                {post.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                {post.summary}
              </p>
              <Link
                href="/about"
                className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#16503b] dark:text-green-400"
              >
                Read more <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
