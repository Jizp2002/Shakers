document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex');
                // Change icon to X
                mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                // Change icon to Menu
                mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            }
        });

        // Close menu when clicking a link
        const links = mobileMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            });
        });
    }

    // --- Countdown Timer & Quota Validation ---
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const registerButtons = document.querySelectorAll('a[href="registro.html"]');

    async function initCampData() {
        try {
            // Fetch settings from Supabase
            const { data: config, error } = await supabase
                .from('configuracion_campamento')
                .select('fecha_inicio, cupos_disponibles, estado_inscripciones')
                .limit(1)
                .single();

            if (error) {
                console.error('Error fetching config:', error);
                return;
            }

            if (config) {
                // 1. Quota Validation
                const isSoldOut = config.cupos_disponibles <= 0;
                const isClosed = config.estado_inscripciones !== 'abiertas';

                if (isSoldOut || isClosed) {
                    registerButtons.forEach(btn => {
                        btn.classList.add('opacity-50', 'pointer-events-none', 'grayscale');
                        const span = btn.querySelector('span');
                        if (span) {
                            if (config.estado_inscripciones === 'finalizadas') span.textContent = 'Event Ended';
                            else if (config.estado_inscripciones === 'cerradas') span.textContent = 'Registration Closed';
                            else if (isSoldOut) span.textContent = 'Sold Out';
                        }
                    });
                }

                // 2. Countdown Logic
                // We add T00:00:00 if config.fecha_inicio is just YYYY-MM-DD
                const dateStr = config.fecha_inicio.includes('T') ? config.fecha_inicio : `${config.fecha_inicio}T00:00:00`;
                const targetDate = new Date(dateStr).getTime();

                const updateTimer = () => {
                    const now = new Date().getTime();
                    const distance = targetDate - now;

                    if (distance < 0) {
                        if (daysEl) daysEl.innerText = '00';
                        if (hoursEl) hoursEl.innerText = '00';
                        if (minutesEl) minutesEl.innerText = '00';
                        if (secondsEl) secondsEl.innerText = '00';
                        return;
                    }

                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
                    if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
                    if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
                    if (secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
                };

                setInterval(updateTimer, 1000);
                updateTimer();
            }

        } catch (err) {
            console.error('Unexpected error:', err);
        }
    }

    // Init
    initCampData();

    // --- Location Assistant Stub ---
    const locationForm = document.getElementById('location-form');
    const locationResults = document.getElementById('location-results');

    if (locationForm) {
        locationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('location-query');
            if (!input.value.trim()) return;

            // Mock interaction
            if (locationResults) {
                locationResults.classList.remove('hidden');
                locationResults.innerHTML = `
          <div class="flex flex-col items-center gap-4 text-gray-500 py-10">
             <p>Searching locations near Camp Lakota...</p>
             <small>(AI functionality requires backend integration in Phase 7)</small>
          </div>
        `;

                // Simulate delay
                setTimeout(() => {
                    locationResults.innerHTML = `
             <div class="prose prose-green max-w-none text-gray-700">
                <p><strong>Response for:</strong> "${input.value}"</p>
                <p>This feature will be powered by Google Gemini in the final version. It will help you find hiking trails, restaurants, and other points of interest near Camp Lakota.</p>
             </div>
           `;
                }, 1500);
            }
        });
    }
});
