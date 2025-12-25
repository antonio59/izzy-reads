import { forwardRef, useState } from "react";
import { Eye, EyeOff, Search, X } from "lucide-react";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "filled" | "outlined";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  variant?: InputVariant;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  clearable?: boolean;
  onClear?: () => void;
  fullWidth?: boolean;
}

const sizeStyles: Record<
  InputSize,
  { input: string; icon: string; label: string }
> = {
  sm: {
    input: "px-3 py-1.5 text-sm",
    icon: "w-4 h-4",
    label: "text-xs",
  },
  md: {
    input: "px-4 py-2.5 text-base",
    icon: "w-5 h-5",
    label: "text-sm",
  },
  lg: {
    input: "px-5 py-3 text-lg",
    icon: "w-6 h-6",
    label: "text-base",
  },
};

const variantStyles: Record<InputVariant, string> = {
  default: "bg-white border border-stone-200 focus:border-primary-400",
  filled:
    "bg-stone-100 border border-transparent focus:bg-white focus:border-primary-400",
  outlined: "bg-transparent border-2 border-stone-300 focus:border-primary-500",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      size = "md",
      variant = "default",
      icon,
      iconPosition = "left",
      clearable = false,
      onClear,
      fullWidth = true,
      className = "",
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const styles = sizeStyles[size];
    const hasLeftIcon = icon && iconPosition === "left";
    const hasRightIcon = icon && iconPosition === "right";
    const showClear = clearable && props.value && !disabled;

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block font-medium text-stone-700 mb-1.5 ${styles.label}`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {hasLeftIcon && (
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 ${styles.icon}`}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              w-full rounded-xl font-body transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-400/30
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-100
              placeholder:text-stone-400
              ${variantStyles[variant]}
              ${styles.input}
              ${hasLeftIcon ? "pl-10" : ""}
              ${hasRightIcon || showClear ? "pr-10" : ""}
              ${error ? "border-error-500 focus:border-error-500 focus:ring-error-400/30" : ""}
              ${className}
            `}
            {...props}
          />
          {hasRightIcon && !showClear && (
            <span
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 ${styles.icon}`}
            >
              {icon}
            </span>
          )}
          {showClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className={styles.icon} />
            </button>
          )}
        </div>
        {(error || hint) && (
          <p
            className={`mt-1.5 text-xs ${error ? "text-error-500" : "text-stone-500"}`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

// Search Input variant
interface SearchInputProps extends Omit<
  InputProps,
  "icon" | "iconPosition" | "clearable"
> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onClear, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch((e.target as HTMLInputElement).value);
      }
      props.onKeyDown?.(e);
    };

    return (
      <Input
        ref={ref}
        icon={<Search />}
        iconPosition="left"
        clearable
        onClear={onClear}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";

// Password Input variant
interface PasswordInputProps extends Omit<
  InputProps,
  "type" | "icon" | "iconPosition"
> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input ref={ref} type={showPassword ? "text" : "password"} {...props} />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

// Textarea variant
interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      size = "md",
      variant = "default",
      fullWidth = true,
      showCount = false,
      maxLength,
      className = "",
      disabled,
      id,
      value,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const styles = sizeStyles[size];
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block font-medium text-stone-700 mb-1.5 ${styles.label}`}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          value={value}
          maxLength={maxLength}
          className={`
            w-full rounded-xl font-body transition-all duration-200 resize-none
            focus:outline-none focus:ring-2 focus:ring-primary-400/30
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-100
            placeholder:text-stone-400
            ${variantStyles[variant]}
            ${styles.input}
            ${error ? "border-error-500 focus:border-error-500 focus:ring-error-400/30" : ""}
            ${className}
          `}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          {(error || hint) && (
            <p
              className={`text-xs ${error ? "text-error-500" : "text-stone-500"}`}
            >
              {error || hint}
            </p>
          )}
          {showCount && (
            <p
              className={`text-xs text-stone-400 ml-auto ${maxLength && charCount >= maxLength ? "text-error-500" : ""}`}
            >
              {charCount}
              {maxLength ? `/${maxLength}` : ""} characters
            </p>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

// Select variant
interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      size = "md",
      variant = "default",
      fullWidth = true,
      options,
      placeholder,
      className = "",
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const styles = sizeStyles[size];

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block font-medium text-stone-700 mb-1.5 ${styles.label}`}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`
            w-full rounded-xl font-body transition-all duration-200 appearance-none
            bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23736d65" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')] 
            bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem]
            focus:outline-none focus:ring-2 focus:ring-primary-400/30
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-100
            ${variantStyles[variant]}
            ${styles.input}
            pr-10
            ${error ? "border-error-500 focus:border-error-500 focus:ring-error-400/30" : ""}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {(error || hint) && (
          <p
            className={`mt-1.5 text-xs ${error ? "text-error-500" : "text-stone-500"}`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Input;
