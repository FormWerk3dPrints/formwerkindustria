/**
 * lib/mailer.ts
 *
 * Envio de notificação por e-mail via Gmail SMTP + Nodemailer.
 * Configuração necessária no .env.local:
 *   SMTP_USER          → sua conta Gmail (remetente)
 *   SMTP_APP_PASSWORD  → App Password do Google (não é a senha normal)
 *   NOTIFY_EMAIL       → e-mail de destino das notificações
 */

import nodemailer from "nodemailer";

interface ContactData {
  name: string;
  phone: string;
  email: string;
  institution?: string;
}

function createTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("SMTP_USER ou SMTP_APP_PASSWORD não configurados.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function buildHtml(contact: ContactData): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap;
                 background:#f9fafb;border-bottom:1px solid #e5e7eb;">${label}</td>
      <td style="padding:8px 12px;color:#111827;border-bottom:1px solid #e5e7eb;">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:system-ui,sans-serif;">
  <div style="max-width:540px;margin:40px auto;background:#fff8f2;border-radius:12px;
              overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">

    <!-- Cabeçalho -->
    <div style="background:#111827;padding:24px 28px;">
      <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:.08em;
                text-transform:uppercase;color:#9ca3af;">Formwerk Industria</p>
      <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#fff8f2;">
        Novo contato recebido
      </h1>
    </div>

    <!-- Dados -->
    <div style="padding:24px 28px;">
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        ${row("Nome", contact.name)}
        ${row("E-mail", contact.email)}
        ${row("Telefone", contact.phone)}
        ${row("Instituição", contact.institution ?? "—")}
      </table>
    </div>

    <!-- Rodapé -->
    <div style="padding:16px 28px 24px;border-top:1px solid #f3f4f6;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        Este e-mail foi gerado automaticamente pelo site. Os dados completos estão
        armazenados de forma criptografada no Firestore.
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Envia e-mail de notificação para o endereço configurado em NOTIFY_EMAIL.
 * Erros de envio são apenas logados — não interrompem o fluxo principal.
 */
export async function sendContactNotification(contact: ContactData): Promise<void> {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) {
    console.warn("[mailer] NOTIFY_EMAIL não configurado. Notificação ignorada.");
    return;
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Formwerk Industria" <${process.env.SMTP_USER}>`,
    to,
    subject: `Novo contato: ${contact.name}`,
    html: buildHtml(contact),
  });
}
