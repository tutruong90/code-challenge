import "./WaterBox.css";
import { useEffect, useRef, type FC, type HTMLProps } from "react";

const WaterBox: FC<{ boost: number } & HTMLProps<HTMLDivElement>> = ({
  boost,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || boost === 0) return;

    const box = ref.current;
    box.classList.add("color-boost");

    const timer = setTimeout(() => {
      box.classList.remove("color-boost");
    }, 300);

    return () => clearTimeout(timer);
  }, [boost]);

  return (
    <div ref={ref} className="water-box" {...props}>
      <svg className="wave-svg" viewBox="0 0 1440 320">
        <g className="wave-group">
          <path className="wave wave1" />
          <path className="wave wave2" />
        </g>
      </svg>
    </div>
  );
};

export default WaterBox;
