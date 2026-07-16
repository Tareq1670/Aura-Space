import type { Metadata } from "next";
import { getApiBase } from "@/lib/api-base";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${getApiBase()}/properties/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      const property = data?.data?.property ?? data;
      const title = property?.title;
      if (title) {
        return {
          title,
          description: property?.description
            ? `${property.description.slice(0, 155)}...`
            : `Book ${title} on AuraSpace — premium event space available for your next occasion.`,
        };
      }
    }
  } catch {}

  return {
    title: "Property Details",
    description: "View detailed information about this premium event space on AuraSpace.",
  };
}

export default function PropertyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
