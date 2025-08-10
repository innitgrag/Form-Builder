import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import CreateForm from "./pages/CreateForm";
import PreviewForm from "./pages/PreviewForm";
import MyForms from "./pages/MyForms";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow p-4 flex space-x-6">
          <Link to="/create" className="text-blue-600 hover:underline">Create Form</Link>
          <Link to="/preview" className="text-blue-600 hover:underline">Preview Form</Link>
          <Link to="/myforms" className="text-blue-600 hover:underline">My Forms</Link>
        </nav>

        <main className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/create" replace />} />
            <Route path="/create" element={<CreateForm />} />
            <Route path="/preview" element={<PreviewForm />} />
            <Route path="/myforms" element={<MyForms />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
