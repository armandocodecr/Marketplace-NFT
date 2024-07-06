import { Navigation } from "./routes";

export function App () {
  return (
    <main className="absolute top-0 bottom-0 z-[-2] min-h-screen w-full bg-gray-50 dark:bg-[#121212]
    bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,216,255,0.5),rgba(255,255,255,0.9))]
    dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Navigation /> 
    </main>
  );
};

export default App;
