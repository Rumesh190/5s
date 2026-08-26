import AdminCard from "./AdminCard";
import { adminModules } from "../data/admin";

export default function AdministrationGrid() {
  return (
    <section className="pb-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {adminModules.map((module) => (
          <AdminCard
            key={module.id}
            module={module}
          />
        ))}
      </div>
    </section>
  );
}