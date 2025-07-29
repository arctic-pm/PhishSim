import { useEffect, useState } from "react";

/* ---------- types ---------- */
interface Campaign {
  id: number;
  name: string;
  target_email: string;
  template_title: string;
  opened: number;
  clicked: number;
  opened_at: string | null; // new field
}

interface Template {
  id: number;
  title: string;
  body: string;
}

/* ---------- component ---------- */
export function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  const [name, setName] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [templateId, setTemplateId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── load data ── */
  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
  }, []);

  const fetchCampaigns = async () => {
    const res = await fetch("http://localhost:5000/api/campaigns");
    setCampaigns(await res.json());
  };

  const fetchTemplates = async () => {
    const res = await fetch("http://localhost:5000/api/templates");
    setTemplates(await res.json());
  };

  /* ── create campaign ── */
  const createCampaign = async () => {
    if (!name || !targetEmail || !templateId) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("http://localhost:5000/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        target_email: targetEmail,
        template_id: templateId
      })
    });
    if (!res.ok) {
      setError("Could not save campaign");
    } else {
      await fetchCampaigns();
      setName("");
      setTargetEmail("");
      setTemplateId(null);
    }
    setLoading(false);
  };

  /* ── send tracked email ── */
  const sendTrackedEmail = async (c: Campaign) => {
    const t = templates.find((tpl) => tpl.title === c.template_title);
    if (!t) return alert("Template not found!");

    const res = await fetch("http://localhost:5000/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign_id: c.id,
        to: c.target_email,
        subject: t.title,
        body: t.body
      })
    });
    if (res.ok) {
      alert("Email sent!");
    } else {
      alert("Failed to send email");
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Campaigns</h2>

      {/* form */}
      <div className="space-y-2 rounded border p-4 shadow-sm">
        <h3 className="font-medium">New Campaign</h3>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Campaign Name"
          className="w-full rounded border px-3 py-2 text-sm"
        />

        <input
          value={targetEmail}
          onChange={(e) => setTargetEmail(e.target.value)}
          placeholder="Target Email"
          className="w-full rounded border px-3 py-2 text-sm"
        />

        <select
          value={templateId ?? ""}
          onChange={(e) => setTemplateId(Number(e.target.value))}
          className="w-full rounded border px-3 py-2 text-sm"
        >
          <option value="">Select Template</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>

        <button
          onClick={createCampaign}
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {loading ? "Saving…" : "Create Campaign"}
        </button>
      </div>

      {/* analytics table */}
      <div className="rounded border p-4">
        <h3 className="mb-2 font-semibold">Campaign Analytics</h3>
        {campaigns.length === 0 ? (
          <p className="text-sm text-gray-500">No campaigns found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Opened</th>
                <th className="p-2">Opened At</th>
                <th className="p-2">Clicked</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.id}</td>
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.target_email}</td>
                  <td className="p-2">{c.opened > 0 ? `${c.opened}` : "—"}</td>
                <td className="p-2">
                  {c.opened_at
                    ? new Date(c.opened_at).toLocaleString()
                    : "—"}
                </td>
                <td className="p-2">{c.clicked > 0 ? ` ${c.clicked} ` : "—"}</td>
                <td className="p-2">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => sendTrackedEmail(c)}
                  >
                    Send Test Email
                  </button>
                </td>
              </tr>

              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
