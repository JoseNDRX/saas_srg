import { notFound } from 'next/navigation';
import { MicrositeViewer } from '@/components/MicrositeViewer';
import { getSupabase } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getSupabase();

  const { data: siteData } = await supabase
    .from('microsites')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!siteData) return { title: 'No Encontrado | StandMX' };

  const content = siteData.content as any;

  return {
    title: `${content.displayName || siteData.slug} | ${siteData.type.toUpperCase()}`,
    description: content.bio || `Visita el micrositio digital de ${content.displayName}`,
    openGraph: {
      title: content.displayName,
      description: content.bio,
      url: `https://${slug}.standmx.com`,
      siteName: 'StandMX',
      images: [
        {
          url: content.projects?.[0]?.imageUrl || 'https://standmx.com/default-og.png',
          width: 1200,
          height: 630,
          alt: `Imagen de ${content.displayName}`,
        },
      ],
      locale: 'es_MX',
      type: 'website',
    },
  };
}

export default async function DomainPage({ 
  params 
 }: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const supabase = getSupabase();

  const { data: microsite, error } = await supabase
    .from('microsites')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!microsite || error) {
    return notFound();
  }

  const content = microsite.content as any;
  const viewerData = {
    name: content.displayName || microsite.slug,
    type: microsite.type,
    content: content,
    colors: content.theme?.colors || {
        primary: "#10b981",
        secondary: "#047857",
        background: "#09090b",
        card: "#18181b"
    }
  };

  return (
    <div className="w-full min-h-dvh flex items-center justify-center bg-black overflow-hidden relative">
      <div className="absolute inset-0 bg-[#00c9b1]/5 blur-[120px] pointer-events-none" />
      <MicrositeViewer siteData={viewerData} />
    </div>
  );
}
