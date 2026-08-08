import Link from "next/link";
import {
  ShieldIcon,
  MapPinIcon,
  MailIcon,
  SocialFacebook,
  SocialTwitter,
  SocialInstagram,
  SocialLinkedIn,
} from "@/components/icons";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import logo from "@/assets/logofooter.svg";
import Image from "next/image";

export function Footer() {
  return (
    <footer style={{ background: "#1D1E25" }} className=" pt-16">
      <div className="flex flex-col items-center justify-center">
        <div className="container">
          {/* Top section */}
          <div className="px-[20px] pb-10 flex flex-col lg:flex-row justify-between items-start gap-10">
            {/* Tagline */}
            <p
              className="flex-1 max-w-[660px] font-bold text-white leading-[1.6] tracking-[-0.01em]"
              style={{
                fontFamily: "var(--font-plus-jakarta), sans-serif",
                fontSize: "clamp(28px, 3.5vw, 48px)",
              }}
            >
              চলো আমরা একসাথে কাজ করি, বাংলাদেশে অনলাইন ব্যবসা গড়ে তুলি।
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-6 shrink-0">
              {/* Address */}
              <div className="flex items-center gap-4">
                <div className="w-[44px] h-[44px] bg-white rounded-full flex items-center justify-center shrink-0">
                  <MapPinIcon />
                </div>
                <span className="text-[14px] text-white leading-[1.6] max-w-[240px]">
                  7300, Jhenaidah Sadar, 
                  <br />
                  Jhenaidah, Bangladesh
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-[44px] h-[44px] bg-white rounded-full flex items-center justify-center shrink-0">
                  <MailIcon />
                </div>
                <span className="text-[14px] text-white">onlinetrustpoint@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="mx-[20px] opacity-20"
            style={{ height: 2, background: "#7E8492" }}
          />

          {/* Bottom nav row */}
          <div className="px-[20px] py-7 flex flex-col md:flex-row md:items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex gap-2 shrink-0">
              <Image src={logo} alt="Logo" className="w-45 md:w-60 " />
            </Link>

            {/* Nav links */}
            <nav className="flex flex-col lg:flex-row mt-5 gap-4 md:gap-8 md:mt-0">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms & Conditions", href: "#" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-['Inter'] text-[14px] font-medium text-white hover:opacity-75 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Social icons */}
            <div className="flex gap-5 mt-5  items-center">
              <FaFacebookF className="text-white size-6 hover:text-[#00C085] transition-colors" />
              <FaTwitter className="text-white size-6 hover:text-[#00C085] transition-colors" />
              <FaInstagram className="text-white size-6 hover:text-[#00C085] transition-colors" />
              <FaYoutube className="text-white size-6 hover:text-[#00C085] transition-colors" />
            </div>
          </div>

          {/* Copyright row */}
          <div className="px-[20px] pb-7 flex items-center justify-between">
            <span className="font-['Inter'] text-[14px] text-white opacity-80">
              © Shamim hossain
            </span>
            <div className="flex gap-10">
              <Link
                href="#"
                className="font-['Inter'] text-[14px] text-white opacity-80 hover:opacity-100 transition-opacity"
              >
                Terms & Conditions
              </Link>
              <Link
                href="#"
                className="font-['Inter'] text-[14px] text-white opacity-80 hover:opacity-100 transition-opacity"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
