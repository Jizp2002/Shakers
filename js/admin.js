document.addEventListener('DOMContentLoaded', async () => {
    // --- Auth Check ---
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'admin-login.html';
        return;
    }
    document.getElementById('admin-email').textContent = session.user.email;
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'admin-login.html';
    });

    // --- State ---
    let currentPage = 1;
    const pageSize = 20;
    let currentFilter = 'all';
    let searchQuery = '';

    // --- Elements ---
    const tableBody = document.getElementById('table-body');
    const totalCountEl = document.getElementById('count-total');
    const verifiedCountEl = document.getElementById('count-verified');
    const pendingCountEl = document.getElementById('count-pending');
    const slotsCountEl = document.getElementById('count-slots');

    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-status');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const refreshBtn = document.getElementById('refresh-btn');

    // --- Init ---
    loadDashboard();

    // --- Event Listeners ---
    refreshBtn.addEventListener('click', loadDashboard);

    filterSelect.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        currentPage = 1;
        fetchParticipants();
    });

    searchInput.addEventListener('input', debounce((e) => {
        searchQuery = e.target.value;
        currentPage = 1;
        fetchParticipants();
    }, 500));

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchParticipants();
        }
    });

    nextBtn.addEventListener('click', () => {
        currentPage++;
        fetchParticipants();
    });

    // --- Functions ---
    async function loadDashboard() {
        await Promise.all([fetchMetrics(), fetchParticipants()]);
    }

    async function fetchMetrics() {
        try {
            // Count Total
            const { count: total } = await supabase.from('participantes').select('*', { count: 'exact', head: true });
            totalCountEl.textContent = total;

            // Count Verified
            const { count: verified } = await supabase.from('participantes').select('*', { count: 'exact', head: true }).eq('estado_pago', 'verificado');
            verifiedCountEl.textContent = verified;

            // Count Pending
            const { count: pending } = await supabase.from('participantes').select('*', { count: 'exact', head: true }).eq('estado_pago', 'pendiente');
            pendingCountEl.textContent = pending;

            // Slots
            const { data: config } = await supabase.from('configuracion_campamento').select('cupos_disponibles').single();
            if (config) slotsCountEl.textContent = config.cupos_disponibles;

        } catch (err) {
            console.error('Error fetching metrics:', err);
        }
    }

    async function fetchParticipants() {
        tableBody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-400">Loading...</td></tr>';

        try {
            let query = supabase
                .from('participantes')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

            // Filters
            if (currentFilter !== 'all') {
                query = query.eq('estado_pago', currentFilter);
            }
            if (searchQuery) {
                // Search by name or email
                query = query.or(`nombres.ilike.%${searchQuery}%,apellidos.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
            }

            const { data, count, error } = await query;
            if (error) throw error;

            renderTable(data);
            updatePagination(count);

        } catch (err) {
            console.error('Error fetching table:', err);
            tableBody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-red-500">Error loading data: ${err.message}</td></tr>`;
        }
    }

    function renderTable(data) {
        if (!data || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-400">No participants found.</td></tr>';
            return;
        }

        tableBody.innerHTML = data.map(p => {
            const statusColors = {
                'sin_pago': 'bg-gray-100 text-gray-600',
                'pendiente': 'bg-yellow-100 text-yellow-700',
                'verificado': 'bg-green-100 text-green-700',
                'rechazado': 'bg-red-100 text-red-700'
            };
            const statusBadge = `<span class="px-2 py-1 rounded text-xs font-bold uppercase ${statusColors[p.estado_pago] || 'bg-gray-100'}">${p.estado_pago.replace('_', ' ')}</span>`;

            return `
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td class="p-4">
                        <div class="flex flex-col">
                            <span class="font-bold text-gray-900">${p.nombres} ${p.apellidos}</span>
                            <span class="text-xs text-gray-500">${p.email}</span>
                        </div>
                    </td>
                    <td class="p-4 text-gray-600 hidden md:table-cell">${p.iglesia || '-'}</td>
                    <td class="p-4">
                        <div class="flex flex-col gap-1">
                            <span class="text-xs font-mono bg-gray-100 px-1 rounded w-fit">${p.codigo_registro || 'NO_CODE'}</span>
                            <span class="text-xs text-gray-400">${new Date(p.created_at).toLocaleDateString()}</span>
                        </div>
                    </td>
                    <td class="p-4">${statusBadge}</td>
                    <td class="p-4 text-right">
                        <a href="admin-detalle.html?id=${p.id}" class="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-white hover:border-primary hover:text-primary transition-all shadow-sm">
                            View Details
                        </a>
                    </td>
                </tr>
             `;
        }).join('');

        // Re-init icons if any injected
        if (window.lucide) lucide.createIcons();
    }

    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / pageSize);
        pageInfo.textContent = `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}`;

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage >= totalPages || totalPages === 0;
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});
