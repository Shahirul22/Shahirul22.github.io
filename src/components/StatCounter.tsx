import { useEffect, useRef, useState } from 'react';

type Props = {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
};

export default function StatCounter({ end, duration = 1400, suffix = '', prefix = '', decimals = 0 }: Props) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(eased * end);
            if (p < 1) requestAnimationFrame(tick);
            else setVal(end);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}{val.toFixed(decimals)}{suffix}
    </span>
  );
}
