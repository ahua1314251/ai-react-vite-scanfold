export type ValidationRules<T> = Partial<{ [K in keyof T]: (value: T[K], values: T) => string | undefined }>;
export type ValidationErrors<T> = Partial<Record<keyof T, string>>;
/** Run synchronous field rules; an empty result means the form is valid. */
export function validateFields<T extends object>(values: T, rules: ValidationRules<T>): ValidationErrors<T> {
  const errors: ValidationErrors<T> = {};
  (Object.keys(rules) as Array<keyof T>).forEach(key => { const error = rules[key]?.(values[key], values); if (error) errors[key] = error; });
  return errors;
}
