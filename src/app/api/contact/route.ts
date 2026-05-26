/**
 * app/api/contact/route.ts
 *
 * API Route para receber e persistir os dados do formulário de contato.
 *
 * Fluxo de segurança:
 *  1. Validação básica dos campos obrigatórios.
 *  2. Sanitização (trim) antes de qualquer processamento.
 *  3. Criptografia AES-256-GCM de todos os campos (recuperáveis).
 *  4. Hash HMAC-SHA256 de email e telefone (pesquisáveis sem expor PII).
 *  5. Persistência no Firestore com timestamp de servidor.
 */

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { encrypt, hashForQuery } from "@/lib/crypto";
import { sendContactNotification } from "@/lib/mailer";
import { FieldValue } from "firebase-admin/firestore";

/* ─── Tipos ─────────────────────────────────────────────────────────────── */

interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  institution?: string;
}

/* ─── Validação ──────────────────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()\-+]{7,20}$/;

function validate(body: unknown): ContactPayload {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Payload inválido.");
  }

  const { name, phone, email, institution } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length < 2) {
    throw new Error("Nome inválido (mínimo 2 caracteres).");
  }
  if (typeof phone !== "string" || !PHONE_RE.test(phone.trim())) {
    throw new Error("Telefone inválido.");
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    throw new Error("E-mail inválido.");
  }
  if (institution !== undefined && institution !== null && institution !== "") {
    if (typeof institution !== "string" || institution.trim().length < 2) {
      throw new Error("Instituição inválida (mínimo 2 caracteres).");
    }
  }

  return {
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    institution:
      typeof institution === "string" && institution.trim().length >= 2
        ? institution.trim()
        : undefined,
  };
}

/* ─── Handler ────────────────────────────────────────────────────────────── */

export async function POST(request: NextRequest) {
  try {
    // Evita Content-Type manipulation
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type deve ser application/json." },
        { status: 415 }
      );
    }

    const body = await request.json();
    const payload = validate(body);

    // Criptografa cada campo (permite recuperação posterior)
    const encryptedName = encrypt(payload.name);
    const encryptedPhone = encrypt(payload.phone);
    const encryptedEmail = encrypt(payload.email);
    const encryptedInstitution = payload.institution ? encrypt(payload.institution) : null;

    // Hashes para consulta sem expor PII
    const emailHash = hashForQuery(payload.email);
    const phoneHash = hashForQuery(payload.phone);

    await adminDb.collection("contacts").add({
      name: encryptedName,
      phone: encryptedPhone,
      email: encryptedEmail,
      institution: encryptedInstitution,
      emailHash,
      phoneHash,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Notificação por e-mail — falha silenciosa para não afetar o cadastro
    sendContactNotification({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      institution: payload.institution,
    }).catch((err) => console.error("[mailer] Falha ao enviar notificação:", err));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno.";

    // Não expor detalhes de stack em produção
    const isValidationError =
      err instanceof Error &&
      [
        "Nome inválido",
        "Telefone inválido",
        "E-mail inválido",
        "Instituição inválida",
        "Payload inválido",
      ].some((prefix) => message.startsWith(prefix));

    if (isValidationError) {
      return NextResponse.json({ error: message }, { status: 422 });
    }

    console.error("[contact/route] Erro interno:", err);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
