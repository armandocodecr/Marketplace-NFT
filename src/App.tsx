import { Navigation } from "./routes";

export function App () {
  return (
    <main className="absolute px-32 top-0 bottom-0 z-[-2] min-h-screen w-full overflow-y-auto bg-gray-50 dark:bg-[#121212]">
      <Navigation /> 
    </main>
  );
};

export default App;
