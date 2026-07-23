'use client';

import React from 'react';
import Link from 'next/link';
// React Icons থেকে আইকন ইমপোর্ট করা হয়েছে
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';
import {
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineArrowSmRight,
} from 'react-icons/hi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Explore Marketplace', href: '/marketplace' },
      { name: 'AI Crop Doctor', href: '/ai-doctor' },
      { name: 'Farm Analyzer', href: '/analyzer' },
      { name: 'Pricing Plans', href: '/pricing' },
    ],
    resources: [
      { name: 'Agro Blog', href: '/blog' },
      { name: 'Farming Guide', href: '/guide' },
      { name: 'Community Forum', href: '/forum' },
      { name: 'Help Center', href: '/help' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  };

  const socialIcons = [
    { Icon: FaFacebookF, href: '#' },
    { Icon: FaXTwitter, href: '#' },
    { Icon: FaInstagram, href: '#' },
    { Icon: FaLinkedinIn, href: '#' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 pt-20 pb-10 px-4 transition-all duration-300">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center md:text-left">
          {/* Brand Column */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <Link
              href="/"
              className="text-2xl font-bold text-[#16503b] dark:text-green-500 hover:opacity-80 transition-opacity"
            >
              AgroVision AI
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering farmers globally with agentic AI solutions. Join the
              future of sustainable and precision agriculture.
            </p>
            <div className="flex gap-4">
              {socialIcons.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-[#16503b] hover:border-[#16503b] dark:hover:text-green-500 dark:hover:border-green-500 transition-all hover:-translate-y-1 bg-gray-50 dark:bg-gray-900/50 cursor-pointer"
                >
                  <item.Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-[0.2em]">
              Platform
            </h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-gray-500 dark:text-gray-400 text-sm hover:text-[#16503b] dark:hover:text-green-500 transition-all inline-flex items-center gap-1 group cursor-pointer"
                  >
                    {link.name}{' '}
                    <HiOutlineArrowSmRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-1 transition-all text-[#16503b] dark:text-green-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-[0.2em]">
              Resources
            </h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-gray-500 dark:text-gray-400 text-sm hover:text-[#16503b] dark:hover:text-green-500 transition-all inline-flex items-center gap-1 group cursor-pointer"
                  >
                    {link.name}{' '}
                    <HiOutlineArrowSmRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-1 transition-all text-[#16503b] dark:text-green-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-[0.2em]">
              Contact
            </h4>
            <div className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-3">
                <HiOutlineLocationMarker
                  size={20}
                  className="text-[#16503b] dark:text-green-500 shrink-0"
                />
                <span>123 Agri-Tech Lane, Silicon Valley</span>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineMail
                  size={20}
                  className="text-[#16503b] dark:text-green-500 shrink-0"
                />
                <span>support@agrovision.ai</span>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlinePhone
                  size={20}
                  className="text-[#16503b] dark:text-green-500 shrink-0"
                />
                <span>+1 (555) AGRO-AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 dark:border-gray-900 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium tracking-wide">
            © {currentYear} AgroVision AI. Built with precision for Agentic AI
            Project.
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {footerLinks.legal.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-xs text-gray-400 hover:text-[#16503b] dark:hover:text-green-500 transition-all font-medium cursor-pointer"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
