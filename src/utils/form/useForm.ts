import { get } from 'lodash';
import { useState, useMemo } from 'react';
import { z, ZodSchema } from 'zod';

interface UseFormProps<T> {
  values: T;
  required?: string[];
  schema?: ZodSchema<T>;
}

export const useForm = <T extends object>({
  values,
  required = [],
  schema,
}: UseFormProps<T>) => {
  const [form, setForm] = useState(values);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const onChange = ({
    name,
    value,
  }: {
    name: keyof T | string;
    value: T[keyof T];
  }) => {
    setForm((prevValue) => ({ ...prevValue, [name]: value }));

    // Validate the field on change if a schema is provided
    if (schema) {
      try {
        schema.parse({ ...form, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [get(error, 'errors.[0].path.[0]', name)]:
              error.errors[0].message || '',
          }));
        }
      }
    }
  };

  const validateForm = () => {
    if (schema) {
      try {
        schema.parse(form);
        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = error.errors.reduce((acc, err) => {
            acc[err.path[0] as keyof T] = err.message;
            return acc;
          }, {} as Partial<Record<keyof T, string>>);
          setErrors(fieldErrors);
        }
        return false;
      }
    }
    return true;
  };

  const updateMany = (obj: Partial<T>) => {
    setForm((prevValue) => ({ ...prevValue, ...obj }));
  };

  const clear = () => {
    setForm(values);
    setErrors({});
  };

  const isDisabled = useMemo(() => {
    const isFormFilled = Object.keys(form).every((val) => {
      if (required.includes(val)) {
        return Boolean(form[val as keyof T]);
      }
      return true;
    });
    const isZodValidationPassed = Object.values(errors).every(
      (value) => !value
    );
    return !isFormFilled || !isZodValidationPassed;
  }, [form]);

  return {
    form,
    setForm,
    onChange,
    clear,
    updateMany,
    isDisabled,
    errors,
    validateForm,
  };
};
