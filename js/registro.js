document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let currentStep = 1;
    const totalSteps = 3;

    // --- Elements ---
    const form = document.getElementById('registration-form');
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressBar = document.getElementById('progress-bar');
    const stepLabels = [
        document.getElementById('step-label-1'),
        document.getElementById('step-label-2'),
        document.getElementById('step-label-3')
    ];

    // Inputs for validation
    const emailInput = document.getElementById('email');
    const dobInput = document.getElementById('fecha_nacimiento');
    const userPhoneInput = document.querySelector('input[name="telefono"]');
    const emerPhoneInput = document.getElementById('telefono_emergencia');

    // --- Navigation Logic ---
    function updateUI() {
        // Show active step
        steps.forEach((step, idx) => {
            if (idx + 1 === currentStep) {
                step.classList.add('active');
                step.classList.remove('hidden'); // Ensure flex is working via class
                step.style.display = 'flex';

                // Re-enable required validation for current step
                const inputs = step.querySelectorAll('input[data-required="true"], select[data-required="true"], textarea[data-required="true"]');
                inputs.forEach(input => {
                    input.setAttribute('required', 'required');
                });
            } else {
                step.classList.remove('active');
                step.style.display = 'none';

                // Disable required validation for inactive steps
                const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
                inputs.forEach(input => {
                    input.setAttribute('data-required', 'true');
                    input.removeAttribute('required');
                });
            }
        });

        // Progress Bar
        const progress = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;

        // Labels
        stepLabels.forEach((lbl, idx) => {
            if (idx + 1 <= currentStep) lbl.classList.add('text-primary');
            else lbl.classList.remove('text-primary');
        });

        // Buttons
        prevBtn.classList.toggle('hidden', currentStep === 1);
        if (currentStep === totalSteps) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    // Initial State
    updateUI();

    // --- Validation Helpers ---
    function validateStep1() {
        const required = ['nombres', 'apellidos', 'fecha_nacimiento', 'sexo', 'email', 'telefono'];
        let isValid = true;

        required.forEach(field => {
            const el = form.querySelector(`[name="${field}"]`);
            if (el && !el.value) {
                el.classList.add('border-red-500');
                isValid = false;
            } else if (el) {
                el.classList.remove('border-red-500');
            }
        });

        // Age Check
        if (dobInput.value) {
            const age = calculateAge(new Date(dobInput.value));
            if (age < 2 || age > 60) {
                alert('La edad debe estar comprendida entre 2 y 60 años.');
                dobInput.classList.add('border-red-500');
                isValid = false;
            }
        }

        return isValid;
    }

    function calculateAge(birthday) {
        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    // Age & Price Display
    dobInput.addEventListener('change', updatePrice);
    const roomSelect = document.getElementById('tipo_habitacion');
    if (roomSelect) roomSelect.addEventListener('change', updatePrice);

    function updatePrice() {
        if (!dobInput.value) return;

        const age = calculateAge(new Date(dobInput.value));
        document.getElementById('age-display').textContent = `Edad: ${age} años`;

        let basePrice = 6000; // Adult Default
        if (age <= 5) basePrice = 1200; // Niños (< 5)
        else if (age >= 6 && age <= 12) basePrice = 5000; // Pre-adolescentes (6-12)
        else basePrice = 6000; // Adultos/Jóvenes (13+)

        let roomPrice = 0;
        const roomType = document.getElementById('tipo_habitacion').value;
        if (roomType === 'pareja') roomPrice = 1500;
        if (roomType === 'familia') roomPrice = 1800;

        const total = basePrice + roomPrice;

        const fmt = (n) => '$' + n.toLocaleString();

        const baseEl = document.getElementById('base-fee-display');
        const roomEl = document.getElementById('room-fee-display');
        const totalEl = document.getElementById('total-fee-display');

        if (baseEl) baseEl.textContent = fmt(basePrice);
        if (roomEl) roomEl.textContent = fmt(roomPrice);
        if (totalEl) totalEl.textContent = fmt(total);

        return total;
    }

    async function checkEmailUnique(email) {
        try {
            const { count, error } = await supabase
                .from('participantes')
                .select('*', { count: 'exact', head: true })
                .eq('email', email);

            if (error) throw error;
            return count === 0;
        } catch (err) {
            console.error(err);
            return true; // Optionally default to allow if network fail? Or block.
        }
    }

    // Navigation Events
    nextBtn.addEventListener('click', async () => {
        if (currentStep === 1) {
            if (!validateStep1()) return;

            // Async checks
            nextBtn.disabled = true;
            nextBtn.textContent = 'Verificando...';

            try {
                // Check if supabase is available
                if (typeof supabase !== 'undefined') {
                    const isUnique = await checkEmailUnique(emailInput.value);

                    if (!isUnique) {
                        document.getElementById('email-error').classList.remove('hidden');
                        emailInput.classList.add('border-red-500');
                        nextBtn.disabled = false;
                        nextBtn.textContent = 'Siguiente';
                        return;
                    } else {
                        document.getElementById('email-error').classList.add('hidden');
                    }
                } else {
                    console.warn('Supabase not configured - skipping email uniqueness check');
                }
            } catch (error) {
                console.error('Error checking email:', error);
                // Continue anyway for local testing
            }

            nextBtn.disabled = false;
            nextBtn.textContent = 'Siguiente';
        }

        if (currentStep === 3) return; // Should not trigger

        currentStep++;
        updateUI();
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });

    // --- Submit Logic ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Final validation
        if (userPhoneInput.value === emerPhoneInput.value) {
            document.getElementById('phone-error').classList.remove('hidden');
            emerPhoneInput.classList.add('border-red-500');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        const formData = new FormData(form);
        const dataObj = {};
        formData.forEach((value, key) => dataObj[key] = value);

        // Add calculated fields
        dataObj.edad = calculateAge(new Date(dataObj.fecha_nacimiento));

        // Calculate final price one last time to be sure
        const totalPrice = updatePrice() || 6000;
        dataObj.monto_a_pagar = totalPrice;

        try {
            // Check if Supabase is configured
            if (typeof supabase === 'undefined') {
                throw new Error('Supabase no está configurado. Por favor contacta al administrador.');
            }

            // Use RPC to avoid RLS issues with public inserts
            const { data, error } = await supabase.rpc('registrar_participante', {
                p_nombres: dataObj.nombres,
                p_apellidos: dataObj.apellidos,
                p_email: dataObj.email,
                p_telefono: dataObj.telefono,
                p_fecha_nacimiento: dataObj.fecha_nacimiento,
                p_sexo: dataObj.sexo,
                p_direccion: dataObj.direccion,
                p_iglesia: dataObj.iglesia,
                p_tipo_habitacion: dataObj.tipo_habitacion,
                p_talla_camisa: dataObj.talla_camisa,
                p_tipo_sangre: dataObj.tipo_sangre,
                p_alergias: dataObj.alergias,
                p_medicamentos: dataObj.medicamentos,
                p_condiciones_medicas: dataObj.condiciones_medicas,
                p_nombre_emergencia: dataObj.nombre_emergencia,
                p_telefono_emergencia: dataObj.telefono_emergencia,
                p_relacion_emergencia: dataObj.relacion_emergencia,
                p_monto_a_pagar: dataObj.monto_a_pagar,
                p_edad: dataObj.edad
            });

            if (error) throw error;

            // Trigger Email (Edge Function)
            try {
                const { error: funcError } = await supabase.functions.invoke('enviar-email-confirmacion', {
                    body: { record: data }
                });
                if (funcError) console.warn('Email function warning:', funcError);
            } catch (err) {
                console.warn('Failed to invoke email function:', err);
            }

            // Success
            showSuccessModal(data.codigo_registro);

        } catch (error) {
            console.error('Registration error:', error);
            let errorMessage = 'Error al enviar el registro.';

            if (error.message) {
                errorMessage += ' ' + error.message;
            }

            alert(errorMessage);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Finalizar Registro';
        }
    });

    function showSuccessModal(code) {
        const modal = document.getElementById('success-modal');
        const modalContent = document.getElementById('modal-content');
        const codeDisplay = document.getElementById('generated-code');
        const payLink = document.getElementById('modal-payment-link');

        codeDisplay.textContent = code;
        payLink.href = `verificar-pago.html?codigo=${code}`;

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Animation
        setTimeout(() => {
            modalContent.classList.remove('opacity-0', 'scale-95');
            modalContent.classList.add('opacity-100', 'scale-100');
        }, 10);
    }
});
