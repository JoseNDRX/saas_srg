'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutTemplate, 
  Plus, 
  X,
  QrCode, 
  BarChart3, 
  Palette, 
  Globe, 
  Smartphone, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Trash2, 
  Download, 
  Share2, 
  ExternalLink,
  LogOut,
  TrendingUp,
  MapPin,
  Clock,
  Upload,
  Layout as LayoutIcon,
  ChevronLeft,
  Eye,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { MicrositeViewer } from '@/components/MicrositeViewer';

/**
 * Dashboard Constructor (Next.js 16 + Supabase)
 */
export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'diseño' | 'contenido' | 'qr' | 'analíticas'>('diseño');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(false);
  const [microsite, setMicrosite] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  // Default site structure
  const [siteData, setSiteData] = useState({
    slug: '',
    type: 'vCard',
    colors: {
      primary: '#00c9b1',
      secondary: '#a78bfa',
      background: '#09090b',
      card: '#18181b',
    },
    content: {
      displayName: '',
      title: '',
      bio: '',
      whatsapp: '',
      phone: '',
      email: '',
      items: [], // For Menu
      projects: [], // For Showcase
      socials: [],
    }
  });

  // Auth Protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load User Microsite
  useEffect(() => {
    if (!user) return;

    async function loadData() {
      const { data, error } = await supabase
        .from('microsites')
        .select('*')
        .eq('owner_id', user?.id)
        .maybeSingle();

      if (data) {
        setMicrosite(data);
        setSiteData({
          slug: data.slug || '',
          type: data.type || 'vCard',
          colors: data.config?.colors || siteData.colors,
          content: { ...siteData.content, ...data.content }
        });
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  // Load Analytics
  useEffect(() => {
    if (activeTab === 'analíticas' && microsite?.id) {
       fetchAnalytics();
    }
  }, [activeTab, microsite]);

  async function fetchAnalytics() {
     setAnalyticsLoading(true);
     const { data, error } = await supabase
        .from('qr_analytics')
        .select('*')
        .eq('microsite_id', microsite.id)
        .order('scanned_at', { ascending: false });

     if (data) {
        const byCountry: any = {};
        data.forEach(s => {
           const c = s.ip_country || 'Unknown';
           byCountry[c] = (byCountry[c] || 0) + 1;
        });

        // Simple aggregation for UI
        setStats({
           totalScans: data.length,
           byCountry,
           raw: data,
           byMicrosite: [{ name: siteData.slug || 'Mi Sitio', scans: data.length }]
        });
     }
     setAnalyticsLoading(false);
  }

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setLastSaved(false);

    const payload = {
      owner_id: user.id,
      slug: siteData.slug,
      type: siteData.type,
      config: { colors: siteData.colors },
      content: siteData.content,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (microsite) {
      result = await supabase.from('microsites').update(payload).eq('id', microsite.id);
    } else {
      result = await supabase.from('microsites').insert([payload]).select().single();
      if (result.data) setMicrosite(result.data);
    }

    setSaving(false);
    if (!result.error) {
      setLastSaved(true);
      setTimeout(() => setLastSaved(false), 3000);
    } else {
      alert(result.error.message);
    }
  };

  const updateContent = (key: string, value: any) => {
    setSiteData(prev => ({
      ...prev,
      content: { ...prev.content, [key]: value }
    }));
  };

  const updateColors = (key: string, value: any) => {
    setSiteData(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  };

  const handleFileUpload = async (file: File, idx: number) => {
    try {
      setUploadingIdx(idx);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('microsite-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('microsite-images')
        .getPublicUrl(filePath);

      const newP = [...(siteData.content.projects as any[])];
      newP[idx].imageUrl = publicUrl;
      updateContent('projects', newP);
    } catch (error: any) {
      console.error('Error:', error);
      alert('Error subiendo imagen. Verifica que el bucket "microsite-images" exista en Supabase con acceso público.');
    } finally {
      setUploadingIdx(null);
    }
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

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!loading && !authLoading) {
      setIsInitialLoad(false);
    }
  }, [loading, authLoading]);

  if (authLoading || (isInitialLoad && loading)) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-background gap-6 transition-colors duration-500 min-h-screen">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-t-2 border-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center uppercase text-[10px] font-black text-primary animate-pulse">
          SMX
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-foreground font-bold tracking-tight">Sincronizando con Supabase</p>
        <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest px-4 py-1 bg-muted rounded-full">Recuperando tu identidad digital...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#09090b] overflow-hidden">
      
      {/* ── SIDEBAR NAV (Mini) ────────────────────────────────── */}
      <div className="w-full md:w-20 order-2 md:order-1 border-t md:border-t-0 md:border-r border-[#27272a]/60 flex flex-row md:flex-col items-center py-4 md:py-6 gap-6 px-6 md:px-0 bg-[#111113] md:bg-transparent z-50">
        <div className="flex-1 flex flex-row md:flex-col gap-4 md:gap-6 w-full justify-around md:justify-start">
          <NavIcon icon={LayoutTemplate} active={activeTab === 'diseño'} onClick={() => {setActiveTab('diseño'); setShowMobilePreview(false);}} />
          <NavIcon icon={Plus} active={activeTab === 'contenido'} onClick={() => {setActiveTab('contenido'); setShowMobilePreview(false);}} />
          <NavIcon icon={QrCode} active={activeTab === 'qr'} onClick={() => {setActiveTab('qr'); setShowMobilePreview(false);}} />
          <NavIcon icon={BarChart3} active={activeTab === 'analíticas'} onClick={() => {setActiveTab('analíticas'); setShowMobilePreview(false);}} />
          <button 
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className={`md:hidden p-4 rounded-2xl transition-all ${showMobilePreview ? 'bg-indigo-500 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
        
        <button 
          onClick={() => signOut().then(() => router.push('/login'))}
          className="p-4 rounded-2xl text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition-all md:mb-4 shrink-0"
          title="Cerrar Sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* ── PANEL EDITOR (IZQUIERDA) ────────────────────────────── */}
      <div className={`flex-1 md:w-[450px] md:flex-none border-r border-[#27272a]/60 flex flex-col order-1 md:order-2 bg-[#09090b] ${showMobilePreview ? 'hidden md:flex' : 'flex'}`}>
        <div className="h-16 border-b border-[#27272a]/60 px-6 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wider">
               {activeTab === 'diseño' && <><Palette className="w-4 h-4 text-[#00c9b1]" /> Diseño</>}
               {activeTab === 'contenido' && <><Plus className="w-4 h-4 text-amber-500" /> Contenido</>}
               {activeTab === 'qr' && <><QrCode className="w-4 h-4 text-emerald-400" /> Mi QR</>}
               {activeTab === 'analíticas' && <><BarChart3 className="w-4 h-4 text-indigo-400" /> Analíticas</>}
            </h1>
            {lastSaved && activeTab !== 'analíticas' && <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5 animate-pulse">● Cambios guardados</span>}
          </div>
          
          {activeTab !== 'analíticas' && (
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#00c9b1] text-black text-[10px] font-black uppercase rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? '...' : 'Publicar'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 custom-scrollbar pb-24 md:pb-8">
          {activeTab === 'diseño' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-2 transition-all">
              <Section title="Identidad" icon={Globe}>
                <InputField label="Nombre de Marca" value={siteData.content.displayName} onChange={(v: any) => updateContent('displayName', v)} />
                <SlugField value={siteData.slug} onChange={(v: any) => setSiteData(prev => ({ ...prev, slug: v }))} />
                <SelectField label="Tipo de Sitio" value={siteData.type} options={['vCard', 'Menu', 'Showcase']} onChange={(v: any) => setSiteData(prev => ({ ...prev, type: v }))} />
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
                <InputField label="TÍTULO / PROFESIÓN" value={siteData.content.title} onChange={(v: any) => updateContent('title', v)} />
                <InputField label="BIO / DESCRIPCIÓN" value={siteData.content.bio} onChange={(v: any) => updateContent('bio', v)} isArea />
              </Section>

              <Section title="Contacto" icon={Smartphone}>
                <InputField label="WhatsApp" value={siteData.content.whatsapp} onChange={(v: any) => updateContent('whatsapp', v)} />
                <InputField label="Teléfono" value={siteData.content.phone} onChange={(v: any) => updateContent('phone', v)} />
                <InputField label="Email" value={siteData.content.email} onChange={(v: any) => updateContent('email', v)} />
              </Section>

              {siteData.type === 'Menu' && (
                <Section title="Platillos/Precios" icon={Plus}>
                  <div className="space-y-3">
                    {(siteData.content.items as any[])?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center bg-black/40 p-3 rounded-2xl border border-[#27272a]">
                        <input className="bg-transparent text-sm w-full focus:outline-none" value={item.name} onChange={(e) => {
                          const newI = [...siteData.content.items]; newI[idx].name = e.target.value; updateContent('items', newI);
                        }} />
                        <input className="bg-transparent text-sm w-16 text-right font-mono text-primary font-black outline-none" type="number" value={item.price} onChange={(e) => {
                          const newI = [...siteData.content.items]; newI[idx].price = Number(e.target.value); updateContent('items', newI);
                        }} />
                        <button onClick={() => updateContent('items', siteData.content.items.filter((_: any, i: number) => i !== idx))} className="shrink-0 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-zinc-600 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => updateContent('items', [...(siteData.content.items || []), { name: 'Nuevo Item', price: 0 }])} className="w-full py-4 border border-dashed border-[#27272a] rounded-2xl text-[10px] font-black uppercase text-primary hover:bg-primary/5 flex justify-center gap-2 items-center transition-all active:scale-95"><Plus className="w-3 h-3" /> Agregar Platillo</button>
                  </div>
                </Section>
              )}

              {siteData.type === 'Showcase' && (
                <Section title="Galería Showcase" icon={LayoutIcon}>
                  <div className="space-y-4">
                    {(siteData.content.projects as any[])?.map((project: any, idx: number) => (
                      <div key={idx} className="bg-black/40 p-5 rounded-[28px] border border-[#27272a] space-y-4 relative group">
                        <button 
                          onClick={() => updateContent('projects', siteData.content.projects.filter((_: any, i: number) => i !== idx))}
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl z-20 active:scale-90 transition-transform"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <InputField label="Nombre del Proyecto" value={project.title} onChange={(v: any) => {
                          const newP = [...siteData.content.projects]; newP[idx].title = v; updateContent('projects', newP);
                        }} />
                        
                        <div className="space-y-2">
                          <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest px-1">Imagen / Thumbnail</label>
                          <div className="flex flex-col gap-2">
                             <div className="flex gap-2">
                                <input 
                                  className="flex-1 bg-black/40 border border-[#27272a] rounded-xl px-4 py-3 text-xs focus:border-primary outline-none transition-all" 
                                  placeholder="URL del archivo" 
                                  value={project.imageUrl} 
                                  onChange={(e) => {
                                    const newP = [...(siteData.content.projects as any[])]; 
                                    newP[idx].imageUrl = e.target.value; 
                                    updateContent('projects', newP);
                                  }} 
                                />
                                <div className="relative">
                                  <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleFileUpload(file, idx);
                                    }}
                                    disabled={uploadingIdx === idx}
                                  />
                                  <button className="h-full px-5 rounded-xl bg-primary text-black flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
                                    {uploadingIdx === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                  </button>
                                </div>
                             </div>
                             {project.imageUrl && (
                              <div className="aspect-video rounded-2xl overflow-hidden border border-[#27272a] bg-black/60 relative group-hover:border-primary/50 transition-colors">
                                <img src={project.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateContent('projects', [...(siteData.content.projects || []), { title: 'Nuevo Proyecto', description: '', imageUrl: '' }])}
                      className="w-full py-5 border border-dashed border-[#27272a] rounded-[28px] text-[10px] font-black uppercase text-primary hover:bg-primary/5 flex justify-center gap-2 items-center transition-all active:scale-[0.98]"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar Mi Proyecto
                    </button>
                  </div>
                </Section>
              )}
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-2 transition-all">
               <Section title="Configurar QR" icon={QrCode}>
                  <div className="bg-[#1a1a1c] p-8 rounded-[40px] border border-[#27272a] flex flex-col items-center gap-6 text-center shadow-2xl">
                    <div id="preview-qr" className="p-5 bg-white rounded-[32px] shadow-2xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <QRCodeSVG 
                        value={`https://standmx.com/qr/${microsite?.id || 'demo'}`} 
                        size={200}
                        level="H"
                        includeMargin={false}
                        fgColor="#000000"
                        imageSettings={{
                           src: "/logo-mini.png",
                           height: 38,
                           width: 38,
                           excavate: true,
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-black text-white mb-2 leading-tight">Este QR Nunca Cambia</h4>
                      <p className="text-[11px] text-zinc-500 px-6 font-medium leading-relaxed">Tus tarjetas impresas funcionan para siempre. Si cambias de plan o de link, nosotros redirigimos automáticamente.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                       <button onClick={downloadQR} className="flex items-center justify-center gap-3 bg-zinc-800 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-750 transition-all active:scale-95">
                          <Download className="w-4 h-4" /> Bajar PNG
                       </button>
                       <button className="flex items-center justify-center gap-3 bg-primary/10 border border-primary/20 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/20 transition-all active:scale-95">
                          <Share2 className="w-4 h-4" /> Link Directo
                       </button>
                    </div>
                  </div>
               </Section>
            </div>
          )}

          {activeTab === 'analíticas' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-left-2 transition-all">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <StatCard label="Escaneos" value={stats?.totalScans || 0} icon={TrendingUp} color="#00c9b1" loading={analyticsLoading} />
                   <StatCard label="Live Sites" value={1} icon={Globe} color="#6366f1" loading={analyticsLoading} />
                </div>
                <Section title="Vistas por País" icon={MapPin}>
                   <div className="space-y-3">
                      {Object.entries(stats?.byCountry || {}).map(([country, count]: any, idx: number) => (
                         <div key={idx} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                            <span className="text-xs font-black text-white uppercase">{country}</span>
                            <span className="text-xs font-mono text-primary font-black">{count}</span>
                         </div>
                      ))}
                      {Object.keys(stats?.byCountry || {}).length === 0 && <p className="text-xs text-zinc-600 italic py-4">Sin datos de tráfico aún.</p>}
                   </div>
                </Section>
             </div>
          )}
        </div>
      </div>

      {/* ── PANEL PREVIEW (DERECHAs / CENTRO) ────────────────────────── */}
      <div className={`flex-1 bg-[#0d0d0f] md:flex flex-col items-center justify-center relative p-4 md:p-8 order-2 md:order-3 ${showMobilePreview ? 'flex fixed inset-0 z-40 md:relative md:z-auto' : 'hidden md:flex'}`}>
        
        {/* Mobile Header for Preview Mode */}
        <div className="md:hidden absolute top-0 left-0 w-full p-4 flex items-center justify-between border-b border-white/5 bg-[#0d0d0f]/80 backdrop-blur-xl shrink-0 z-10">
           <button onClick={() => setShowMobilePreview(false)} className="flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase">
              <ChevronLeft className="w-4 h-4" /> Volver al Editor
           </button>
           <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Vista Previa Live</span>
        </div>

        <div className="absolute top-20 md:top-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-10">
          <div className="bg-[#18181b]/80 backdrop-blur-xl border border-white/5 rounded-full h-12 px-6 flex items-center justify-between shadow-2xl">
            <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-2 truncate">
              <span className="text-primary font-black">https://</span>
              <span className="text-zinc-200 font-bold">{siteData.slug || 'slug'}</span>
              <span className="opacity-40">.standmx.com</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </div>
        </div>

        {/* Dynamic Display (iPhone Mockup on Desktop, Full Mobile View on actual mobile toggle) */}
        <div className="relative w-full h-full md:w-[360px] md:h-[720px] bg-black md:rounded-[60px] md:border-[10px] md:border-[#1a1a1c] shadow-[0_60px_100px_-30px_rgba(0,0,0,0.9)] overflow-hidden scale-[0.95] md:scale-[0.85] lg:scale-[0.95] origin-center transition-all duration-500">
          {/* Notch for Mockup */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-7 bg-[#1a1a1c] rounded-b-3xl z-50 border-x border-b border-white/5" />
          
          <div className="w-full h-full overflow-y-auto scrollbar-hide pt-20 md:pt-0">
            <MicrositeViewer siteData={{ ...siteData }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// UI Reusable Components
function NavIcon({ icon: Icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`relative p-4 rounded-2xl transition-all duration-300 group ${
        active 
          ? 'bg-primary text-black shadow-[0_0_20px_rgba(0,201,177,0.4)] scale-110' 
          : 'text-zinc-500 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" strokeWidth={active ? 3 : 2} />
      {active && (
        <motion.div 
          layoutId="nav-glow" 
          className="absolute inset-0 rounded-2xl bg-primary/20 blur-md pointer-events-none" 
        />
      )}
    </button>
  );
}

function Section({ title, icon: Icon, children }: any) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] pl-1">
        <Icon className="w-3.5 h-3.5 text-primary/60" /> {title}
      </div>
      <div className="grid gap-6 bg-[#161618] p-6 rounded-[32px] border border-white/5 shadow-inner relative group hover:border-white/10 transition-colors">
        {children}
      </div>
    </section>
  );
}

function InputField({ label, value, onChange, isArea }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest px-1">{label}</label>
      {isArea ? (
        <textarea 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className="w-full bg-[#0d0d0f] border border-[#27272a] rounded-2xl px-5 py-4 text-sm text-zinc-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none min-h-[100px] resize-none transition-all placeholder:text-zinc-800" 
        />
      ) : (
        <input 
          type="text" 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className="w-full bg-[#0d0d0f] border border-[#27272a] rounded-2xl px-5 py-4 text-sm text-zinc-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-zinc-800" 
        />
      )}
    </div>
  );
}

function SlugField({ value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest px-1">Slug URL</label>
      <div className="flex items-stretch group">
        <div className="bg-[#1c1c1f] border border-[#27272a] border-r-0 rounded-l-2xl flex items-center px-4 text-[10px] font-black text-zinc-600 uppercase tracking-tighter">https://</div>
        <input 
          type="text" 
          value={value} 
          onChange={e => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
          className="w-full bg-[#0d0d0f] border border-[#27272a] px-5 py-4 text-sm text-primary font-black outline-none focus:border-primary transition-all group-hover:border-primary/30" 
        />
        <div className="bg-[#1c1c1f] border border-[#27272a] border-l-0 rounded-r-2xl flex items-center px-4 text-[10px] font-black text-zinc-600 lowercase tracking-tight">.standmx.com</div>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest px-1">{label}</label>
      <div className="relative">
        <select 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className="w-full bg-[#0d0d0f] border border-[#27272a] rounded-2xl px-5 py-4 text-sm text-zinc-200 outline-none appearance-none cursor-pointer focus:border-primary transition-all pr-12"
        >
          {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
           <Smartphone className="w-4 h-4 rotate-180" />
        </div>
      </div>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] text-zinc-600 font-black uppercase tracking-widest px-1">{label}</label>
      <div className="flex items-center gap-3 bg-[#0d0d0f] border border-[#27272a] rounded-2xl p-2.5 group-hover:border-primary/30 transition-all cursor-pointer">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/5 shrink-0 shadow-lg">
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 w-[200%] h-[200%] cursor-pointer -translate-x-1/4 -translate-y-1/4" />
        </div>
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value.toUpperCase())} 
          className="bg-transparent text-[11px] font-black font-mono text-zinc-400 w-full outline-none uppercase tracking-widest" 
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, loading }: any) {
   return (
      <div className="bg-[#161618] border border-white/5 p-6 rounded-[32px] space-y-4 hover:border-white/10 transition-colors shadow-inner">
         <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5" style={{ color }}>
               <Icon className="w-5 h-5" />
            </div>
            {loading && <Loader2 className="w-4 h-4 text-zinc-600 animate-spin" />}
         </div>
         <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-3xl font-black text-white">{value}</p>
         </div>
      </div>
   );
}
