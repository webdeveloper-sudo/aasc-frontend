import React from "react";
import { useNavigate } from "react-router-dom";

// Import the data list
import { documentsData } from "@/data/_header/topheaderdata.ts";

const TopHeaderBar: React.FC = () => {
  const navigate = useNavigate();

  

  return (
    <div className="bg-[#E8A824] py-2 border-b border-b-[1px] border-gray-200">
      <div className="mx-auto px-3 ps-4 flex items-center justify-center md:justify-between">
        {/* Left Side */}
        <div className="md:block hidden ">
          <div className="flex gap-1 text-gray-800 text-sm">
            <div className="pe-3 border-r border-gray-200">
              <span className="font-semibold">Contact :</span>
              <span>+91 94422 44168 / 94422 55861</span>
            </div>

            <div className="flex ps-3 items-center gap-1 text-gray-800 text-sm">
              <span className="font-semibold">Email :</span>
              <span>info@achariya.ac.in</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Online Payment */}
          {/* <div className="bg-white px-2 h-8 flex items-center justify-center">
            <button className="text-xs font-bold">Online Payment</button>
          </div> */}

          {/* ISO Button */}
          <div className="bg-white border-purple px-2 h-8 flex items-center justify-center">
            <a
              href="https://drive.google.com/file/d/1HCLK31cxAT6GrbTY8Ebpbt07AAqQ5ZH3/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple text-xs font-bold"
            >
              ISO
            </a>
          </div>

          {[
            ...documentsData.filter(
              (doc) => doc.type !== "img" || !doc.rounded
            ),
            ...documentsData.filter((doc) => doc.type === "img" && doc.rounded),
          ].map((doc) => {
            // COMMON WRAPPER with tooltip
            const Wrapper = ({ children }: { children: React.ReactNode }) => (
              <div className="relative group flex flex-col items-center">
                {children}

                {/* Tooltip below badge */}
                <div className="absolute top-full mt-1 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                  {doc.label}
                </div>
              </div>
            );

            if (doc.type === "badge") {
              return (
                <Wrapper key={doc.id}>
                  <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center border-2 border-purple">
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple text-[10px] font-bold leading-tight text-center no-underline"
                    >
                      {doc.label}
                    </a>
                  </div>
                </Wrapper>
              );
            }

            if (doc.type === "img") {
              return (
                <Wrapper key={doc.id}>
                  <div
                    className={`${
                      doc.rounded
                        ? "rounded-full w-10 h-10 overflow-hidden"
                        : "bg-white w-14 h-8"
                    } border border-gray-300 flex items-center justify-center`}
                  >
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={doc.img}
                        alt={doc.imgAlt}
                        className={`${
                          doc.rounded
                            ? "w-10 h-10 rounded-full object-cover"
                            : "max-h-6"
                        }`}
                      />
                    </a>
                  </div>
                </Wrapper>
              );
            }

            return (
              <Wrapper key={doc.id}>
                <div className="bg-white w-14 h-8 flex items-center justify-center border border-gray-300">
                  <a
                    href={doc.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black text-xs font-bold hover:text-heading-purple transition-colors"
                  >
                    {doc.label}
                  </a>
                </div>
              </Wrapper>
            );
          })}

         
        </div>
      </div>
    </div>
  );
};

export default TopHeaderBar;
