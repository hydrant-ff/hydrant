"use client";

import { useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function ScannerTest() {
  const [barcode, setBarcode] =
    useState("");

  const [scannerOpen, setScannerOpen] =
    useState(false);

  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  async function startScanner() {
    try {
      // alten Scanner komplett stoppen
      if (scannerRef.current) {
        scannerRef.current.reset();
        scannerRef.current = null;
      }

      // alten Videostream stoppen
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

      setBarcode("");
      setScannerOpen(true);

      // kleiner Delay für iPhone/Safari
      setTimeout(async () => {
        const codeReader =
          new BrowserMultiFormatReader();

        scannerRef.current =
          codeReader;

        try {
          const devices =
            await BrowserMultiFormatReader.listVideoInputDevices();

          // Rückkamera bevorzugen
          const camera =
            devices.find(
              (device) =>
                device.label
                  .toLowerCase()
                  .includes("back") ||
                device.label
                  .toLowerCase()
                  .includes("rear")
            ) ||
            devices[
              devices.length - 1
            ];

          codeReader.decodeFromVideoDevice(
            camera?.deviceId,
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

          setScannerOpen(
            false
          );
        }
      }, 300);
    } catch (err) {
      console.error(err);
    }
  }

  function stopScanner() {
    try {
      // Scanner komplett resetten
      if (scannerRef.current) {
        scannerRef.current.reset();
        scannerRef.current = null;
      }

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

    // Kamera schließen
    setScannerOpen(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "#111827",
        color: "white",
        padding: "20px",
        fontFamily:
          "Arial",
      }}
    >
      <h1
        style={{
          color:
            "#ef4444",
          fontSize: "42px",
        }}
      >
        🚒 Scanner Test
      </h1>

      {!scannerOpen && (
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
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width:
                "100%",
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

      {barcode && (
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

          <button
            onClick={() => {
              setBarcode("");
              startScanner();
            }}
            style={{
              marginTop:
                "20px",
              background:
                "#dc2626",
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
            Neuer Test
          </button>
        </div>
      )}
    </main>
  );
}
