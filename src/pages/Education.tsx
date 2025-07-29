export function Education() {
  const tips = [
    "✅ Check the sender's email address carefully.",
    "🔗 Hover over links to see the actual URL.",
    "🛑 Never enter personal info on suspicious pages.",
    "🧠 Phishing emails often create urgency or fear.",
    "📛 Look for poor grammar and spelling mistakes."
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Phishing Awareness Tips</h2>
      <ul className="list-disc pl-5 text-gray-700 space-y-1">
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}
