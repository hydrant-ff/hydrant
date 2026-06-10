"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wnotgdoszazajchqziav.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indub3RnZG9zemF6YWpjaHF6aWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTE3NDEsImV4cCI6MjA5NjY4Nzc0MX0.mapown-zcnhsmD32_18hvWV9n0Ru8QBCoSDCdK_ZQOs"
);

export default function Home() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] =
    useState(null);

  // Test-Warenkorb
  const [cart] = useState([
    { name: "Cola" },
    { name: "Cola" },
    { name: "Cola" },
    { name: "Wasser" },
    { name: "Snickers" },
    { name: "Snickers" },
  ]);

  useEffect(() => {
    async function loadMembers() {
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("active", true)
        .order("last_name", {
          ascending: true,
        });

      setMembers(data || []);
    }

    loadMembers();
  }, []);

  const filteredMembers = members.filter(
    (member) =>
      `${member.first_name} ${member.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  function groupedCart() {
    const grouped = {};

    cart.forEach((item) => {
      if (!grouped[item.name]) {
        grouped[item.name] = {
          ...item,
          quantity: 1,
        };
      } else {
        grouped[item.name].quantity += 1;
      }
    });

    return Object.values(grouped);
  }

  // Einkaufsseite
  if (selectedMember) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom, #081223, #111827)",
          color: "white",
          padding: "20px",
          fontFamily: "Arial",
        }}
      >
        <button
          onClick={() =>
            setSelectedMember(null)
          }
          style={{
            background: "#1f2937",
            color: "white",
            border: "none",
            padding: "14px 20px",
            borderRadius: "14px",
            marginBottom: "30px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          ← Zurück
        </button>

        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "999px",
              background: "#374151",
              border:
                "4px solid #dc2626",
              margin:
                "0 auto 20px",
            }}
          />

          <h1
            style={{
              fontSize: "38px",
              marginBottom: "10px",
            }}
          >
            {
              selectedMember.first_name
            }{" "}
            {
              selectedMember.last_name
            }
          </h1>

          <p
            style={{
              color: "#f87171",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            Offen:{" "}
            {Number(
              selectedMember.balance
            ).toFixed(2)}{" "}
            €
          </p>

          <button
            style={{
              marginTop: "40px",
              background:
                "#dc2626",
              color: "white",
              border:
                "none",
              padding:
                "22px 40px",
              borderRadius:
                "20px",
              fontSize:
                "28px",
              cursor:
                "pointer",
            }}
          >
            📷 Scannen starten
          </button>

          <div
            style={{
              marginTop: "40px",
              textAlign: "left",
              background:
                "#1f2937",
              padding:
                "24px",
              borderRadius:
                "20px",
            }}
          >
            <h2>
              Warenkorb
            </h2>

            {groupedCart().map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  style={{
                    padding:
                      "12px 0",
                    fontSize:
                      "22px",
                  }}
                >
                  {
                    item.name
                  }{" "}
                  ×{" "}
                  {
                    item.quantity
                  }
                </div>
              )
            )}

            <button
              style={{
                marginTop:
                  "30px",
                width:
                  "100%",
                background:
                  "#dc2626",
                color:
                  "white",
                border:
                  "none",
                padding:
                  "20px",
                borderRadius:
                  "18px",
                fontSize:
                  "24px",
                cursor:
                  "pointer",
              }}
            >
              Buchen
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Mitgliederseite
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #081223, #111827)",
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
            color: "#ef4444",
            fontSize: "52px",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          🚒 HYDRANT
        </h1>

        <p
          style={{
            color: "#9ca3af",
            marginTop: 0,
          }}
        >
          Feuerwehr Getränkekasse
        </p>
      </div>

      <input
        placeholder="Mitglied suchen..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: "16px",
          border:
            "1px solid #374151",
          marginBottom:
            "30px",
          fontSize: "20px",
          background:
            "#1f2937",
          color: "white",
          boxSizing:
            "border-box",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredMembers.map(
          (member) => (
            <button
              key={member.id}
              onClick={() =>
                setSelectedMember(
                  member
                )
              }
              style={{
                background:
                  "linear-gradient(to bottom, #1f2937, #111827)",
                border:
                  "2px solid #dc2626",
                borderRadius:
                  "24px",
                padding:
                  "24px",
                color:
                  "white",
                textAlign:
                  "left",
                cursor:
                  "pointer",
                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.35)",
              }}
            >
              <div
                style={{
                  width:
                    "90px",
                  height:
                    "90px",
                  borderRadius:
                    "999px",
                  background:
                    "#374151",
                  marginBottom:
                    "20px",
                  border:
                    "3px solid #dc2626",
                }}
              />

              <h2
                style={{
                  margin: 0,
                  fontSize:
                    "24px",
                }}
              >
                {
                  member.first_name
                }{" "}
                {
                  member.last_name
                }
              </h2>

              <p
                style={{
                  color:
                    Number(
                      member.balance
                    ) > 0
                      ? "#f87171"
                      : "#4ade80",
                  marginTop:
                    "14px",
                  fontSize:
                    "22px",
                  fontWeight:
                    "bold",
                }}
              >
                Offen:{" "}
                {Number(
                  member.balance
                ).toFixed(
                  2
                )}{" "}
                €
              </p>
            </button>
          )
        )}
      </div>
    </main>
  );
}
