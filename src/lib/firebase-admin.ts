/**
 * lib/firebase-admin.ts
 *
 * Inicialização do Firebase Admin SDK (somente servidor).
 * Usa padrão singleton para evitar múltiplas instâncias em dev (hot-reload).
 */

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!base64) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_BASE64 não definida. " +
        "Consulte .env.local.example para configuração."
    );
  }

  const serviceAccount = JSON.parse(
    Buffer.from(base64, "base64").toString("utf8")
  );

  return initializeApp({ credential: cert(serviceAccount) });
}

export const adminDb = getFirestore(getAdminApp());
export const adminAuth = getAuth(getAdminApp());
