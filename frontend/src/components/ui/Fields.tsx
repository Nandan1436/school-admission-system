import { useId, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./Field.module.css";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: string[];
  placeholder?: string;
}

export function SelectField({ label, error, options, placeholder, id, className = "", ...props }: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
      </label>
      <div className={error ? styles.selectWrapInvalid : styles.selectWrap}>
        <select id={fieldId} aria-invalid={Boolean(error)} className={styles.select} {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  mono?: boolean;
}

export function TextField({ label, error, hint, mono, id, className = "", ...props }: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const inputClass = [styles.input, mono ? styles.mono : "", error ? styles.invalid : ""].filter(Boolean).join(" ");
  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
        </label>
      )}
      <input id={fieldId} aria-invalid={Boolean(error)} className={inputClass} {...props} />
      {error && <p className={styles.error}>{error}</p>}
      {!error && hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
