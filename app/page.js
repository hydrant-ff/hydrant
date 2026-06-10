export default function Home() {
  const members = [
    {
      id: 1,
      name: "Max Mustermann",
      balance: 12.5,
    },
    {
      id: 2,
      name: "Anna Schneider",
      balance: 4,
    },
    {
      id: 3,
      name: "Tim Wagner",
      balance: 18,
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ color: "#dc2626" }}>
        🚒 HYDRANT
      </h1>

      {members.map((member) => (
        <div
          key={member.id}
          style={{
            background: "#1f2937",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "16px",
            border: "1px solid #dc2626",
          }}
        >
          <h2>{member.name}</h2>
          <p>
            Offen: {member.balance.toFixed(2)} €
          </p>
        </div>
      ))}
    </main>
  );
}
