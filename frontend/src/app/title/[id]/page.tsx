// Path: cineverse/frontend/src/app/title/[id]/page.tsx
import TitleDetailsClient from "@/components/TitleDetailsClient";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function TitlePage({ params }: PageProps) {
  const resolvedParams = await params;
  return <TitleDetailsClient id={resolvedParams.id} />;
}