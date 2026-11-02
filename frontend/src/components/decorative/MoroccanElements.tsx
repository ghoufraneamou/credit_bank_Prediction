
import { useEffect, useRef } from "react";
;
export const MoroccanPattern = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-10 animate-float">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-saffron">
          <polygon points="50,0 100,50 50,100 0,50" />
        </svg>
      </div>
      <div className="absolute top-40 right-20 w-24 h-24 opacity-10 animate-float-reverse">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
          <polygon points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" />
        </svg>
      </div>
      <div className="absolute bottom-32 left-1/4 w-20 h-20 opacity-10 animate-float-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-terracotta">
          <polygon points="50,0 61.8,38.2 100,38.2 69.1,61.8 80.9,100 50,76.4 19.1,100 30.9,61.8 0,38.2 38.2,38.2" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-1/3 w-16 h-16 opacity-10 animate-float">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-emerald">
          <circle cx="50" cy="50" r="45" />
        </svg>
      </div>
      
      {/* Large decorative circle */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border-2 border-saffron/10 animate-spin-slower" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-primary/10 animate-counter-spin" />
    </div>
  );
};

export const FloatingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-saffron/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-reverse" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-terracotta/10 rounded-full blur-3xl animate-float-slow" />
    </div>
  );
};

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter = ({ end, duration = 2000, suffix = "", prefix = "" }: AnimatedCounterProps) => {
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = countRef.current;
    if (!element) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * end);
      
      element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, suffix, prefix]);

  return <span ref={countRef}>{prefix}0{suffix}</span>;
};

export const RiskGauge = ({ score, size = 200 }: { score: number; size?: number }) => {
  const angle = (score / 100) * 180 - 90;
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  
  const getColor = (score: number) => {
    if (score <= 30) return "hsl(var(--emerald))";
    if (score <= 60) return "hsl(var(--saffron))";
    if (score <= 80) return "hsl(var(--terracotta))";
    return "hsl(var(--destructive))";
  };

  const getRiskLabel = (score: number) => {
    if (score <= 30) return "Low Risk";
    if (score <= 60) return "Medium Risk";
    if (score <= 80) return "High Risk";
    return "Very High Risk";
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} className="overflow-visible">
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Colored arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
          className="transition-all duration-1000 ease-out"
        />
        {/* Needle */}
        <line
          x1={size / 2}
          y1={size / 2}
          x2={size / 2 + Math.cos((angle * Math.PI) / 180) * (radius - 20)}
          y2={size / 2 + Math.sin((angle * Math.PI) / 180) * (radius - 20)}
          stroke="hsl(var(--foreground))"
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out origin-center"
        />
        {/* Center dot */}
        <circle cx={size / 2} cy={size / 2} r="8" fill="hsl(var(--foreground))" />
      </svg>
      <div className="text-center mt-2">
        <div className="text-4xl font-display font-bold" style={{ color: getColor(score) }}>
          {score}%
        </div>
        <div className="text-sm text-muted-foreground font-medium">{getRiskLabel(score)}</div>
      </div>
    </div>
  );
};

export const ScrollReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
};
