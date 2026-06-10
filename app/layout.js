export const metadata = {
  title: "Hydrant",
  description: "FW Getränkekasse",
};

export default function RootLayout(props) {
  return (
    <html lang="de">
      <body>{props.children}</body>
    </html>
  );
}
