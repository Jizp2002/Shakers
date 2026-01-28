import React, { useState, useEffect } from 'react';

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    // Set target date to July 15, 2025 for demo purposes
    const targetDate = new Date('2025-07-15T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-2 min-w-[80px]">
      <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-xl bg-surface-light shadow-sm border border-[#e7f3eb]">
        <p className="text-3xl md:text-4xl font-black text-text-main">
          {value.toString().padStart(2, '0')}
        </p>
      </div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  );

  const Separator = () => (
    <div className="text-2xl font-bold text-gray-300 pt-6 hidden md:block">:</div>
  );

  return (
    <div className="bg-background-light py-8">
      <div className="px-4 md:px-10 lg:px-40 flex justify-center">
        <div className="max-w-[960px] w-full flex flex-col items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Adventure Starts In</h3>
          <div className="flex flex-wrap justify-center gap-4 w-full md:w-auto">
            <TimeUnit value={timeLeft.days} label="Days" />
            <Separator />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <Separator />
            <TimeUnit value={timeLeft.minutes} label="Minutes" />
            <Separator />
            <TimeUnit value={timeLeft.seconds} label="Seconds" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;