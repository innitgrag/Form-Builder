// pages/PreviewForm.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  password?: boolean;
}

interface Field {
  id: string;
  type: string;
  label: string;
  required: boolean;
  defaultValue: string;
  options?: string[];
  validations?: ValidationRules;
}

export default function PreviewForm() {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("id");

  const [fields, setFields] = useState<Field[]>([]);
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem("forms") || "[]");
    let formToLoad;

    if (formId) {
      formToLoad = savedForms.find((f: any) => f.id === formId);
    }
    if (!formToLoad && savedForms.length > 0) {
      formToLoad = savedForms[savedForms.length - 1];
    }

    if (formToLoad) {
      setFields(formToLoad.fields);
      const initialValues: { [key: string]: string } = {};
      formToLoad.fields.forEach((f: Field) => {
        initialValues[f.id] = f.defaultValue || (f.type === "checkbox" ? "false" : "");
      });
      setValues(initialValues);
    }
  }, [formId]);

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(pwd: string) {
    return pwd.length >= 8 && /\d/.test(pwd);
  }

  function handleChange(id: string, value: string) {
    setValues({ ...values, [id]: value });
    setErrors({ ...errors, [id]: "" });
  }

  function handleCheckboxChange(id: string, checked: boolean) {
    setValues({ ...values, [id]: checked ? "true" : "false" });
    setErrors({ ...errors, [id]: "" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    fields.forEach((f) => {
      const val = values[f.id] || "";

      // Required validation
      if (f.required) {
        if (f.type === "checkbox" && val !== "true") {
          newErrors[f.id] = `${f.label || "Field"} is required`;
          return;
        }
        if (!val.trim()) {
          newErrors[f.id] = `${f.label || "Field"} is required`;
          return;
        }
      }

      const v = f.validations;
      if (v) {
        if (v.minLength !== undefined && val.length < v.minLength) {
          newErrors[f.id] = `${f.label} must be at least ${v.minLength} characters`;
        }
        if (v.maxLength !== undefined && val.length > v.maxLength) {
          newErrors[f.id] = `${f.label} must be at most ${v.maxLength} characters`;
        }
        if (v.email && val && !validateEmail(val)) {
          newErrors[f.id] = `${f.label} must be a valid email`;
        }
        if (v.password && val && !validatePassword(val)) {
          newErrors[f.id] =
            `${f.label} must be at least 8 characters and contain a number`;
        }
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("🎉 Form submitted successfully!");
    }
  }

  if (fields.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500 font-semibold text-lg">
        No form to preview. Please create a form first.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 text-center">
        Preview Form
      </h1>

      <form onSubmit={handleSubmit} noValidate>
        {fields.map((field) => {
          const value = values[field.id] || "";
          const error = errors[field.id];

          return (
            <div key={field.id} className="mb-6">
              <label
                className={`block text-lg font-semibold mb-2 ${
                  error ? "text-red-600" : "text-gray-700"
                }`}
              >
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {(field.type === "text" ||
                field.type === "number" ||
                field.type === "date") && (
                <input
                  type={field.type}
                  value={value}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`w-full rounded-md border px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } transition`}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  value={value}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`w-full rounded-md border px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 resize-y min-h-[80px] ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } transition`}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}

              {field.type === "select" && (
                <select
                  value={value}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`w-full rounded-md border px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } transition`}
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "radio" && (
                <div className="flex gap-4">
                  {field.options?.map((opt, i) => (
                    <label key={i} className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        name={field.id}
                        value={opt}
                        checked={value === opt}
                        onChange={() => handleChange(field.id, opt)}
                        className="text-blue-600"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === "checkbox" && (
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value === "true"}
                    onChange={(e) => handleCheckboxChange(field.id, e.target.checked)}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">{field.label}</span>
                </label>
              )}

              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
          );
        })}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
