import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import AASCLogo from "@/assets/images/common/AASC-Logo.webp";
import { socialLinks, contactInfo } from "@/data/contact/contactdata.js";
import { Link } from "react-router-dom";
import Heading from "../reusable/Heading";

const Footer = () => {
  return (
    <footer className="px-10 mt-10 bg-purple text-white relative border-t border-purple">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/pattern-bg.png')",
          backgroundSize: "cover",
        }}
      ></div>

      <div className="relative z-10 container-lg py-10 grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
        {/* About */}
        <div className="">
          <Heading
            title="About Us"
            size="sm"
            align="left"
            className="text-white mb-2 font-semibold"
          />
          <Link to="/">
            <img
              src={AASCLogo}
              width={130}
              className="bg-white mx-auto md:mx-0 p-2 my-3"
              alt="AASC Logo"
            />
          </Link>
          <p className=" text-gray-100 text-justify leading-relaxed">
            Achariya Arts and Science College is a World Class Educational
            Institute and a proud symbol of the Union Territory, Puducherry. A
            first-grade college established in 2004, which is a felicitous
            outcome of the honourable Managing Trustee Dr. J. Arawindhan of
            Achariya Educational Public Trust.
          </p>
        </div>
        {/* Important Links */}
        <div>
          <Heading
            title="Quick Links"
            size="sm"
            align="left"
            className="text-white mb-2 font-semibold"
          />
          <ul className="space-y-1  text-gray-100">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/profile-of-the-college">
                Profile of the College
              </Link>
            </li>
            <li>
              <Link to="/academics/ug-programs">UG Programme</Link>
            </li>
            <li>
              <Link to="/academics/pg-programs">PG Programme</Link>
            </li>
            <li>
              <Link to="/about/chief-mentors-desk">Chief Mentor's Desk</Link>
            </li>
            <li>
              <Link to="/about/principal-desk">Principal Desk</Link>
            </li>
            <li>
              <Link to="/campus-life/gallery">Gallery</Link>
            </li>
            <li>
              <Link to="/about/media-talks">Media Talks</Link>
            </li>
            <li>
              <Link to="/about/press-releases">Press Releases</Link>
            </li>
          </ul>
        </div>
        {/* Contact Details */}
        <div>
          <Heading
            title="Contact Details"
            size="sm"
            align="left"
            className="text-white mb-2 font-semibold"
          />
          <ul className="space-y-3">
            {/* Phone */}
            <li className="flex md:justify-start justify-center items-start gap-3 mb-3">
              <Phone className="w-5 h-5 mt-1" />
              <div className="space-y-1">
                {contactInfo.phone.map((item, i) => (
                  <a
                    key={i}
                    href={`tel:${item.value.replace(/\s/g, "")}`}
                    className="block hover:underline underline-offset-4"
                  >
                    {item.value}
                  </a>
                ))}
              </div>
            </li>
            {/* Email */}
            <a
              href="mailto:info@chariyaarts.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline underline-offset-4"
            >
              <li className="mb-3 flex md:justify-start justify-center items-start gap-3">
                <Mail className="w-5 h-5 mt-1" />
                <div className="space-y-1">
                  {contactInfo.email.map((item, i) => (
                    <div key={i}>{item.value}</div>
                  ))}
                </div>
              </li>
            </a>

            {/* Website */}
            {/* <li className="flex items-start gap-3">
              <Globe className="w-5 h-5 mt-1" />
              <div className="space-y-1">
                {contactInfo.website.map((item, i) => (
                  <a
                    key={i}
                    href={item.value}
                    target="_blank"
                    className="hover:underline"
                  >
                    {item.value}
                  </a>
                ))}
              </div>
            </li> */}

            {/* Address */}
            <li className="mb-3 flex md:justify-start justify-center items-start gap-2">
              <MapPin className="w-10  h-10 mt-1" />
              <div className="space-y-1">
                {contactInfo.address.map((item, i) => (
                  <div key={i}>{item.value}</div>
                ))}
              </div>
            </li>
          </ul>
          {/* Social Icons */}
          <Heading
            title="Follow us"
            size="sm"
            align="left"
            className="text-white py-2 pt-4 font-semibold text-lg"
          />
          <div className="flex justify-center md:justify-start gap-3">
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook.path}
                target="_blank"
                className="bg-blue-600 p-2 rounded-full hover:scale-105 transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}

            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram.path}
                target="_blank"
                className="bg-pink-600 p-2 rounded-full hover:scale-105 transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}

            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube.path}
                target="_blank"
                className="bg-red-600 p-2 rounded-full hover:scale-105 transition"
              >
                <Youtube className="w-5 h-5" />
              </a>
            )}

            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin.path}
                target="_blank"
                className="bg-blue-700 p-2 rounded-full hover:scale-105 transition"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}

            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter.path}
                target="_blank"
                className="bg-sky-500 p-2 rounded-full hover:scale-105 transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3904.0429352919946!2d79.75171117458889!3d11.902098837423953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a536013d5bd3895%3A0xd0824e4201b08665!2sAchariya%20Arts%20and%20Science%20college!5e0!3m2!1sen!2sin!4v1764060961171!5m2!1sen!2sin"
            className="w-full h-full md:h-full rounded-lg border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <hr className="border-gray-400/30 my-4" />

      <div className="relative z-10 border-t border-purple/40 bg-purple/20 py-3 text-center text-sm text-gray-300">
        © 2025 All Rights Reserved | Achariya Arts and Science College
      </div>
    </footer>
  );
};

export default Footer;
