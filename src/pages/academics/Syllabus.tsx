import AASClogo from "@/assets/images/common/AASC-Logo.webp";
import Achariyalogo from "@/assets/images/common/achariya-logo-300x300.webp";
import {
  Building,
  Wallet,
  MapPin,
  ScanSearch,
  School,
  Layers,
} from "lucide-react";

const ProfileOfCollege = () => {
  return (
    <>
      <div className="flex flex-col container">
        <main className="flex-grow">
          <section>
            <div className="flex justify-end">
              <img src={Achariyalogo} className=" pt-7" width={90} alt="" />
            </div>
          </section>
          <section className="bg-secondary border-border">
            <div className="text-center">
              <img src={AASClogo} className="mx-auto pb-7" width={300} alt="" />
              <h1
                className="text-3xl md:text-4xl font-bold text-purple mb-4 "
                style={{ textTransform: "capitalize" }}
              >
                Achariya Arts and Science College
              </h1>
              <p className="text-base leading-relaxed">
                Achariya Arts and Science College, Puducherry, is one of the
                premier institutions under the Achariya Group of Educational
                Institutions. Established with a vision to provide holistic
                education and empower students with academic excellence, values,
                and skills, Achariya offers a wide range of undergraduate and
                postgraduate programs in arts, science, and commerce. The
                college fosters innovation, discipline, and leadership among its
                students, preparing them to excel in their chosen fields.
              </p>
            </div>
          </section>

          <section className="py-5 text-center">
            <div className="grid grid-cols-1 md:grid-cols-4">
              {/* Type of College */}
              <div className="p-5 border-b md:border-b-0 md:border-r border-gray-300">
                <h3 className="text-lg font-semibold flex justify-center items-center gap-2">
                  <span className="text-purple">
                    <Building />
                  </span>
                  Type of College
                </h3>
                <p className="mt-1 mb-3">Co-education</p>
                <h3 className="text-lg font-semibold flex justify-center items-center gap-2">
                  <span className="text-purple">
                    <Wallet />
                  </span>
                  Financial Category
                </h3>
                <p className="mt-1 mb-3">Self-Financing</p>
                <h3 className="text-lg font-semibold flex justify-center items-center gap-2">
                  <span className="text-purple">
                    <ScanSearch />
                  </span>
                  Area of Campus
                </h3>
                <p className="mt-1">52274.16 sq. mts.</p>
              </div>

              {/* Location Information */}
              <div className="p-5 border-b md:border-b-0 md:border-r border-gray-300">
                <h3 className="text-lg font-semibold flex justify-center items-center gap-2">
                  <span className="text-purple">
                    <MapPin />
                  </span>
                  Location Information
                </h3>
                <p className="mt-1 font-semibold">Place </p>
                <p>ACHARIYAPURAM, VILLIANUR, PUDUCHERRY</p>

                <p className="mt-2 font-semibold">State </p>
                <p>Puducherry</p>

                <p className="mt-2 font-semibold">Location </p>
                <p>Urban</p>
              </div>
              {/* Academic Affiliation */}
              <div className="p-5 md:border-r border-gray-300">
                <h3 className="text-lg font-semibold flex justify-center items-center gap-2">
                  <span className="text-purple">
                    <School />
                  </span>
                  Academic Affiliation
                </h3>

                <p className="mt-1 font-semibold">Affiliating University </p>
                <p>Pondicherry University</p>

                <p className="mt-2 font-semibold">Status of the College </p>
                <p>Affiliated to Pondicherry University</p>

                <p className="mt-2 font-semibold">Medium of Instruction </p>
                <p>English</p>
              </div>

              {/* Programs & Establishment */}
              <div className="p-5">
                <h3 className="text-lg font-semibold flex justify-center items-center gap-2">
                  <span className="text-purple">
                    <Layers />
                  </span>
                  Programs & Establishment
                </h3>

                <p className="mt-1 font-semibold">No. of Programs </p>
                <p>UG 10 | PG 1</p>

                <p className="mt-2 font-semibold">Year of Establishment </p>
                <p>2004</p>

                <p>+91 94422 44168, +91 94422 55861</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ProfileOfCollege;
