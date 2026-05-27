type SectionDividerProps = {
  fill: string;
  flip?: boolean;
};

export default function SectionDivider({
  fill,
  flip = false,
}: SectionDividerProps) {
  return (
    <div
      className="section-divider"
      style={{
        lineHeight: 0,
        transform: flip ? "scaleY(-1)" : undefined,
        marginTop: flip ? 0 : "-1px",
        marginBottom: flip ? "-1px" : 0,
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "80px" }}
      >
        <path
          d="M0,40 C360,90 720,0 1080,50 C1260,70 1380,60 1440,35 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
