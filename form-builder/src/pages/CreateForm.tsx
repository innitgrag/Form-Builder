// pages/CreateForm.tsx
import React, { useState } from "react";

type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  password?: boolean;
  minNumber?: number;
  maxNumber?: number;
  minDate?: string;
  maxDate?: string;
}

interface Field {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue: string;
  options?: string[];
  validations?: ValidationRules;
  isDerived?: boolean;
  parentFieldIds?: string[];
  formula?: string;
}

export default function CreateForm() {
  const [fields, setFields] = useState<Field[]>([]);

  function addField(type: FieldType) {
    setFields([
      ...fields,
      {
        id: Date.now().toString(),
        type,
        label: "",
        required: false,
        defaultValue: type === "checkbox" ? "false" : "",
        options:
          type === "select" || type === "radio" || type === "checkbox"
            ? ["Option 1", "Option 2"]
            : undefined,
        validations: {},
        isDerived: false,
        parentFieldIds: [],
        formula: "",
      },
    ]);
  }

  function updateField(id: string, key: keyof Field, value: any) {
    setFields(
      fields.map((f) => {
        if (f.id === id) {
          if (key === "isDerived" && value === false) {
            return { ...f, isDerived: false, parentFieldIds: [], formula: "" };
          }
          return { ...f, [key]: value };
        }
        return f;
      })
    );
  }

  function deleteField(id: string) {
    setFields(fields.filter((f) => f.id !== id));
  }

  function moveFieldUp(index: number) {
    if (index === 0) return;
    const newFields = [...fields];
    [newFields[index - 1], newFields[index]] = [
      newFields[index],
      newFields[index - 1],
    ];
    setFields(newFields);
  }

  function moveFieldDown(index: number) {
    if (index === fields.length - 1) return;
    const newFields = [...fields];
    [newFields[index], newFields[index + 1]] = [
      newFields[index + 1],
      newFields[index],
    ];
    setFields(newFields);
  }

  function saveForm() {
    const formName = prompt("Enter form name");
    if (!formName) return alert("Form name is required");

    const savedForms = JSON.parse(localStorage.getItem("forms") || "[]");
    savedForms.push({
      id: Date.now().toString(),
      name: formName,
      createdAt: new Date().toISOString(),
      fields,
    });
    localStorage.setItem("forms", JSON.stringify(savedForms));
    alert("🎉 Form saved!");
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 text-center">
        Create Form
      </h1>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {[
          "text",
          "number",
          "textarea",
          "select",
          "radio",
          "checkbox",
          "date",
        ].map((type) => (
          <button
            key={type}
            onClick={() => addField(type as FieldType)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {fields.length === 0 && (
        <p className="text-center text-gray-500 text-lg">No fields added yet.</p>
      )}

      {fields.map((field, i) => (
        <div
          key={field.id}
          className="border rounded-lg p-5 mb-6 relative bg-gray-50 shadow-sm hover:shadow-md transition"
        >
          {/* Reorder Buttons */}
          <div className="absolute top-3 left-3 flex space-x-2">
            <button
              onClick={() => moveFieldUp(i)}
              disabled={i === 0}
              className={`text-gray-500 hover:text-gray-800 ${
                i === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Move Up"
            >
              ▲
            </button>
            <button
              onClick={() => moveFieldDown(i)}
              disabled={i === fields.length - 1}
              className={`text-gray-500 hover:text-gray-800 ${
                i === fields.length - 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Move Down"
            >
              ▼
            </button>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => deleteField(field.id)}
            className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-2xl font-bold"
            title="Delete Field"
            aria-label="Delete Field"
          >
            &times;
          </button>

          <label className="block font-semibold mb-2 text-gray-700">Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(field.id, "label", e.target.value)}
            className="border border-gray-300 rounded-md w-full p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter field label"
          />

          <label className="inline-flex items-center mb-4">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(field.id, "required", e.target.checked)}
              className="mr-2"
              disabled={field.isDerived}
              title={field.isDerived ? "Required disabled for derived fields" : ""}
            />
            <span className="text-gray-700 font-medium select-none">Required</span>
          </label>

          {(field.type === "select" ||
            field.type === "radio" ||
            field.type === "checkbox") && (
            <>
              <label className="block font-semibold mb-2 text-gray-700">
                Options (comma separated)
              </label>
              <input
                type="text"
                value={field.options?.join(", ") || ""}
                onChange={(e) =>
                  updateField(
                    field.id,
                    "options",
                    e.target.value.split(",").map((opt) => opt.trim())
                  )
                }
                className="border border-gray-300 rounded-md w-full p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Option 1, Option 2, Option 3"
                disabled={field.isDerived}
                title={field.isDerived ? "Options disabled for derived fields" : ""}
              />
            </>
          )}

          <label className="block font-semibold mb-2 text-gray-700">Default Value</label>
          <input
            type={field.type === "textarea" ? "text" : field.type}
            value={field.defaultValue}
            onChange={(e) => updateField(field.id, "defaultValue", e.target.value)}
            className="border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter default value"
            disabled={field.isDerived}
            title={field.isDerived ? "Default value disabled for derived fields" : ""}
          />

          {/* Validation Rules */}
          {!field.isDerived && (
            <div className="mt-4 border-t pt-4 text-gray-700">
              <p className="font-semibold mb-2">Validation Rules</p>

              {(field.type === "text" || field.type === "textarea") && (
                <>
                  <label className="block mb-1">
                    Min Length:
                    <input
                      type="number"
                      min={0}
                      value={field.validations?.minLength ?? ""}
                      onChange={(e) =>
                        updateField(field.id, "validations", {
                          ...field.validations,
                          minLength: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className="ml-2 w-20 border border-gray-300 rounded px-2 py-1"
                      placeholder="e.g. 3"
                    />
                  </label>

                  <label className="block mb-1">
                    Max Length:
                    <input
                      type="number"
                      min={0}
                      value={field.validations?.maxLength ?? ""}
                      onChange={(e) =>
                        updateField(field.id, "validations", {
                          ...field.validations,
                          maxLength: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className="ml-2 w-20 border border-gray-300 rounded px-2 py-1"
                      placeholder="e.g. 20"
                    />
                  </label>
                </>
              )}

              {field.type === "text" && (
                <>
                  <label className="inline-flex items-center mb-1">
                    <input
                      type="checkbox"
                      checked={field.validations?.email || false}
                      onChange={(e) =>
                        updateField(field.id, "validations", {
                          ...field.validations,
                          email: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    Validate Email Format
                  </label>

                  <label className="inline-flex items-center mb-1">
                    <input
                      type="checkbox"
                      checked={field.validations?.password || false}
                      onChange={(e) =>
                        updateField(field.id, "validations", {
                          ...field.validations,
                          password: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    Custom Password Rule (min 8 chars, must contain number)
                  </label>
                </>
              )}

              {field.type === "number" && (
                <>
                  <label className="block mb-1">
                    Min Number:
                    <input
                      type="number"
                      value={field.validations?.minNumber ?? ""}
                      onChange={(e) =>
                        updateField(field.id, "validations", {
                          ...field.validations,
                          minNumber: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className="ml-2 w-28 border border-gray-300 rounded px-2 py-1"
                      placeholder="e.g. 0"
                    />
                  </label>

                  <label className="block mb-1">
                    Max Number:
                    <input
                      type="number"
                      value={field.validations?.maxNumber ?? ""}
                      onChange={(e) =>
                        updateField(field.id, "validations", {
                          ...field.validations,
                          maxNumber: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className="ml-2 w-28 border border-gray-300 rounded px-2 py-1"
                      placeholder="e.g. 100"
                    />
                  </label>
                </>
              )}

              {field.type === "date" && (
                <>
                  <label className="block mb-1">
                    Min Date:
                    <input
                      type="date"
                      value={field.validations?.minDate ?? ""}
                      onChange={(e) =>
                        updateField(field.id, "validations", {
                          ...field.validations,
                          minDate: e.target.value || undefined,
                        })
                      }
                      className="ml-2 w-48 border border-gray-300 rounded px-2 py-1"
                    />
                  </label>

                  <label className="block mb-1">
                    Max Date:
                    <input
                      type="date"
                      value={field.validations?.maxDate ?? ""}
                      onChange={(e) =>
                        updateField(field.id, "validations", {
                          ...field.validations,
                          maxDate: e.target.value || undefined,
                        })
                      }
                      className="ml-2 w-48 border border-gray-300 rounded px-2 py-1"
                    />
                  </label>
                </>
              )}
            </div>
          )}

          {/* Derived Field UI */}
          <label className="inline-flex items-center mt-4 mb-2">
            <input
              type="checkbox"
              checked={field.isDerived || false}
              onChange={(e) =>
                updateField(field.id, "isDerived", e.target.checked)
              }
              className="mr-2"
            />
            <span className="font-semibold text-gray-700 cursor-pointer select-none">
              Mark as Derived Field
            </span>
          </label>

          {field.isDerived && (
            <div className="mt-2 border rounded p-4 bg-gray-100 text-gray-800">
              <label className="block font-semibold mb-1">
                Select Parent Field(s)
              </label>
              <select
                multiple
                value={field.parentFieldIds}
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  updateField(field.id, "parentFieldIds", selectedOptions);
                }}
                className="border border-gray-300 rounded w-full p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fields
                  .filter((f) => f.id !== field.id)
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label || `(No label) - ${f.type}`}
                    </option>
                  ))}
              </select>

              <label className="block font-semibold mb-1">Formula / Logic</label>
              <textarea
                value={field.formula}
                onChange={(e) => updateField(field.id, "formula", e.target.value)}
                placeholder={`E.g. Age = Current Year - Birth Year
Use parent fields by their labels or IDs.`}
                rows={4}
                className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-sm text-gray-600 mt-1">
                Define how this field’s value is computed from parent fields.
              </p>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={saveForm}
        disabled={fields.length === 0}
        className={`mt-6 w-full py-3 rounded-lg text-white font-semibold shadow-md transition
          ${
            fields.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
      >
        Save Form
      </button>
    </div>
  );
}
