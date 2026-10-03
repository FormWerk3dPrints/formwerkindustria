"use client";

/**
 * components/ContactForm.tsx
 *
 * Formulário de contato com envio para /api/contact.
 * Os dados são criptografados e hasheados no servidor antes de persistir.
 */

import { useState } from "react";
import { buttonClasses } from "@/components/ui/button";

interface FormState {
  name: string;
  phone: string;
  email: string;
  institution: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const INITIAL_STATE: FormState = {
  name: "",
  phone: "",
  email: "",
  institution: "",
};

function InputField({
  id,
  label,
  type = "text",
  required,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  id: keyof FormState;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (id: keyof FormState, value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-danger ml-0.5" aria-hidden="true">*</span>}
        {!required && (
          <span className="ml-1.5 text-xs font-normal text-ink-subtle">(opcional)</span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={id === "email" ? "email" : id === "phone" ? "tel" : "on"}
        className="w-full rounded-md border border-border-strong bg-surface-0 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle shadow-sm transition-[border-color,box-shadow] focus:outline-none focus:border-ink focus:shadow-[0_0_0_3px_var(--accent-tint),0_0_0_1px_var(--focus-ring)] disabled:bg-surface-100 disabled:text-ink-subtle disabled:cursor-not-allowed"
      />
    </div>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  function handleChange(id: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          institution: form.institution || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Erro ao enviar. Tente novamente.");
      }

      setStatus("success");
      setForm(INITIAL_STATE);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Erro inesperado. Tente novamente."
      );
    }
  }

  const isLoading = status === "loading";

  return (
    <div className="w-full max-w-lg mx-auto">
      {status === "success" ? (
          <div className="rounded-xl border border-success bg-success-tint p-8 text-center" role="status">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-0">
            <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-success mb-1">Mensagem recebida!</h3>
          <p className="text-sm text-ink-muted">
            Obrigado pelo contato. Retornaremos em breve.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-5 text-sm text-ink underline underline-offset-2 decoration-accent hover:text-accent-ink transition-colors"
          >
            Enviar outra mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <InputField
            id="name"
            label="Nome completo"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Seu nome"
            disabled={isLoading}
          />
          <InputField
            id="phone"
            label="Telefone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="+55 (11) 00000-0000"
            disabled={isLoading}
          />
          <InputField
            id="email"
            label="E-mail"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            disabled={isLoading}
          />
          <InputField
            id="institution"
            label="Instituição que representa"
            value={form.institution}
            onChange={handleChange}
            placeholder="Nome da empresa ou organização"
            disabled={isLoading}
          />

          {status === "error" && (
            <div className="rounded-md bg-danger-tint border border-danger px-4 py-3 text-sm text-danger" role="alert">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading || undefined}
            className={buttonClasses("primary", "md", "mt-1 w-full")}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Enviando…
              </span>
            ) : (
              "Enviar mensagem"
            )}
          </button>

          <p className="text-center text-xs text-ink-subtle">
            Seus dados são armazenados de forma criptografada e protegida.
          </p>
        </form>
      )}
    </div>
  );
}
