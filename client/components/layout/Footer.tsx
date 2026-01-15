"use client";

import { FacebookIcon, YouTubeIcon, LinkedInIcon, TwitterIcon } from "@/components/ui/SocialIcons";
import { offices, footerCopyright } from "@/constant/landing";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 mt-auto">
      {/* Main Footer - Office Locations */}
      <div className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {offices.map((office) => (
              <div key={office.id}>
                {/* Company Name */}
                <h3 className="text-white font-bold text-base md:text-lg mb-1">
                  {office.companyName}
                </h3>
                {/* Office Type */}
                <p className="text-gray-400 text-sm mb-4">{office.officeType}</p>
                
                {/* Accent Line */}
                <div className="w-10 h-0.5 bg-[#04A0EF] mb-5"></div>
                
                {/* Address */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {office.address}
                </p>
                
                {/* Phone Numbers */}
                {office.phones.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    {office.phones.map((phone, idx) => (
                      <p key={idx} className="text-gray-400 text-sm">
                        {phone.label}: <span className="text-gray-300">{phone.number}</span>
                      </p>
                    ))}
                  </div>
                )}
                
                {/* Email */}
                {office.email && (
                  <p className="text-gray-400 text-sm">
                    Email: <a href={`mailto:${office.email}`} className="text-gray-300 hover:text-[#04A0EF] transition-colors">{office.email}</a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright & Social */}
      <div className="py-5 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              {footerCopyright}
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
              >
                <FacebookIcon size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
              >
                <YouTubeIcon size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
              >
                <LinkedInIcon size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
              >
                <TwitterIcon size={18} />
              </a>
              <a 
                href="#" 
                className="h-10 px-4 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-colors text-sm font-medium"
              >
                Clutch
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
