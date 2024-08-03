import Lottie from "lottie-react";
import LoaderLottie from "../../assets/animations/loader.json";
import "./Loader.css";

interface LoaderProps {
  isLoading: boolean;
}

function Loader({ isLoading }: LoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="loader">
      <Lottie
        className="loader-lottie"
        animationData={LoaderLottie}
        loop={true}
        data-testid="lottie-animation"
      />
    </div>
  );
}

export default Loader;
