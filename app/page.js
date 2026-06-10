"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BrowserMultiFormatReader } from "@zxing/browser";

const supabase = createClient(
  "https://wnotgdoszazajchqziav.supabase.co",
  "DEIN_ANON_KEY_HIER"
);

export default function Home() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] =
    useState(null);

  const [scannerOpen, setScannerOpen] =
    useState(false);

  const [cart, setCart] = useState([]);
  const [lastProduct, setLastProduct] =
    useState(null);

  const videoRef = useRef(null);
  const scannerRef = useRef(null);

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

  async function startScanner() {
    setScannerOpen(true);

    const codeReader =
      new BrowserMultiFormatReader();

    scannerRef.current = codeReader;

    try {
      const devices =
        await BrowserMultiFormatReader.listVideoInputDevices();

      const camera =
        devices[0];

      codeReader.decodeFromVideoDevice(
        camera?.deviceId,
        videoRef.current,
        async (result) => {
          if (result) {
            const barcode =
              result.getText();

            console.log(
              "Barcode erkannt:",
              barcode
            );

            const { data } =
              await supabase
                .from("products")
                .select("*")
                .eq("barcode", barcode)
                .single();

            if (data) {
              setLastProduct(data);
              setCart((prev) => [
                ...prev,
                data,
              ]);
            } else {
              alert(
                `Produkt nicht gefunden: ${barcode}`
              );
            }

            stopScanner();
          }
        }
      );
    } catch (err) {
      console.error(err);
      alert(
        "Kamera konnte nicht geöffnet werden."
      );
    }
  }

  function stopScanner() {
    scannerRef.current?.reset();
    setScannerOpen(false);
  }

  function continueScanning() {
    setLastProduct(null);
    startScanner();
  }

  function bookItems() {
    alert(
      "Buchung kommt im nächsten Schritt 😄"
    );
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

          <h1>
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

          {!scannerOpen &&
            !lastProduct && (
              <button
                onClick={
                  startScanner
                }
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
            )}

          {scannerOpen && (
            <div
              style={{
                marginTop: "30px",
              }}
            >
              <video
                ref={videoRef}
                style={{
                  width: "100%",
                  borderRadius:
                    "20px",
                }}
              />

              <button
                onClick={
                  stopScanner
                }
                style={{
                  marginTop:
                    "20px",
                  background:
                    "#374151",
                  color: "white",
                  border:
                    "none",
                  padding:
                    "12px 24px",
                  borderRadius:
                    "12px",
                }}
              >
                Abbrechen
              </button>
            </div>
          )}

          {lastProduct && (
            <div
              style={{
                marginTop: "30px",
                background:
                  "#1f2937",
                padding:
                  "24px",
                borderRadius:
                  "20px",
              }}
            >
              <h2>
                ✅{" "}
                {
                  lastProduct.name
                }{" "}
                erkannt
              </h2>

              <p
                style={{
                  fontSize:
                    "28px",
                }}
              >
                {Number(
                  lastProduct.price
                ).toFixed(2)}{" "}
                €
              </p>

              <button
                onClick={
                  continueScanning
                }
                style={{
                  marginRight:
                    "12px",
                  background:
                    "#374151",
                  color: "white",
                  border:
                    "none",
                  padding:
                    "14px 22px",
                  borderRadius:
                    "12px",
                }}
              >
                Weiter scannen
              </button>

              <button
                onClick={
                  bookItems
                }
                style={{
                  background:
                    "#dc2626",
                  color: "white",
                  border:
                    "none",
                  padding:
                    "14px 22px",
                  borderRadius:
                    "12px",
                }}
              >
                Buchen
              </button>
            </div>
          )}

          {cart.length > 0 && (
            <div
              style={{
                marginTop: "40px",
                textAlign: "left",
                background:
                  "#1f2937",
                padding:
                  "20px",
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
                        "10px 0",
                      fontSize:
                        "20px",
                    }}
                  >
                    {
                      item.name
                    }{" "}
                    ×
                    {
                      item.quantity
                    }
                  </div>
                )
              )}
            </div>
          )}
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
            fontWeight:
              "bold",
          }}
        >
          🚒 HYDRANT
        </h1>
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

              <h2>
                {
                  member.first_name
                }{" "}
                {
                  member.last_name
                }
              </h2>

              <p>
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
}        });

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

  async function startScanner() {
    setScannerOpen(true);

    
const codeReader =
  new BrowserMultiFormatReader(hints);

    scannerRef.current = codeReader;

    try {
      const devices =
        await BrowserMultiFormatReader.listVideoInputDevices();

     const backCamera =
  devices.find(
    (d) =>
      d.label
        .toLowerCase()
        .includes("back") ||
      d.label
        .toLowerCase()
        .includes("rear")
  ) ||
  devices[devices.length - 1];

      codeReader.decodeFromVideoDevice(
        backCamera.deviceId,
        videoRef.current,
        async (result) => {
          if (result) {
            const barcode =
              result.getText();

            const { data } =
              await supabase
                .from("products")
                .select("*")
                .eq("barcode", barcode)
                .single();

            if (data) {
              setLastProduct(data);
              setCart((prev) => [
                ...prev,
                data,
              ]);
            }

            stopScanner();
          }
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  function stopScanner() {
    scannerRef.current?.reset();
    setScannerOpen(false);
  }

  function continueScanning() {
    setLastProduct(null);
    startScanner();
  }

  function bookItems() {
    alert("Buchung kommt im nächsten Schritt 😄");
  }

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
          }}
        >
          ← Zurück
        </button>

        <div
          style={{
            textAlign: "center",
          }}
        >
          <h1>
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
              fontSize: "26px",
              fontWeight: "bold",
            }}
          >
            Offen:{" "}
            {Number(
              selectedMember.balance
            ).toFixed(2)}{" "}
            €
          </p>

          {!scannerOpen &&
            !lastProduct && (
              <button
                onClick={
                  startScanner
                }
                style={{
                  background:
                    "#dc2626",
                  color: "white",
                  border:
                    "none",
                  padding:
                    "20px 40px",
                  borderRadius:
                    "20px",
                  fontSize:
                    "28px",
                  cursor:
                    "pointer",
                  marginTop:
                    "30px",
                }}
              >
                📷 Scannen starten
              </button>
            )}

          {scannerOpen && (
            <div
              style={{
                marginTop: "30px",
              }}
            >
              <video
                ref={videoRef}
                style={{
                  width: "100%",
                  borderRadius:
                    "20px",
                }}
              />

              <button
                onClick={
                  stopScanner
                }
                style={{
                  marginTop:
                    "20px",
                }}
              >
                Abbrechen
              </button>
            </div>
          )}

          {lastProduct && (
            <div
              style={{
                marginTop: "30px",
                background:
                  "#1f2937",
                padding:
                  "24px",
                borderRadius:
                  "20px",
              }}
            >
              <h2>
                ✅{" "}
                {
                  lastProduct.name
                }{" "}
                erkannt
              </h2>

              <p
                style={{
                  fontSize:
                    "26px",
                }}
              >
                {Number(
                  lastProduct.price
                ).toFixed(2)}{" "}
                €
              </p>

              <button
                onClick={
                  continueScanning
                }
                style={{
                  marginRight:
                    "12px",
                }}
              >
                Weiter scannen
              </button>

              <button
                onClick={
                  bookItems
                }
              >
                Buchen
              </button>
            </div>
          )}

          {cart.length > 0 && (
            <div
              style={{
                marginTop: "40px",
                textAlign: "left",
              }}
            >
              <h2>
                Warenkorb
              </h2>

              {cart.map(
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
                    }}
                  >
                    {item.name} —{" "}
                    {Number(
                      item.price
                    ).toFixed(
                      2
                    )}{" "}
                    €
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

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
          }}
        >
          🚒 HYDRANT
        </h1>
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
          marginBottom: "30px",
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
                  "#1f2937",
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
              }}
            >
              <h2>
                {
                  member.first_name
                }{" "}
                {
                  member.last_name
                }
              </h2>

              <p>
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
