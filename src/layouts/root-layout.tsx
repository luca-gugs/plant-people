import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <footer className="fixed bottom-0 left-0 right-0 pb-4 text-center pointer-events-none">
        <p className="text-[9px] italic text-ink-faint tracking-wide">
          made for madison with love by yrstrly
        </p>
      </footer>
    </>
  );
}
