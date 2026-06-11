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
  const streamRef = useRef(null);

  useEffect(() => {
    scannerRef.current =
      new BrowserMultiFormatReader();

    return () => {
      stopScanner();
    };
  }, []);

  async function startScanner() {
    try {
      // Falls noch etwas offen ist
      stopScanner(true);

      setBarcode("");
      setScannerOpen(true);

      // Rückkamera ohne Zoom
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: {
                ideal:
                  "environment",
              },
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
            },
          }
        );

      streamRef.current =
        stream;

      const video =
        videoRef.current;

      if (!video) return;

      video.srcObject =
        stream;

      await video.play();

      scannerRef.current.decodeFromVideoElement(
        video,
        (result) => {
          if (
            result?.getText()
          ) {
            const code =
              result
                .getText()
                .trim();

            console.log(
              "Barcode erkannt:",
              code
            );

            setBarcode(
              code
            );

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

  function stopScanner(
    silent = false
  ) {
    try {
      scannerRef.current?.reset();

      if (
        streamRef.current
      ) {
        streamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

        streamRef.current =
          null;
      }

      const video =
        videoRef.current;

      if (video) {
        video.pause();
        video.srcObject =
          null;
      }
    } catch (err) {
      console.error(err);
    }

    setScannerOpen(false);
  }

  async function continueScan() {
    stopScanner();

    // kurze Pause für Samsung
    await new Promise((r) =>
      setTimeout(r, 500)
    );

    startScanner();
  }

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "#111827",
        color: "white",
        padding:
          "20px",
        fontFamily:
          "Arial",
      }}
    >
      <h1
        style={{
          color:
            "#ef4444",
          fontSize:
            "42px",
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
              marginTop:
                "30px",
              background:
                "#dc2626",
              color:
                "white",
              border:
                "none",
              padding:
                "20px 40px",
              borderRadius:
                "20px",
              fontSize:
                "24px",
              cursor:
                "pointer",
            }}
          >
            📷 Kamera starten
          </button>
        )}

      {scannerOpen && (
        <div
          style={{
            marginTop:
              "30px",
          }}
        >
          <video
            ref={
              videoRef
            }
            autoPlay
            playsInline
            muted
            style={{
              width:
                "100%",
              borderRadius:
                "20px",
              objectFit:
                "cover",
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
              color:
                "white",
              border:
                "none",
              padding:
                "14px 22px",
              borderRadius:
                "12px",
              cursor:
                "pointer",
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
              marginTop:
                "40px",
              background:
                "#1f2937",
              padding:
                "24px",
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
                color:
                  "#4ade80",
              }}
            >
              {barcode}
            </p>

            <div
              style={{
                display:
                  "flex",
                gap: "12px",
                marginTop:
                  "20px",
              }}
            >
              <button
                onClick={
                  continueScan
                }
                style={{
                  flex: 1,
                  background:
                    "#374151",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "16px",
                  borderRadius:
                    "14px",
                  fontSize:
                    "18px",
                }}
              >
                Weiter scannen
              </button>

              <button
                style={{
                  flex: 1,
                  background:
                    "#dc2626",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "16px",
                  borderRadius:
                    "14px",
                  fontSize:
                    "18px",
                }}
              >
                Buchen
              </button>
            </div>
          </div>
        )}
    </main>
  );
}
