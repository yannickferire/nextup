interface LogoProps {
  showDomain?: boolean;
  className?: string;
}

export function Logo({ showDomain = true, className = "" }: LogoProps) {
  return (
    <p className={`logo text-2xl sm:text-4xl tracking-wider ${className}`}>
      next<span className="relative -top-0.75">u</span>p
      {showDomain && <span className="opacity-20">.build</span>}
    </p>
  );
}
