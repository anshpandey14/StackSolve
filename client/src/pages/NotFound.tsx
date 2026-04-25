import { Link } from "react-router-dom";
import { ShimmerButton } from "../components/ui/shimmer-button";
import { Particles } from "../components/ui/particles";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6">
      <Particles
        className="fixed inset-0 -z-10"
        quantity={50}
        color="#ffffff"
      />
      <h1 className="text-9xl font-bold text-orange-500 mb-4">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold mb-6">Page Not Found</h2>
      <p className="text-neutral-500 text-center max-w-md mb-10">
        The page you are looking for doesn't exist or has been moved to a new
        location.
      </p>
      <Link to="/">
        <ShimmerButton>
          <span className="text-sm font-medium text-white lg:text-lg">
            Go back Home
          </span>
        </ShimmerButton>
      </Link>
    </div>
  );
};

export default NotFound;
