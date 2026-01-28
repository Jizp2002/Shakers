document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const searchBtn = document.getElementById('search-btn');
    const codeInput = document.getElementById('reg-code');
    const searchSection = document.getElementById('search-section');
    const uploadSection = document.getElementById('upload-section');
    const successSection = document.getElementById('success-message');

    // Display Els
    const pName = document.getElementById('p-name');
    const pEmail = document.getElementById('p-email');
    const pStatus = document.getElementById('p-status');
    const pIdInput = document.getElementById('p-id');
    const amountDisplay = document.getElementById('payment-amount-display');

    // Form Els
    const paymentForm = document.getElementById('payment-form');
    const fileInput = document.getElementById('file-upload');
    const filePreview = document.getElementById('file-preview');
    const fileName = document.getElementById('file-name');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const submitBtn = document.getElementById('submit-payment');

    // --- Init ---
    // Check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('codigo');

    if (codeParam) {
        codeInput.value = codeParam;
        handleSearch(); // Auto trigger
    }

    // --- Search Logic ---
    searchBtn.addEventListener('click', handleSearch);

    async function handleSearch() {
        const code = codeInput.value.trim();
        if (!code) return;

        searchBtn.disabled = true;
        searchBtn.textContent = 'Buscando...';

        try {
            // 1. Get Participant
            // Using direct select with filter since we have RLS but 'codigo_registro' is unique and we need to find it by code.
            // Wait, standard RLS says participants can only see their own.
            // So 'select * from participantes' will return empty for anon unless we use the RPC function I created: get_participant_by_code

            const { data, error } = await supabase.rpc('get_participant_by_code', { p_code: code });

            if (error) throw error;

            if (!data || data.length === 0) {
                alert('Código no encontrado. Por favor verifique e intente nuevamente.');
                searchBtn.disabled = false;
                searchBtn.textContent = 'Buscar';
                return;
            }

            window.currentParticipant = data[0];
            const participant = window.currentParticipant;

            // 2. Get Config for Bank Details (Optional, but good UX)
            // Just hardcoding or fetching once is fine.

            // Display Data
            pName.textContent = `${participant.nombres} ${participant.apellidos}`;
            pEmail.textContent = participant.email;
            pIdInput.value = participant.id;

            if (amountDisplay) {
                const monto = participant.monto_a_pagar || 6000;
                amountDisplay.textContent = `$${monto.toLocaleString()} DOP`;
            }

            // Status Badge
            pStatus.textContent = participant.estado_pago.replace('_', ' ').toUpperCase();
            if (participant.estado_pago === 'verificado') {
                pStatus.className = 'px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold border border-green-200';
                // Maybe hide form if already paid?
                // alert('This payment is already verified!');
            } else if (participant.estado_pago === 'pendiente') {
                pStatus.className = 'px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold border border-yellow-200';
            } else {
                pStatus.className = 'px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold border border-gray-200';
            }

            // Show Form
            searchSection.classList.add('hidden'); // Hide search to focus on task? Or keep it? Let's hide to be clean.
            uploadSection.classList.remove('hidden');
            uploadSection.classList.add('flex');

        } catch (err) {
            console.error(err);
            alert('Error al buscar: ' + err.message);
            searchBtn.disabled = false;
            searchBtn.textContent = 'Buscar';
        }
    }

    // --- File Logic ---
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Archivo muy grande (Max 5MB)');
                fileInput.value = '';
                return;
            }

            uploadPlaceholder.classList.add('hidden');
            filePreview.classList.remove('hidden');
            fileName.textContent = file.name;
        }
    });

    // --- Submit Logic ---
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            alert('Por favor seleccione un archivo');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Subiendo...';

        try {
            const participantId = pIdInput.value;
            const now = new Date();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            // Clean filename
            const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
            const filePath = `2025/${month}/${participantId}/${Date.now()}_${cleanName}`;

            // 1. Upload File
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('comprobantes-pago')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Insert Payment Record
            const formData = new FormData(paymentForm);

            // Get Public URL (or just path since it's private bucket, we store path usually or signed url... 
            // Requirements said "URL... (link a Storage)".
            // Let's store the Full Path to retrieve later.

            const paymentData = {
                participante_id: participantId,
                monto: window.currentParticipant?.monto_a_pagar || 6000.00, // Use stored amount or fallback

                metodo_pago: formData.get('metodo_pago'),
                referencia_pago: formData.get('referencia_pago'),
                comprobante_url: filePath, // Store path for private buckets usually
                estado_pago: 'pendiente'
            };

            const { error: dbError } = await supabase
                .from('pagos')
                .insert([paymentData]);

            if (dbError) throw dbError;

            // 3. Update Participant Status to Pending
            const { error: updateError } = await supabase
                .from('participantes')
                .update({ estado_pago: 'pendiente' })
                .eq('id', participantId);

            if (updateError) console.warn('Status update warning:', updateError); // Non-fatal

            // 4. Show Success
            uploadSection.classList.add('hidden');
            successSection.classList.remove('hidden');
            successSection.classList.add('flex');

        } catch (err) {
            console.error(err);
            alert('Error al subir: ' + err.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Verificación';
        }
    });
});
