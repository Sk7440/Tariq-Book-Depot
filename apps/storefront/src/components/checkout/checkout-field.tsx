"use client";

import type { InputHTMLAttributes } from "react";

interface CheckoutFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  hint?: string;
  isTextarea?: boolean;
  isWide?: boolean;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

/** One labelled field with hint and error, as in the HTML checkout's f(). */
export function CheckoutField({ id, label, value, onChange, onBlur, error, hint, isTextarea = false, isWide = false, inputProps }: CheckoutFieldProps) {
  const describedBy = [hint ? `h-${id}` : null, `e-${id}`].filter(Boolean).join(" ");
  return (
    <div className={isWide ? "field span2" : "field"}>
      <label htmlFor={`f-${id}`}>{label}</label>
      {isTextarea ? (
        <textarea id={`f-${id}`} name={id} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          id={`f-${id}`}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...inputProps}
        />
      )}
      {hint && <p className="field__hint" id={`h-${id}`}>{hint}</p>}
      <p className="field__err" id={`e-${id}`}>{error ?? ""}</p>
    </div>
  );
}
