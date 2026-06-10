export const metadata = {
  title: "Hydrant",
  description: "FW Getränkekasse",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
