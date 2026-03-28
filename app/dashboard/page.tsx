'use client';

import { useState, useEffect } from 'react';
import { useMicrosite } from '@/hooks/useMicrosite';
import { MicrositeViewer } from '@/components/MicrositeViewer';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Palette, 
  LayoutTemplate, 
  Plus, 
  Trash2, 
  Save, 
  ExternalLink,
  Loader2,
  Globe,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  QrCode,
  Download,
  Share2,
  X,
  LogOut,
  BarChart3,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';
import { motion } from 'framer-motion';

function StatCard({ label, value, icon: Icon, color, loading }: any) {
  return (
    <div className="bg-[#111113] p-5 rounded-[28px] border border-[#27272a]/40 flex flex-col gap-3 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 pointer-events-none" style={{ backgroundColor: color }} />
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl transition-all" style={{ backgroundColor: `${color}15`, color: color }}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        {loading ? (
          <div className="h-8 w-16 bg-white/5 animate-pulse rounded-lg" />
        ) : (
          <>
            <span className="text-3xl font-black text-white">{value}</span>
            <span className="text-[10px] text-zinc-600 font-bold">+0% hoy</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardEditor() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const { microsite, loading, saving, saveMicrosite, error: dbError } = useMicrosite(user?.id || null);
  const { stats, loading: analyticsLoading } = useAnalytics(user?.id || null);
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeTab, setActiveTab] = useState('diseño'); // diseño | contenido | qr | analíticas
  // Proteger la ruta
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const [siteData, setSiteData] = useState({
    name: "StandMX Site",
    type: "vCard",
    slug: "mi-negocio",
    colors: {
      primary: "#10b981",
      secondary: "#047857",
      background: "#09090b",
      card: "#18181b"
    },
    content: {
      displayName: "Nuevo Micrositio",
      title: "Profesional / Empresa",
      bio: "Edita tu información aquí.",
      links: [],
      items: [],
      whatsapp: "",
      phone: "",
      email: ""
    }
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (microsite) {
      setSiteData({
        name: microsite.slug || "StandMX Site",
        type: microsite.type === 'menu' ? 'Menu' : 'vCard',
        slug: microsite.slug,
        colors: (microsite.content as any)?.theme?.colors || {
          primary: "#10b981",
          secondary: "#047857",
          background: "#09090b",
          card: "#18181b"
        },
        content: {
          ...(microsite.content as any),
          links: (microsite.content as any).links || [],
          items: (microsite.content as any).items || []
        }
      });
    }
  }, [microsite]);

  const handleSave = async () => {
    try {
      await saveMicrosite({
        slug: siteData.slug,
        type: siteData.type.toLowerCase() as any,
        published: true,
        content: {
          ...siteData.content,
          theme: { colors: siteData.colors }
        }
      });
      setLastSaved(new Date());
    } catch (e) {}
  };

  const updateColors = (key: string, value: string) => {
    setSiteData(prev => ({ ...prev, colors: { ...prev.colors, [key]: value } }));
  };

  const updateContent = (key: string, value: any) => {
    setSiteData(prev => ({ ...prev, content: { ...prev.content, [key]: value } }));
  };

  const downloadQR = () => {
    const svg = document.querySelector('#preview-qr svg') as SVGSVGElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      ctx?.drawImage(img, 0, 0, 1024, 1024);
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qr-${siteData.slug}.png`;
      link.href = url;
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (loading) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-4">
      <Loader2 className="w-8 h-8 text-[#00c9b1] animate-spin" />
      <p className="text-zinc-500 text-sm animate-pulse">Sincronizando con Supabase...</p>
    </div>
  );

  return (
    <div className="flex h-full w-full bg-[#09090b]">
      
      {/* ── SIDEBAR NAV (Mini) ────────────────────────────────── */}
      <div className="w-20 border-r border-[#27272a]/60 flex flex-col items-center py-6 gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <NavIcon icon={LayoutTemplate} active={activeTab === 'diseño'} onClick={() => setActiveTab('diseño')} />
          <NavIcon icon={Plus} active={activeTab === 'contenido'} onClick={() => setActiveTab('contenido')} />
          <NavIcon icon={QrCode} active={activeTab === 'qr'} onClick={() => setActiveTab('qr')} />
          <NavIcon icon={BarChart3} active={activeTab === 'analíticas'} onClick={() => setActiveTab('analíticas')} />
        </div>
        
        <button 
          onClick={() => signOut().then(() => router.push('/login'))}
          className="p-4 rounded-2xl text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition-all mb-4"
          title="Cerrar Sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* ── PANEL EDITOR (IZQUIERDA) ────────────────────────────── */}
      <div className="w-[450px] border-r border-[#27272a]/60 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                {activeTab === 'diseño' && <><Palette className="w-5 h-5 text-[#00c9b1]" /> Diseño de Marca</>}
                {activeTab === 'contenido' && <><Plus className="w-5 h-5 text-amber-500" /> Contenido Ficha</>}
              {activeTab === 'analíticas' && <><BarChart3 className="w-5 h-5 text-indigo-400" /> Analíticas Live</>}
            </h1>
            {lastSaved && activeTab !== 'analíticas' && <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1"><CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Cambios guardados</span>}
          </div>
          
          {activeTab !== 'analíticas' && (
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#00c9b1] text-black text-xs font-black rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? 'Guardando...' : 'Publicar'}
            </button>
          )}
        </div>

        {activeTab === 'analíticas' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-left-2 overflow-y-auto px-6 pb-6">
              <div className="grid grid-cols-2 gap-4">
                 <StatCard 
                    label="Escaneos Totales" 
                    value={stats?.totalScans || 0} 
                    icon={TrendingUp} 
                    color="#6366f1" 
                    loading={analyticsLoading} 
                 />
                 <StatCard 
                    label="Micrositios" 
                    value={stats?.byMicrosite?.length || 0} 
                    icon={Globe} 
                    color="#10b981" 
                    loading={analyticsLoading} 
                 />
              </div>

              <Section title="Rendimiento por Sitio" icon={TrendingUp}>
                 <div className="space-y-4">
                    {stats?.byMicrosite?.map((site: any, idx: number) => (
                       <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-400">
                             <span>{site.name}</span>
                             <span>{site.scans} escaneos</span>
                          </div>
                          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(site.scans / (stats.totalScans || 1)) * 100}%` }}
                                className="h-full bg-indigo-500"
                             />
                          </div>
                       </div>
                    ))}
                    {!stats?.byMicrosite?.length && <p className="text-[10px] text-zinc-600 italic">No hay datos suficientes aún.</p>}
                 </div>
              </Section>

              <Section title="Geografía (Escaneos)" icon={MapPin}>
                 <div className="space-y-3">
                    {Object.entries(stats?.byCountry || {}).map(([country, count]: any, idx: number) => (
                       <div key={idx} className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5">
                          <span className="text-[11px] font-bold text-white uppercase">{country}</span>
                          <span className="text-[11px] font-mono text-indigo-400 font-black">{count}</span>
                       </div>
                    ))}
                    {Object.keys(stats?.byCountry || {}).length === 0 && <p className="text-[10px] text-zinc-600 italic">Esperando primeros datos...</p>}
                 </div>
              </Section>

              <Section title="Actividad Reciente" icon={Clock}>
                 <div className="space-y-4">
                    {stats?.raw?.slice(0, 5).map((scan: any, idx: number) => (
                       <div key={idx} className="flex items-center gap-3 p-2 group hover:bg-white/5 rounded-xl transition-all">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                             <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                             <span className="text-[10px] font-bold text-white truncate">{scan.user_agent?.split(' ')[0] || 'Browser Unknown'}</span>
                             <span className="text-[8px] text-zinc-500 uppercase tracking-tighter">{new Date(scan.scanned_at).toLocaleString()}</span>
                          </div>
                          <div className="text-[10px] font-mono font-black text-indigo-400">
                             {scan.ip_country}
                          </div>
                       </div>
                    ))}
                    {!stats?.raw?.length && <p className="text-[10px] text-zinc-600 italic">Aún no hay visitas registradas.</p>}
                 </div>
              </Section>
           </div>
        )}

          {activeTab === 'diseño' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-2 transition-all">
              <Section title="Identidad" icon={Globe}>
                <InputField label="Nombre de Marca" value={siteData.content.displayName} onChange={(v) => updateContent('displayName', v)} />
                <SlugField value={siteData.slug} onChange={(v) => setSiteData(prev => ({ ...prev, slug: v }))} />
                <SelectField label="Tipo de Sitio" value={siteData.type} options={['vCard', 'Menu']} onChange={(v) => setSiteData(prev => ({ ...prev, type: v }))} />
              </Section>
              
              <Section title="Branding" icon={Palette}>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput label="Primario" value={siteData.colors.primary} onChange={(v) => updateColors('primary', v)} />
                  <ColorInput label="Secundario" value={siteData.colors.secondary} onChange={(v) => updateColors('secondary', v)} />
                  <ColorInput label="Fondo" value={siteData.colors.background} onChange={(v) => updateColors('background', v)} />
                  <ColorInput label="Tarjeta" value={siteData.colors.card} onChange={(v) => updateColors('card', v)} />
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'contenido' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-2">
              <Section title="Info Base" icon={Plus}>
                <InputField label="TÍTULO / PROFESIÓN" value={siteData.content.title} onChange={(v) => updateContent('title', v)} />
                <InputField label="BIO / DESCRIPCIÓN" value={siteData.content.bio} onChange={(v) => updateContent('bio', v)} isArea />
              </Section>

              <Section title="Contacto" icon={Smartphone}>
                <InputField label="WhatsApp" value={siteData.content.whatsapp} onChange={(v) => updateContent('whatsapp', v)} />
                <InputField label="Teléfono" value={siteData.content.phone} onChange={(v) => updateContent('phone', v)} />
                <InputField label="Email" value={siteData.content.email} onChange={(v) => updateContent('email', v)} />
              </Section>

              {siteData.type === 'Menu' && (
                <Section title="Platillos/Precios" icon={Plus}>
                  {siteData.content.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center bg-black/40 p-3 rounded-xl border border-[#27272a]">
                      <input className="bg-transparent text-[13px] w-full focus:outline-none" value={item.name} onChange={(e) => {
                        const newI = [...siteData.content.items]; newI[idx].name = e.target.value; updateContent('items', newI);
                      }} />
                      <input className="bg-transparent text-[13px] w-16 text-right font-mono text-[#00c9b1] font-bold outline-none" type="number" value={item.price} onChange={(e) => {
                        const newI = [...siteData.content.items]; newI[idx].price = Number(e.target.value); updateContent('items', newI);
                      }} />
                      <button onClick={() => updateContent('items', siteData.content.items.filter((_: any, i: number) => i !== idx))}><Trash2 className="w-4 h-4 text-zinc-600 hover:text-red-500" /></button>
                    </div>
                  ))}
                  <button onClick={() => updateContent('items', [...(siteData.content.items || []), { name: 'Nuevo Item', price: 0 }])} className="w-full py-3 border border-dashed border-[#27272a] rounded-xl text-[10px] font-black uppercase text-[#00c9b1] hover:bg-[#00c9b1]/5 flex justify-center gap-2 items-center"><Plus className="w-3 h-3" /> Agregar Item</button>
                </Section>
              )}
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-2">
               <Section title="QR Inteligente" icon={QrCode}>
                  <div className="bg-[#111113] p-8 rounded-[32px] border border-[#27272a]/40 flex flex-col items-center gap-6 text-center">
                    <div id="preview-qr" className="p-4 bg-white rounded-3xl shadow-2xl ring-4 ring-emerald-500/20">
                      <QRCodeSVG 
                        value={`https://standmx.com/qr/${microsite?.id || 'demo'}`} 
                        size={180}
                        level="H"
                        includeMargin={false}
                        fgColor="#000000"
                        imageSettings={{
                           src: "/logo-mini.png",
                           x: undefined,
                           y: undefined,
                           height: 34,
                           width: 34,
                           excavate: true,
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Este QR es Permanente</h4>
                      <p className="text-[11px] text-zinc-500 px-4">Incluso si cambias de URL o subdominio, el código impreso seguirá funcionando gracias a nuestro Smart Redirect.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 w-full">
                       <button onClick={downloadQR} className="flex items-center justify-center gap-2 bg-zinc-800 p-4 rounded-2xl text-[10px] font-bold hover:bg-zinc-700 transition-colors">
                          <Download className="w-4 h-4" /> PNG
                       </button>
                       <button className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                          <Share2 className="w-4 h-4" /> Compartir
                       </button>
                    </div>
                  </div>
               </Section>
            </div>
          )}
        </div>
      </div>

      {/* ── PANEL PREVIEW (DERECHA) ────────────────────────────── */}
      <div className="flex-1 bg-[#0d0d0f] flex flex-col items-center justify-center relative p-6">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-full h-11 px-5 flex items-center justify-between shadow-2xl ring-1 ring-white/5">
            <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-2 truncate">
              <span className="text-[#00c9b1]">https://</span>
              <span className="text-zinc-200 font-bold">{siteData.slug || 'slug'}</span>
              <span className="tracking-tighter">.standmx.com</span>
            </span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </div>
        </div>

        <div className="relative w-[340px] h-[680px] bg-black rounded-[54px] border-8 border-[#27272a] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden scale-[0.9] origin-center">
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[100px] h-6 bg-black rounded-full z-50 flex items-center justify-center border border-white/5" />
          <div className="w-full h-full overflow-y-auto scrollbar-hide">
            <MicrositeViewer siteData={{ ...siteData }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Components auxiliares UI
function NavIcon({ icon: Icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl transition-all ${active ? 'bg-[#00c9b1] text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
      <Icon className="w-5 h-5" />
    </button>
  );
}

function Section({ title, icon: Icon, children }: any) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">
        <Icon className="w-4 h-4" /> {title}
      </div>
      <div className="grid gap-5 bg-[#111113] p-6 rounded-[28px] border border-[#27272a]/40 shadow-sm relative">
        {children}
      </div>
    </section>
  );
}

