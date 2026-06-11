"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function ScannerTest() {
  const [scannerOpen, setScannerOpen] =
    useState(false);

  const [barcode, setBarcode] =
    useState("");

  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const scanningRef = useRef(false);

  useEffect(() => {
    scannerRef.current =
      new BrowserMultiFormatReader();

    return () => {
      stopScanner();
    };
  }, []);

  async function startScanner() {
    if (scanningRef.current) return;

    try {
      scanningRef.current = true;

      setScannerOpen(true);
      setBarcode("");

      const constraints = {
        video: {
          facingMode: {
            ideal: "environment",
          },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      await scannerRef.current.decodeFromConstraints(
        constraints,
        videoRef.current,
        (result) => {
          if (
            result?.getText()
          ) {
            const code =
              result
                .getText()
                .trim();

            console.log(
              "Barcode:",
              code
            );

            setBarcode(code);

            stopScanner();
          }
        }
      );
    } catch (err) {
      console.error(err);

      alert(
        "Kamera konnte nicht geöffnet werden."
      );

      stopScanner();
    }
  }

  function stopScanner() {
    try {
      scannerRef.current?.reset();

      const video =
        videoRef.current;

      if (video?.srcObject) {
        const tracks =
          video.srcObject.getTracks();

        tracks.forEach((track) =>
          track.stop()
        );

        video.srcObject = null;
      }
    } catch (err) {
      console.error(err);
    }

    scanningRef.current = false;
    setScannerOpen(false);
  }

  async function continueScan() {
    stopScanner();

    // Android braucht etwas Zeit
    setTimeout(() => {
      startScanner();
    }, 1200);
  }

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
      <h1
        style={{
          color: "#ef4444",
          fontSize: "42px",
        }}
      >
        🚒 Scanner Test
      </h1>

      {!scannerOpen &&
        !barcode && (
          <button
            onClick={
              startScanner
            }
            style={{
              marginTop: "30px",
              background: "#dc2626",
              color: "white",
              border: "none",
              padding:
                "20px 40px",
              borderRadius:
                "20px",
              fontSize:
                "24px",
            }}
          >
            📷 Kamera starten
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
            autoPlay
            playsInline
            muted
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

      {!scannerOpen &&
        barcode && (
          <div
            style={{
              marginTop: "40px",
              background:
                "#1f2937",
              padding: "24px",
              borderRadius:
                "20px",
            }}
          >
            <h2>
              ✅ Barcode erkannt
            </h2>

            <p
              style={{
                fontSize:
                  "28px",
              }}
            >
              {barcode}
            </p>

            <button
              onClick={
                continueScan
              }
              style={{
                marginTop:
                  "20px",
                marginRight:
                  "10px",
              }}
            >
              Weiter scannen
            </button>

            <button>
              Buchen
            </button>
          </div>
        )}
    </main>
  );
}
