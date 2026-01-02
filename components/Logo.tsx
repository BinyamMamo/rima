import React from "react";

interface LogoProps {
  className?: string;
  size?: number;      // width in px
  color?: string;     // main purple
  accent?: string;    // triangle purple
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  size,
  color = "#6C30FF",
  accent = "#A875FF",
}) => {
  const style = size ? ({ width: size } as React.CSSProperties) : undefined;

  return (
    <div className={`flex items-center justify-center ${className}`} style={style}>
      <svg
        viewBox="0 0 235 226"
        width="100%"
        height="auto"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="RIMA Logo"
        style={{ display: "block" }}
      >
        {/* Main geometric "R" silhouette (exact outline) */}
        <path
          fill={color}
          d="
            M 155 176.5
            L 111 176.5
            L 47.5 113
            L 64 50.5
            L 189.5 51
            L 166.5 138
            L 119.5 139
            L 154.5 173
            Z
          "
        />

        {/* Detached triangle (exact outline) */}
        <path
          fill={accent}
          d="
            M 67 176.5
            L 30.5 176
            L 38 146.5
            Z
          "
        />
      </svg>
    </div>
  );
};

export default Logo;
