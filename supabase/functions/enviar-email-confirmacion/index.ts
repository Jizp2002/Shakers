import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
    }

    try {
        const { record } = await req.json(); // Payload from Database Webhook or direct call
        // If triggered by webhook, 'record' contains the new participant data

        if (!record || !record.email) {
            throw new Error("No record found");
        }

        const emailHtml = `
      <h1>Registration Confirmed!</h1>
      <p>Hello ${record.nombres},</p>
      <p>You have successfully registered for Camp CCB.</p>
      <p>Your Registration Code is: <strong>${record.codigo_registro}</strong></p>
      <p>Please proceed to pay the registration fee.</p>
      <a href="https://tudominio.com/verificar-pago.html?codigo=${record.codigo_registro}">
        Upload Payment Proof
      </a>
    `;

        // Only send if API Key exists (Mocking support)
        if (RESEND_API_KEY) {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: "Camp CCB <onboarding@resend.dev>",
                    to: [record.email],
                    subject: "Registration Confirmed - Camp CCB",
                    html: emailHtml,
                }),
            });

            if (!res.ok) {
                const d = await res.json();
                throw new Error(JSON.stringify(d));
            }
        } else {
            console.log("Mock Email Sent to:", record.email, record.codigo_registro);
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
});
