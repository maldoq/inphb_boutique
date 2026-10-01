import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        color: "#fff",
        background: "linear-gradient(135deg, #081a33 0%, #123960 65%, #ed7432 140%)",
        fontFamily: "Arial",
      }}
    >
      <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#fbbf87" }}>
        INP-HB · APPEL À COLLABORATION
      </div>
      <div
        style={{ display: "flex", maxWidth: 950, fontSize: 74, fontWeight: 700, lineHeight: 1.08 }}
      >
        Donnez une image à la boutique officielle.
      </div>
      <div style={{ display: "flex", fontSize: 27, color: "#cbd5e1" }}>
        Rejoignez l’équipe créative de l’INP-HB.
      </div>
    </div>,
    size,
  );
}
