document.addEventListener('DOMContentLoaded', async () => {
    // --- Auth Check ---
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'admin-login.html';
        return;
    }

    // --- State ---
    const urlParams = new URLSearchParams(window.location.search);
    const participantId = urlParams.get('id');
    let paymentId = null;

    if (!participantId) {
        alert('No participant ID provided');
        window.location.href = 'admin-dashboard.html';
        return;
    }

    // --- Elements ---
    const verifyBtn = document.getElementById('verify-btn');
    const rejectBtn = document.getElementById('reject-btn');
    const saveNotesBtn = document.getElementById('save-notes-btn');
    const adminNotes = document.getElementById('admin-notes');

    // --- Init ---
    loadData();

    // --- Actions ---
    verifyBtn.addEventListener('click', () => updateStatus('verificado'));
    rejectBtn.addEventListener('click', () => updateStatus('rechazado'));

    saveNotesBtn.addEventListener('click', async () => {
        if (!paymentId) return alert('No payment record to attach notes to');

        saveNotesBtn.disabled = true;
        saveNotesBtn.textContent = 'Saving...';

        try {
            const { error } = await supabase
                .from('pagos')
                .update({ notas: adminNotes.value })
                .eq('id', paymentId);

            if (error) throw error;
            saveNotesBtn.textContent = 'Saved!';
            setTimeout(() => saveNotesBtn.textContent = 'Save Note', 2000);
        } catch (err) {
            console.error(err);
            alert('Error saving notes');
            saveNotesBtn.textContent = 'Save Note';
        }
        saveNotesBtn.disabled = false;
    });

    // --- Functions ---
    async function loadData() {
        try {
            // 1. Fetch Participant
            const { data: p, error: pError } = await supabase
                .from('participantes')
                .select('*')
                .eq('id', participantId)
                .single();

            if (pError) throw pError;

            // Fill Header
            document.getElementById('header-code').textContent = p.codigo_registro;
            const statusBadge = document.getElementById('header-status');
            statusBadge.textContent = p.estado_pago.toUpperCase();

            const statusColors = {
                'sin_pago': 'bg-gray-200 text-gray-700',
                'pendiente': 'bg-yellow-200 text-yellow-800',
                'verificado': 'bg-green-200 text-green-800',
                'rechazado': 'bg-red-200 text-red-800'
            };
            statusBadge.className = `px-2 py-1 rounded text-xs font-bold uppercase ${statusColors[p.estado_pago]}`;

            // Fill Fields
            setText('d-name', `${p.nombres} ${p.apellidos}`);
            setText('d-email', p.email);
            setText('d-phone', p.telefono);
            setText('d-dob', `${p.fecha_nacimiento} (${p.edad || '?'} years)`);
            setText('d-sex', p.sexo);
            setText('d-shirt', p.talla_camisa);
            setText('d-address', p.direccion || '-');
            setText('d-church', p.iglesia || '-');

            setText('d-blood', p.tipo_sangre || '-');
            setText('d-allergies', p.alergias || 'None');
            setText('d-meds', p.medicamentos || 'None');
            setText('d-conditions', p.condiciones_medicas || 'None');

            setText('d-emer-name', p.nombre_emergencia);
            setText('d-emer-phone', p.telefono_emergencia);
            setText('d-emer-rel', p.relacion_emergencia);

            // 2. Fetch Payment
            const { data: pay, error: payError } = await supabase
                .from('pagos')
                .select('*')
                .eq('participante_id', participantId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (pay) {
                paymentId = pay.id;
                document.getElementById('payment-details').classList.remove('hidden');
                document.getElementById('pay-amount').textContent = `$${pay.monto}`;
                document.getElementById('pay-method').textContent = pay.metodo_pago;
                document.getElementById('pay-ref').textContent = pay.referencia_pago;

                // Construct signed URL or just use path if admin has access.
                // Since bucket is private but we have admin policies, we might need signed URL or download.
                // For 'storage-js' with authenticated user who has policy, createSignedUrl is best.

                const { data: urlData } = await supabase.storage
                    .from('comprobantes-pago')
                    .createSignedUrl(pay.comprobante_url, 3600); // 1 hour

                if (urlData) {
                    document.getElementById('pay-proof-link').href = urlData.signedUrl;
                } else {
                    document.getElementById('pay-proof-link').href = '#'; // Fallback
                    console.warn('Could not generate signed URL for:', pay.comprobante_url);
                }

                if (pay.notas) adminNotes.value = pay.notas;

            } else {
                document.getElementById('no-payment-msg').classList.remove('hidden');
                verifyBtn.disabled = true;
                rejectBtn.disabled = true;
            }

            // Buttons State
            if (p.estado_pago === 'verificado') {
                verifyBtn.textContent = 'Already Verified';
                verifyBtn.disabled = true;
                verifyBtn.classList.add('opacity-50');
            } else if (p.estado_pago === 'rechazado') {
                rejectBtn.textContent = 'Rejected';
                rejectBtn.disabled = true;
                rejectBtn.classList.add('opacity-50');
            }

        } catch (err) {
            console.error(err);
            alert('Error loading details');
        }
    }

    async function updateStatus(newStatus) {
        if (!paymentId) return;
        if (!confirm(`Are you sure you want to mark this as ${newStatus.toUpperCase()}?`)) return;

        try {
            // Update Payment
            const { error: e1 } = await supabase
                .from('pagos')
                .update({
                    estado_pago: newStatus,
                    verificado_por: session.user.id,
                    fecha_verificacion: new Date().toISOString()
                })
                .eq('id', paymentId);
            if (e1) throw e1;

            // Update Participant
            const { error: e2 } = await supabase
                .from('participantes')
                .update({ estado_pago: newStatus })
                .eq('id', participantId);
            if (e2) throw e2;

            alert(`Status updated to ${newStatus}`);
            location.reload();

        } catch (err) {
            console.error(err);
            alert('Error updating status');
        }
    }

    function setText(id, text) {
        document.getElementById(id).textContent = text;
    }
});
