import { createClient } from "@/lib/supabase/server";
import { listLearnItems } from "@/lib/data/learn-items";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { LearnItemForm } from "./learn-item-form";
import { LearnItemRow } from "./learn-item-row";

export default async function LearnPage() {
  const supabase = await createClient();
  const items = await listLearnItems(supabase);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Learn</h1>

      <Section title="Add an item">
        <LearnItemForm />
      </Section>

      <Section title="Everything">
        {items.length === 0 ? (
          <EmptyState>Nothing on the list yet.</EmptyState>
        ) : (
          <ul className="space-y-1.5">
            {items.map((item) => (
              <LearnItemRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
