'use client'
import { useGetSocialLinksQuery } from "@/redux/service/admin/cmsApi";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaPinterest } from "react-icons/fa";

const Footer = () => {
  const { data: socials } = useGetSocialLinksQuery();

  // Helper: ensure URL has protocol
  const ensureUrl = (url: string | null | undefined): string => {
    if (!url) return "#";
    return url.startsWith("http") ? url.trim() : `https://${url.trim()}`;
  };

  const socialData = socials?.data;

  return (
    <footer className="bg-[#FDF8EB] border-t border-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Contact Us */}
          <div>
            <h3 className="font-semibold text-[#482817] mb-4 text-sm md:text-base">
              CONTACT US
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-semibold text-[#482817]">Address:</span>
                <p className="font-normal text-[#968F8F] ml-2">
                  26 Wyle Cop, Shrewsbury, Shropshire, SY1 1XD
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#482817]">Tel:</span>
                <p className="font-normal text-[#968F8F] ml-2">01743 234500</p>
              </div>
              <div>
                <span className="font-semibold text-[#482817]">Email:</span>
                <p className="font-normal text-[#968F8F] ml-2">support@kowine.com</p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 mt-4">
              {socialData?.facebook && (
                <Link
                  href={ensureUrl(socialData.facebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 text-[#482817] hover:text-blue-600 transition"
                  aria-label="Facebook"
                >
                  <FaFacebook size={20} />
                </Link>
              )}
              {socialData?.instagram && (
                <Link
                  href={ensureUrl(socialData.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 text-[#482817] hover:text-pink-600 transition"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} />
                </Link>
              )}
              {socialData?.linkedin && (
                <Link
                  href={ensureUrl(socialData.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 text-[#482817] hover:text-blue-700 transition"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={20} />
                </Link>
              )}
              {socialData?.pinterest && (
                <Link
                  href={ensureUrl(socialData.pinterest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 text-[#482817] hover:text-red-600 transition"
                  aria-label="Pinterest"
                >
                  <FaPinterest size={20} />
                </Link>
              )}
            </div>
          </div>

          {/* Customer Services */}
          <div>
            <h3 className="font-semibold text-[#482817] mb-4 text-sm md:text-base">
              CUSTOMER SERVICES
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/#" className="hover:text-gray-900 transition font-normal text-[#968F8F]">
                  Contact & FAQ
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-gray-900 transition font-normal text-[#968F8F]">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-gray-900 transition font-normal text-[#968F8F]">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-gray-900 transition font-normal text-[#968F8F]">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-gray-900 transition font-normal text-[#968F8F]">
                  Interest Free Finance
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-semibold text-[#482817] mb-4 text-sm md:text-base">
              ABOUT US
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/#" className="hover:text-gray-900 transition font-normal text-[#968F8F]">
                  Our story
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-gray-900 transition font-normal text-[#968F8F]">
                  Customer Review
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-gray-900 transition font-normal text-[#968F8F]">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-gray-900 transition font-normal text-[#968F8F]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-gray-900 transition font-normal text-[#968F8F]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Discover More */}
          <div>
            <h3 className="font-semibold text-[#482817] mb-4 text-sm md:text-base">
              DISCOVER MORE
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href={ensureUrl(socialData?.facebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition font-normal text-[#968F8F]"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href={ensureUrl(socialData?.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition font-normal text-[#968F8F]"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href={ensureUrl(socialData?.pinterest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition font-normal text-[#968F8F]"
                >
                  Pinterest
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900 transition font-normal text-[#968F8F]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t-2 border-[#968F8F] bg-[#FDF8EB] py-4">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-normal text-[#968F8F] text-sm">
            Copyright © 2025 Ops Wine.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;