import doorStyles from "../../_doors/doors.module.css";

export default function LoadingScreen({
  progress,
  bgReady,
  hidden,
}: {
  progress: number;
  bgReady: boolean;
  hidden: boolean;
}) {
  const shut = !hidden;
  return (
    <div
      className={[doorStyles.doors, shut ? doorStyles.shut : doorStyles.open, shut ? doorStyles.blocking : ""]
        .filter(Boolean)
        .join(" ")}
      role="progressbar"
      aria-label="Loading Waves '26"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-hidden={hidden}
    >
      <div className={`${doorStyles.panel} ${doorStyles.left}`} />
      <div className={`${doorStyles.panel} ${doorStyles.right}`} />
      <div className={doorStyles.crest} />
    </div>
  );
}
