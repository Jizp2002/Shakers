import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// More comprehensive CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform",
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { record } = await req.json();

        if (!record || !record.email) {
            throw new Error("No record found or missing email");
        }

        const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f6f8f6; padding: 30px;">
        <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h1 style="color: #13ec5b; margin-bottom: 20px; font-size: 28px;">¡Bienvenido al Campamento Shakers!</h1>
          <p style="color: #333; font-size: 16px;">Hola <strong>${record.nombres}</strong>,</p>
          <p style="color: #555; font-size: 15px; line-height: 1.6;">Estamos muy emocionados de que hayas decidido unirte a nosotros en esta aventura de fe y crecimiento espiritual.</p>
          
          <div style="background: linear-gradient(135deg, #f6f8f6 0%, #e8f5e9 100%); padding: 30px; border-radius: 12px; margin: 25px 0; text-align: center; border: 2px solid #13ec5b;">
              <p style="margin: 0 0 10px 0; color: #555; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Tu código de registro es:</p>
              <h2 style="color: #0d1b12; margin: 0; font-size: 36px; letter-spacing: 3px; font-family: monospace;">${record.codigo_registro}</h2>
          </div>

          <p style="color: #555; font-size: 15px; line-height: 1.6;">El próximo paso es confirmar tu cupo realizando el pago correspondiente.</p>
          
          <div style="text-align: center; margin: 30px 0;">
              <a href="https://tudominio.com/verificar-pago.html?codigo=${record.codigo_registro}" 
                 style="background-color: #13ec5b; color: #0d1b12; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                 Subir Comprobante de Pago
              </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 35px 0;">
          
          <p style="text-align: center; color: #888; font-style: italic; font-size: 14px; line-height: 1.6;">
              "Por tanto, id, y haced discípulos a todas las naciones..." <br>
              <strong style="color: #666;">Mateo 28:19</strong>
          </p>
        </div>
        
        <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            © 2026 Campamento Shakers - Todos los derechos reservados
        </p>
      </div>
    `;

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
                    subject: "Confirmación de Registro - Campamento Shakers",
                    html: emailHtml,
                }),
            });

            if (!res.ok) {
                const d = await res.json();
                console.error("Resend API error:", d);
                throw new Error(JSON.stringify(d));
            }

            console.log("Email sent successfully to:", record.email);
        } else {
            console.log("[MOCK] Email would be sent to:", record.email, "Code:", record.codigo_registro);
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Edge function error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
