import React from 'react';
import { ArrowRight } from 'lucide-react';

const Gallery: React.FC = () => {
  return (
    <div id="gallery" className="flex w-full justify-center bg-white">
      <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-16">
        <div className="flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-col gap-2 px-4 pb-8 text-center">
            <h2 className="text-text-main text-3xl font-bold leading-tight tracking-[-0.015em]">
              Previous Camp Experiences
            </h2>
            <p className="text-gray-600">See what we got up to last summer!</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {/* Large Item */}
            <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-xl cursor-pointer">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp3GveDjyFHkK6WW7IDYIkR8_uVxutAi1CmsN-fBXoRPRz44mgUaKzuZRMritL8D1aB5tND1FJJ34MPUKRHwD8_Ze4CLLf2VTQumrxtfh7yIY1seS0ZhOqRiu4ORUnAnyDmvZCU0c0wzCvMNxOYXjU7EH5FlfqvhS-Ze_6HImC_FOAOaO1xiPRS3ISFZ0GyIsbwWcE8ho0TnGDMyWE6TEN5qKKa8cqtMnN6LVlxbGA1dvd9kgcT-lAcbV1QgJY8XXWd2DHfbFwrtgW" 
                alt="Friends jumping into lake" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white font-bold text-lg">Lake Adventures</span>
              </div>
            </div>

            {/* Small Item */}
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp_QIfmjZB_zqsUpuMNGPUkx5iI5cz96NVQcqVP0sx7GdOLQXYI_bh_thgt1IZZ94AoNBAaJsPCTrxpTr3nQOequRwWv9at1oGso-vn7Gzz_2twdwuUxFbCrYgr8gEG6yOUkYcobcCXw7EaEuZQDxYsCmrgJ8omoYQ8hiaXHuci6P9SI3RN7tima3czLHsPQUM9OSDtdfDOw6v8LSxJFRNYIg0eKewzqBcb64rkDXScp0JPB80lVBPOyUnldFaDdB6U7OYjRF4zi5y" 
                alt="Climbing rock wall" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Small Item */}
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6RsxlNpK7dHLzQlcxE6-FfY-M9iK032tvd6Y_xDeezPWXC_VoKyav1Rx_ur56xL841jjBP40rZ1SRY4E7Bv9PI6F1ZNhYi9Xb08n9t3WtIGhMmrTX26Ry7m9Cq8uX63YcxFzx70UDnAvi9pVql89LI1r9pMzT72h1R14m2c-ghmiSkdKkGf2MBsBq-0-llMDQyCIkPkuzm6AyEw-g_dTfkWTKY2ay_Y3S2eZEVYnc8Cry7AbbaEMDyhimkKYbE4VSCBoUQMWMi1RF" 
                alt="Tug of war" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Medium Item */}
            <div className="col-span-2 relative group overflow-hidden rounded-xl cursor-pointer">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfRyCox9eAIkshefZ-E-dIhf1R_Wv3qWPXKr1oyZy21mB2AuT4g0k2qxH6KTeoW19qlm3npHVYenuxYw20kshxh4Vgbss8zkoEqnATr14OrN6V8zsX-SmLUOy0-u6YkgB7YJgf4amtXvHSmjDPg6gDSJxsmLCCMZZZ7aOF7wcRy7EPU48euEZOB7RUyJUuahKmOOCLTluE72mJYo5-ZRQ_Pc_w_QNB7hN9GhbhripK5Uz2R8mZLY4_c9BI7tAvIjz6tHmmvBEfbUbP" 
                alt="Group selfie" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-bold text-sm">Best Friends Forever</span>
              </div>
            </div>

            {/* Small Item */}
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9aVxJo2ntkMiVuf6Fvps2Aln15LxBpnfJxtCxpiafKUnPNZmvXNcVGLyv7ZD9SpgpXwriklHbXKJfY0MhYAhyOmptpswy55KKRqkR0KKKFBF8dlST0OYxbNVHwvKIAk-YbHc6MAmXLJGsO6QkvIIhLOTxVHVogIh5UXXTWka3V94-8o8Ba0RsrkmN5jH7zzYaVCUJQjgnZ4YqZEIDGIHmUVf-VHSwvDhOWRMt-T_7pJnCLU2U1Ejb0P4eEqVt0SSOxz1zrl8AxmKz" 
                alt="Marshmallows campfire" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Small Item */}
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJm4k0aGVWB4cnG6Tm-w4NWomk1AN2cTjqDvoksW5k8Ft6rGJnYUT9mAzcWfiG0Rzl-MoEBAa8leGkNXVC4YoDOvo73_qANbTluW4nN4t1c4JEtGMJ871jlAdFgwelZRG1l4Rg9xF2H4l-kl0dlBWtX_h0aBK4dcgPJhrAmyFpUA_lggRmfZKm2N3V73B8Rh6MI7lqDfmjCTl5ToBja8zSCV7pF38v__0-MiXuxwPveHbcPu9ZipJPmpyNSHeqo0HUR4Ou6faZM6y7" 
                alt="Kayaks on shore" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              View Full Gallery 
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;