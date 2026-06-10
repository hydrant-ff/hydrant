"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wnotgdoszazajchqziav.supabase.co/rest/v1/",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indub3RnZG9zemF6YWpjaHF6aWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTE3NDEsImV4cCI6MjA5NjY4Nzc0MX0.mapown-zcnhsmD32_18hvWV9n0Ru8QBCoSDCdK_ZQOs"
);

export default function Home() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function loadMembers() {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("active", true)
        .order("last_name", { ascending: true });

      if (!error) {
        setMembers(data);
      }
    }

    loadMembers();
  }, []);

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
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            color: "#dc2626",
            fontSize: "42px",
          }}
        >
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
          gridTemplateColumns:
            "repeat(auto-fill, minmax(260px, 1fr))",
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
              {member.first_name} {member.last_name}
            </h2>

            <p
              style={{
                color: "#d1d5db",
                marginTop: "10px",
                fontSize: "18px",
              }}
            >
              Offen:{" "}
              {Number(member.balance).toFixed(2)} €
            </p>
          </button>
        ))}
      </div>
    </main>
  );
}
