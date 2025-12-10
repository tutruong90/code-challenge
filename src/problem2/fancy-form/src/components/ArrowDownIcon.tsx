import type { FC, SVGProps } from "react";

const ArrowDownIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <g transform="translate(0, 1)">
      {/* Tail moved up */}
      <line x1="12" y1="4" x2="12" y2="14" />

      {/* Arrow head moved up */}
      <polyline points="6 11 12 17 18 11" />
    </g>
  </svg>
);

export default ArrowDownIcon;
