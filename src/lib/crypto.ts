/**
 * lib/crypto.ts
 *
 * Utilitários de segurança para proteger dados de PII (Personally Identifiable
 * Information) antes de persistir no Firestore.
 *
 * Estratégia dupla:
 *  • AES-256-GCM  → criptografia autenticada; permite recuperar o valor original.
 *  • HMAC-SHA256  → hash determinístico; permite consultas sem descriptografar.
 *
 * ATENÇÃO: usados exclusivamente no servidor (API Routes / Server Actions).
 */

import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12; // 96-bit IV recomendado para GCM
const TAG_BYTES = 16;

function getEncryptionKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("ENCRYPTION_KEY inválida: deve ter 64 caracteres hexadecimais (32 bytes).");
  }
  return Buffer.from(hex, "hex");
}

function getHmacSecret(): Buffer {
  const hex = process.env.HMAC_SECRET;
  if (!hex || hex.length < 32) {
    throw new Error("HMAC_SECRET inválida: deve ter ao menos 32 caracteres hexadecimais.");
  }
  return Buffer.from(hex, "hex");
}

/**
 * Criptografa um texto plano com AES-256-GCM.
 * Formato de saída: "<iv_hex>:<authTag_hex>:<ciphertext_hex>"
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    ciphertext.toString("hex"),
  ].join(":");
}

/**
 * Descriptografa um valor gerado por `encrypt`.
 */
export function decrypt(encoded: string): string {
  const parts = encoded.split(":");
  if (parts.length !== 3) throw new Error("Formato de dado criptografado inválido.");

  const [ivHex, tagHex, ctHex] = parts;
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(tagHex, "hex");

  if (iv.length !== IV_BYTES) throw new Error("IV inválido.");
  if (authTag.length !== TAG_BYTES) throw new Error("Auth tag inválido.");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(Buffer.from(ctHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
}

/**
 * Gera um HMAC-SHA256 de um valor normalizado.
 * Permite buscar registros sem descriptografar os dados.
 *
 * @param value  - valor original (será normalizado: trim + lowercase)
 */
export function hashForQuery(value: string): string {
  const normalized = value.trim().toLowerCase();
  return createHmac("sha256", getHmacSecret()).update(normalized, "utf8").digest("hex");
}
