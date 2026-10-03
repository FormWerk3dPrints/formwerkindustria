"use client";

/**
 * app/admin/page.tsx
 *
 * Painel administrativo protegido por login Google via Firebase Auth.
 * Somente e-mails listados em ADMIN_ALLOWED_EMAILS têm acesso aos dados.
 */

import { useEffect, useState, useCallback } from "react";
import { firebaseApp } from "@/lib/firebase";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { buttonClasses } from "@/components/ui/button";

/* ─── Tipos ──────────────────────────────────────────────────────────────── */

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  institution: string | null;
  createdAt: string | null;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/* ─── Componente da tabela ───────────────────────────────────────────────── */

function ContactsTable({ contacts }: { contacts: Contact[] }) {
  if (contacts.length === 0) {
    return (
      <p className="text-center text-ink-subtle py-16 text-sm">
        Nenhum contato cadastrado ainda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-surface-100 font-mono text-xs font-medium text-ink-subtle uppercase tracking-[0.12em]">
          <tr>
            <th className="px-5 py-3.5">Nome</th>
            <th className="px-5 py-3.5">E-mail</th>
            <th className="px-5 py-3.5">Telefone</th>
            <th className="px-5 py-3.5">Instituição</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface-0">
          {contacts.map((c) => (
            <tr key={c.id} className="hover:bg-surface-100 transition-colors">
              <td className="px-5 py-4 font-medium text-ink whitespace-nowrap">{c.name}</td>
              <td className="px-5 py-4 text-ink-muted">{c.email}</td>
              <td className="px-5 py-4 text-ink-muted whitespace-nowrap">{c.phone}</td>
              <td className="px-5 py-4 text-ink-muted">{c.institution ?? "—"}</td>
              <td className="px-5 py-4 font-mono text-ink-subtle whitespace-nowrap text-xs">
                {formatDate(c.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Página principal ───────────────────────────────────────────────────── */

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string>("");

  /* Observa estado de autenticação */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  /* Busca contatos assim que o usuário autentica */
  const fetchContacts = useCallback(async (currentUser: User) => {
    setDataLoading(true);
    setError("");
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch("/api/admin/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao buscar contatos.");
      setContacts(data.contacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchContacts(user);
  }, [user, fetchContacts]);

  /* Ações */
  async function handleLogin() {
    setError("");
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      const messages: Record<string, string> = {
        "auth/unauthorized-domain":
          "Domínio não autorizado. Adicione 'localhost' em Firebase Console → Authentication → Authorized domains.",
        "auth/popup-blocked":
          "Popup bloqueado pelo navegador. Permita popups para este site.",
        "auth/popup-closed-by-user": "",
        "auth/cancelled-popup-request": "",
        "auth/operation-not-allowed":
          "Provedor Google não está habilitado. Ative em Firebase Console → Authentication → Sign-in method → Google.",
        "auth/configuration-not-found":
          "Firebase Authentication não inicializado. Acesse Firebase Console → Authentication → clique em 'Get started' e ative o provedor Google.",
        "auth/invalid-api-key":
          "API Key inválida. Verifique NEXT_PUBLIC_FIREBASE_API_KEY no .env.local.",
      };
      const msg = messages[code];
      if (msg === undefined) {
        setError(`Erro ao autenticar (${code || "desconhecido"}). Tente novamente.`);
      } else if (msg !== "") {
        setError(msg);
      }
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setContacts([]);
    setError("");
  }

  /* ── Render ─────────────────────────────────────────────────────────── */

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-ink-subtle text-sm">Carregando…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6">
        <div className="text-center">
          <p className="eyebrow mb-3">Área restrita</p>
          <h1 className="text-2xl font-bold text-ink mb-2">Painel Admin</h1>
          <p className="text-sm text-ink-muted">Acesso restrito. Faça login com sua conta Google autorizada.</p>
        </div>
        {error && (
          <p className="text-sm text-danger bg-danger-tint border border-danger rounded-md px-4 py-2">
            {error}
          </p>
        )}
        <button
          onClick={handleLogin}
          className={buttonClasses("secondary", "md", "bg-surface-0")}
        >
          {/* Google icon */}
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Contatos recebidos</h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Logado como <span className="font-medium text-ink">{user.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchContacts(user)}
            disabled={dataLoading}
            className={buttonClasses("secondary", "md", "px-4 py-2")}
          >
            {dataLoading ? "Atualizando…" : "Atualizar"}
          </button>
          <button
            onClick={handleLogout}
            className={buttonClasses("primary", "md", "px-4 py-2")}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="mb-6 rounded-md bg-danger-tint border border-danger px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Total */}
      {!dataLoading && contacts.length > 0 && (
        <p className="font-mono text-xs text-ink-subtle mb-3">
          {contacts.length} contato{contacts.length !== 1 ? "s" : ""} encontrado{contacts.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Tabela */}
      {dataLoading ? (
        <div className="flex justify-center py-20">
          <svg className="h-6 w-6 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      ) : (
        <ContactsTable contacts={contacts} />
      )}
    </div>
  );
}
