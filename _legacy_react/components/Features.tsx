import React from 'react';
import { Users, TrendingUp, Smile } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <div className="flex w-full justify-center">
      <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-10">
        <div className="flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-col gap-10 py-10">
            <div className="flex flex-col gap-4 text-center md:text-left">
              <h1 className="text-text-main tracking-tight text-[32px] font-bold leading-tight md:text-4xl md:font-black">
                Why Join Us?
              </h1>
              <p className="text-gray-600 text-base font-normal leading-normal max-w-[720px]">
                Experience a week of growth, fun, and new friendships. Our program is designed to build character and create lasting memories.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="flex flex-col gap-4 rounded-xl border border-[#cfe7d7] bg-surface-light p-6 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-full bg-[#e7f3eb] flex items-center justify-center text-primary">
                  <Users size={32} />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-text-main text-lg font-bold leading-tight">Friendship</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Make lifelong friends in a supportive environment where everyone belongs.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col gap-4 rounded-xl border border-[#cfe7d7] bg-surface-light p-6 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-full bg-[#e7f3eb] flex items-center justify-center text-primary">
                  <TrendingUp size={32} />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-text-main text-lg font-bold leading-tight">Growth</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Challenge yourself with new activities, skill workshops, and leadership roles.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col gap-4 rounded-xl border border-[#cfe7d7] bg-surface-light p-6 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-full bg-[#e7f3eb] flex items-center justify-center text-primary">
                  <Smile size={32} />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-text-main text-lg font-bold leading-tight">Fun</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Unforgettable memories, night games, campfires, and non-stop entertainment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;