import { SVGProps } from "react";

export const RocketSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M19.22 4C19.22 4 15.9 2 12 2C8.1 2 4.78 4 4.78 4C4.78 4 8.1 6 12 6C15.9 6 19.22 4 19.22 4M4.78 20C4.78 20 8.1 22 12 22C15.9 22 19.22 20 19.22 20C19.22 20 15.9 18 12 18C8.1 18 4.78 20 4.78 20M21.1 9.13L17.8 10.5L18.84 7.94L14.29 7L16.64 3.91C16.64 3.91 17.74 4.56 18.67 5.87C19.59 7.18 19.96 8.31 19.96 8.31L21.1 9.13M8.71 11.71C7.93 10.93 7.93 9.7 8.71 8.92C9.5 8.14 10.72 8.14 11.5 8.92C12.29 9.7 12.29 10.93 11.5 11.71C10.72 12.5 9.5 12.5 8.71 11.71M15.29 15.29C14.5 14.5 14.5 13.28 15.29 12.5C16.07 11.71 17.3 11.71 18.08 12.5C18.87 13.28 18.87 14.5 18.08 15.29C17.3 16.07 16.07 16.07 15.29 15.29Z" />
  </svg>
);

export const SmokeParticles = () => (
  <div className="smoke-container absolute bottom-0 left-0 w-full h-full pointer-events-none">
    {Array.from({ length: 15 }).map((_, i) => (
      <div
        key={i}
        className="smoke-particle"
        style={
          {
            "--delay": `${Math.random() * 3}s`,
            "--left": `${Math.random() * 100}%`,
          } as React.CSSProperties
        }
      />
    ))}
  </div>
);
