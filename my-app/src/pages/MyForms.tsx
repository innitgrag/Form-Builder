// pages/MyForms.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Form {
  id: string;
  name: string;
  createdAt: string;
  fields: any[];
}

export default function MyForms() {
  const [forms, setForms] = useState<Form[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem("forms") || "[]");
    setForms(savedForms);
  }, []);

  if (forms.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500 font-semibold text-lg">
        No saved forms found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 text-center">My Forms</h1>
      <ul className="divide-y divide-gray-200">
        {forms.map((form) => (
          <li
            key={form.id}
            onClick={() => navigate(`/preview?id=${form.id}`)}
            className="cursor-pointer p-4 hover:bg-gray-100 rounded transition flex justify-between items-center"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(`/preview?id=${form.id}`);
              }
            }}
          >
            <div className="text-blue-600 font-semibold text-lg">{form.name}</div>
            <div className="text-gray-500 text-sm">
              Created on: {new Date(form.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
