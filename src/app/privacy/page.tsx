export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-16 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
      <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-12">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16503b] dark:text-green-400">
          Privacy policy
        </p>
        <h1 className="mt-3 text-3xl font-black text-gray-900 dark:text-white">
          We protect account data and marketplace information with care.
        </h1>
        <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-400">
          AgroVision AI uses your account details only to provide login,
          marketplace, and AI-powered features. We do not share personal data
          with third parties for unrelated advertising.
        </p>
      </div>
    </div>
  );
}