function InputField({ label, value, onChange, isArea }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] text-zinc-500 font-bold uppercase">{label}</label>
      {isArea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-4 py-3 text-sm focus:border-[#00c9b1] outline-none min-h-[80px] resize-none" />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-4 py-3 text-sm focus:border-[#00c9b1] outline-none" />
      )}
    </div>
  );
}

function SlugField({ value, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] text-zinc-500 font-bold uppercase">Slug Subdominio</label>
      <div className="flex items-stretch">
        <div className="bg-[#1c1c1f] border border-[#27272a] border-r-0 rounded-l-xl flex items-center px-3 text-[10px] font-mono text-zinc-500">https://</div>
        <input type="text" value={value} onChange={e => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="w-full bg-black/40 border border-[#27272a] px-4 py-3 text-sm outline-none font-mono" />
        <div className="bg-[#1c1c1f] border border-[#27272a] border-l-0 rounded-r-xl flex items-center px-3 text-[10px] font-mono text-zinc-500">.standmx.com</div>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] text-zinc-500 font-bold uppercase">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-4 py-3 text-sm outline-none appearance-none cursor-pointer">
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[10px] text-zinc-500 font-bold uppercase">{label}</label>
      <div className="flex items-center gap-3 bg-black/40 border border-[#27272a] rounded-xl p-2 group-hover:bg-black/60 transition-colors cursor-pointer">
        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 w-[200%] h-[200%] cursor-pointer -translate-x-1/4 -translate-y-1/4" />
        </div>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value.toUpperCase())} className="bg-transparent text-[11px] font-mono text-zinc-300 w-full outline-none" />
      </div>
    </div>
  );
}
