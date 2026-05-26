/**
 * lib/auth.ts
 *
 * Verificação de token JWT do Firebase Auth (somente servidor).
 * Garante que apenas e-mails cadastrados na coleção "admins" do Firestore
 * acessem o painel administrativo.
 *
 * Estrutura do documento:
 *   Collection: admins
 *   Document ID: e-mail normalizado (lowercase)
 *   Fields: { active: boolean, addedAt: Timestamp }
 */

import { adminAuth, adminDb } from "./firebase-admin";

/**
 * Verifica o ID Token do Firebase e checa se o e-mail existe
 * e está ativo na coleção `admins` do Firestore.
 * @returns e-mail do usuário autenticado
 * @throws se o token for inválido ou o e-mail não estiver autorizado
 */
export async function verifyAdminToken(token: string): Promise<string> {
  const decoded = await adminAuth.verifyIdToken(token);

  const email = (decoded.email ?? "").toLowerCase();
  if (!email) throw new Error("Token sem e-mail associado.");

  const docSnap = await adminDb.collection("admins").doc(email).get();

  if (!docSnap.exists || docSnap.data()?.active !== true) {
    throw new Error("Acesso não autorizado.");
  }

  return email;
}
