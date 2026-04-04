// Shared inline styles for the journal drawer panels used in AddPlantBoxForm
// and AddPlantForm. Centralised here so a visual tweak only needs one edit.

export const panelStyle: React.CSSProperties = {
  background: `
    radial-gradient(ellipse at 20% 10%, rgba(210,190,150,0.12) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 80%, rgba(180,160,120,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 45%, rgba(230,215,185,0.07) 0%, transparent 60%),
    linear-gradient(162deg, #FEFAF0 0%, #F7F0E0 30%, #F1E9D5 65%, #EBE1C8 100%)
  `,
};

export const deckleStyle: React.CSSProperties = {
  width: "18px",
  flexShrink: 0,
  background: `
    radial-gradient(circle at 0% 4%, #E8D9B3 4px, transparent 4px),
    radial-gradient(circle at 0% 10%, #DED0A4 3.5px, transparent 3.5px),
    radial-gradient(circle at 0% 16%, #E8D9B3 4.5px, transparent 4.5px),
    radial-gradient(circle at 0% 22%, #DED0A4 3px, transparent 3px),
    radial-gradient(circle at 0% 28%, #E8D9B3 4px, transparent 4px),
    radial-gradient(circle at 0% 34%, #DED0A4 3.5px, transparent 3.5px),
    radial-gradient(circle at 0% 40%, #E8D9B3 4.5px, transparent 4.5px),
    radial-gradient(circle at 0% 46%, #DED0A4 3px, transparent 3px),
    radial-gradient(circle at 0% 52%, #E8D9B3 4px, transparent 4px),
    radial-gradient(circle at 0% 58%, #DED0A4 3.5px, transparent 3.5px),
    radial-gradient(circle at 0% 64%, #E8D9B3 4.5px, transparent 4.5px),
    radial-gradient(circle at 0% 70%, #DED0A4 3px, transparent 3px),
    radial-gradient(circle at 0% 76%, #E8D9B3 4px, transparent 4px),
    radial-gradient(circle at 0% 82%, #DED0A4 3.5px, transparent 3.5px),
    radial-gradient(circle at 0% 88%, #E8D9B3 4.5px, transparent 4.5px),
    radial-gradient(circle at 0% 94%, #DED0A4 3px, transparent 3px),
    linear-gradient(to right, #C9B98A, #DED0A4)
  `,
};

export const leatherTabStyle: React.CSSProperties = {
  background: `
    linear-gradient(135deg,
      #5C3D1E 0%,
      #7A5230 25%,
      #6B4422 50%,
      #8B6340 65%,
      #5C3D1E 100%
    )
  `,
  boxShadow:
    "-3px 0 8px rgba(60,30,10,0.35), inset 1px 0 2px rgba(255,220,160,0.15)",
  borderRadius: "0 0 0 8px",
  writingMode: "vertical-rl" as const,
  textOrientation: "mixed" as const,
};

export const ruledLineStyle: React.CSSProperties = {
  backgroundImage: `
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 31px,
      rgba(160, 130, 80, 0.18) 31px,
      rgba(160, 130, 80, 0.18) 32px
    )
  `,
  lineHeight: "32px",
};

export const inputStyle: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: "15px",
  color: "#2C1A08",
  fontStyle: "italic",
  borderBottom: "1.5px solid rgba(160,120,60,0.35)",
  paddingBottom: "4px",
  lineHeight: "32px",
};
