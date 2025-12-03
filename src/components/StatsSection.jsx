import { useEffect, useRef, useState } from "react";
import { FaGlobeAmericas, FaSmile, FaRocket, FaCalendarAlt } from "react-icons/fa";

const stats = [
  {
    icon: <FaCalendarAlt className="text-accent text-4xl mb-2" />,
    value: 5,
    label: "Years",
  },
  {
    icon: <FaRocket className="text-accent text-4xl mb-2" />,
    value: 100,
    label: "Projects",
  },
  {
    icon: <FaSmile className="text-accent text-4xl mb-2" />,
    value: 10,
    label: "Happy clients",
  },
  {
    icon: <FaGlobeAmericas className="text-accent text-4xl mb-2" />,
    value: 3,
    label: "Continents",
  },
];

// Animated counter hook
function useCountUp(to, duration = 1200) {
  const [count, setCount] = useState(0);
  const frame = useRef();

  useEffect(() => {
    let start = 0;
    const step = (timestamp) => {
      if (!frame.current) frame.current = timestamp;
      const progress = Math.min((timestamp - frame.current) / duration, 1);
      setCount(Math.floor(progress * to));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(to);
      }
    };
    requestAnimationFrame(step);
    return () => (frame.current = null);
  }, [to, duration]);

  return count;
}

const StatsSection = () => (
  <section className=" py-20 px-4">
    <div className="max-w-5xl mx-auto text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent">
        We completed +120 Project Yearly
      </h2>
      <p className="text-muted text-lg max-w-2xl mx-auto">
        We are the fastest growing digital agency with a strong business idea and ethics.<br />
        Check our info with some awesome numbers.
      </p>
    </div>
    <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {stats.map((stat, idx) => {
        const count = useCountUp(stat.value, 1200 + idx * 300);
        return (
          <div key={idx} className="bg-surface rounded-2xl p-8 shadow-lg hover:shadow-neon transition group">
            {stat.icon}
            <div className="text-4xl font-extrabold text-text mb-1 group-hover:text-accent transition">
              {count}
            </div>
            <div className="text-muted text-lg font-medium">{stat.label}</div>
          </div>
        );
      })}
    </div>
  </section>
);

export default StatsSection;