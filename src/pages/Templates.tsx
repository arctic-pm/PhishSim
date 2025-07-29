import { useState, useEffect } from "react";

interface Template {
  id: number;
  title: string;
  subject: string;
  body: string;
}

export function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch templates on load
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/templates");
      const data = await res.json();
      setTemplates(data);
    } catch (err) {
      setError("Failed to fetch templates.");
    }
  };

  const saveTemplate = async () => {
    if (!title || !subject || !body) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subject, body }),
      });

      if (!res.ok) throw new Error("Template creation failed");

      const newTemplate = await res.json();
      setTemplates((prev) => [
        ...prev,
        { id: newTemplate.id, title, subject, body },
      ]);
      setTitle("");
      setSubject("");
      setBody("");
    } catch (err) {
      setError("Could not save template.");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Email Templates</h2>

      {/* Form */}
      <div className="space-y-2 rounded border p-4 shadow-sm">
        <h3 className="font-medium">New Template</h3>
        {error && <p className="text-sm text-red-500">{error}</p>}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Template Title"
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Email Subject"
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Email Body (HTML or plain text)"
          className="w-full rounded border px-3 py-2 text-sm"
          rows={4}
        />
        <button
          onClick={saveTemplate}
          disabled={loading}
          className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          {loading ? "Saving..." : "Save Template"}
        </button>
      </div>

      {/* Template List */}
      <div className="rounded border p-4">
        <h3 className="mb-2 font-semibold">Saved Templates</h3>
        {templates.length === 0 ? (
          <p className="text-sm text-gray-500">No templates found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Title</th>
                <th className="p-2">Subject</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-2">{t.id}</td>
                  <td className="p-2">{t.title}</td>
                  <td className="p-2">{t.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
