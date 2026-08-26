import AdministrationHeader from "./components/AdministrationHeader";
import AdministrationSearch from "./components/AdministrationSearch";
import AdministrationGrid from "./components/AdministrationGrid";

export default function AdministrationPage() {
  return (
    <main className="flex flex-col gap-8 p-8">
      <AdministrationHeader />

      <AdministrationSearch />

      <AdministrationGrid />
    </main>
  );
}