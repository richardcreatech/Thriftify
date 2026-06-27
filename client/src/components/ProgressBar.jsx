function ProgressBar({ value = 35, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      style={{
        width: "100%",
        height: "6px",
        backgroundColor: "#e8e8e827",
        borderRadius: "999px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          backgroundColor: "#6c63f6",
          borderRadius: "999px",
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

export default ProgressBar;