import { redirect, notFound } from 'next/navigation';

export default async function PathPersonaRedirectPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const p = persona.toLowerCase();

  if (p === 'you' || p === 'creator' || p === 'individual') {
    redirect('/you');
  } else if (p === 'filmmaker' || p === 'learn') {
    redirect('/filmmaker');
  } else if (p === 'studios' || p === 'brand' || p === 'media' || p === 'partner') {
    redirect('/studios');
  }

  redirect('/');
}
