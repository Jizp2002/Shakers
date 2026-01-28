import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[960px] flex-1">
          <div className="p-0 md:p-4">
            <div 
              className="relative flex min-h-[560px] flex-col gap-6 overflow-hidden rounded-xl items-center justify-center p-8 text-center bg-cover bg-center group"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAyPnAnlsVf5mdqj4HkpYLGR_4p2We2SixtVN5HguIGfp0ks0Z4F2uY3nwWJdtzbDr6CAuqo1FFTENcVZ6ZWn93TU6nL2_w2AOrvSoVHveTG9nHdVkIsDfT1yvlj2SqDaNLtpzkG6jaGtzF1XXslhBaaMYwIxUhGB8XtgIqowne2lanX-iFRDoH4XFwZKDWuhGo3cadIrIFpOiHoBr3APYdJ5FP78UqJEECdH_43UAPkAjXsJiJMq4m6Wdyx1ZXkF0ryoz_DIEj0geV")`
              }}
            >
              <div className="flex flex-col gap-4 max-w-2xl z-10">
                <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] md:text-6xl drop-shadow-sm">
                  Summer Camp 2024:<br />The Adventure of a Lifetime
                </h1>
                <h2 className="text-white/90 text-lg font-medium leading-normal md:text-xl">
                  July 15–20 • Camp Lakota • $250 All-Inclusive
                </h2>
              </div>
              <button className="z-10 mt-4 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary text-text-main text-base font-bold leading-normal tracking-[0.015em] hover:scale-105 transition-transform duration-200 shadow-[0_0_20px_rgba(19,236,91,0.4)]">
                <span className="truncate">Inscríbete Ahora</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;