import "./LoadingScreen.css";
import type { FC } from "react";

const LoadingScreen: FC = () => {
  return (
    <div className="loading-screen">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default LoadingScreen;
