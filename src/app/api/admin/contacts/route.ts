/**
 * app/api/admin/contacts/route.ts
 *
 * Retorna os contatos cadastrados, descriptografados, para o painel admin.
 * Protegido por verificação de ID Token do Firebase + allowlist de e-mails.
 */

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { decrypt } from "@/lib/crypto";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // ── Autenticação ───────────────────────────────────────────────────────
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (!token) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    await verifyAdminToken(token);

    // ── Consulta ───────────────────────────────────────────────────────────
    const snapshot = await adminDb
      .collection("contacts")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const contacts = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        name: decrypt(d.name),
        phone: decrypt(d.phone),
        email: decrypt(d.email),
        institution: d.institution ? decrypt(d.institution) : null,
        createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    return NextResponse.json({ contacts });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno.";

    if (message === "Acesso não autorizado." || message === "Não autenticado.") {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    if (message.includes("Firebase ID token")) {
      return NextResponse.json({ error: "Token inválido ou expirado." }, { status: 401 });
    }

    console.error("[admin/contacts] Erro:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
