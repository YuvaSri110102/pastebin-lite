import { fetchPasteAtomic } from "@/lib/pasteService";
import { notFound } from "next/navigation";

export default async function PastePage(
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  let result;
  try {
    // HTML route does not need test headers
    result = await fetchPasteAtomic(
      new Request("http://internal"),
      id
    );
  } catch {
    notFound();
  }

  if (!result) {
    notFound();
  }

  const data = result as {
    content: string;
  };
  const content = data.content;

  return (
    <main>
      <pre>{content}</pre>
    </main>
  );
}
