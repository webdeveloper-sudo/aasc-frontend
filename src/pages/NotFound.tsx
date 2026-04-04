import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowUpRightFromSquare, MoveRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex h-[70vh] items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold">404</h1>
        <p className="mb-4 text-xl ">Oops! Page not found</p>
        <a href="/" className="text-white red-btn hover:text-white/70 flex items-center gap-2 justify-center">
          Return to Home <span><MoveRight className="w-4 h-4 underline"/></span>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
