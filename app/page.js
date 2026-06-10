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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ color: "#dc2626", fontSize: "42px" }}>
          🚒 HYDRANT
        </h1>
      </div>

      <input
        placeholder="Mitglied suchen..."
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "12px",
          border: "none",
          marginBottom: "24px",
          fontSize: "18px",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {members.map((member) => (
          <button
            key={member.id}
            style={{
              background: "#1f2937",
              border: "2px solid #dc2626",
              borderRadius: "18px",
              padding: "24px",
              color: "white",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "999px",
                background: "#374151",
                marginBottom: "16px",
              }}
            />

            <h2 style={{ margin: 0 }}>
              {member.name}
            </h2>

            <p
              style={{
                color: "#d1d5db",
                marginTop: "10px",
                fontSize: "18px",
              }}
            >
              Offen: {member.balance.toFixed(2)} €
            </p>
          </button>
        ))}
      </div>
    </main>
  );
}
