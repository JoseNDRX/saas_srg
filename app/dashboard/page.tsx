'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  X,
  QrCode, 
  BarChart3, 
  Palette, 
  Globe, 
  Smartphone, 
  Save, 
  Loader2, 
  Trash2, 
  Download, 
  ExternalLink,
  LogOut,
  TrendingUp,
  MapPin,
  Upload,
  Layout as LayoutIcon,
  ChevronLeft,
  Eye,
  ChevronRight,
  Layers,
  LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { MicrositeViewer } from '@/components/MicrositeViewer';

/**
 * Dashboard Constructor (Next.js 16 + Supabase)
 * Fully typed to avoid IDE 'never' inference errors.
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
      displayName: 'Mi Marca',
      title: '',
      bio: '',
      whatsapp: '',
      phone: '',
      email: '',
      items: [] as any[], 
      projects: [] as any[], 
      sociallinks: [] as any[],
    }
  });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user?.id) return;
    
    async function loadData() {
      try {
        // Casting 'supabase.from' return to avoid 'never' inference
        const { data, error } = await (supabase.from('microsites') as any)
          .select('*')
          .eq('owner_id', user?.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setMicrosite(data);
          setSiteData({
            slug: data.slug || '',
            type: data.type || 'vCard',
            colors: (data.config as any)?.colors || siteData.colors,
            content: { ...siteData.content, ...(data.content as any) }
          });
        }
      } catch (e) {
        console.error('Error loading dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  useEffect(() => {
    if (activeTab === 'analíticas' && microsite?.id) fetchAnalytics();
  }, [activeTab, microsite?.id]);

  async function fetchAnalytics() {
     if (!microsite?.id) return;
     setAnalyticsLoading(true);
     try {
       const { data, error } = await (supabase.from('qr_analytics') as any)
         .select('*')
         .eq('microsite_id', microsite.id)
         .order('scanned_at', { ascending: false });

       if (error) throw error;

       if (data) {
          const byCountry: Record<string, number> = {};
          data.forEach((s: any) => { 
            const c = s.ip_country || 'Unknown'; 
            byCountry[c] = (byCountry[c] || 0) + 1; 
          });
          setStats({ 
            totalScans: data.length, 
            byCountry, 
            raw: data, 
            byMicrosite: [{ name: siteData.slug || 'Mi Sitio', scans: data.length }] 
          });
       }
     } catch (e) {
       console.error('Analytics error:', e);
     } finally {
       setAnalyticsLoading(false);
     }
  }

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setLastSaved(false);
    
    const payload = { 
      owner_id: user.id, 
      slug: siteData.slug, 
      type: siteData.type, 
      config: { colors: siteData.colors }, 
      content: siteData.content, 
      updated_at: new Date().toISOString() 
    };
    
    try {
      let result;
      if (microsite?.id) {
        result = await (supabase.from('microsites') as any).update(payload).eq('id', microsite.id);
      } else {
        result = await (supabase.from('microsites') as any).insert([payload]).select().single();
        if (result.data) setMicrosite(result.data);
      }
      
      if (result.error) throw result.error;
      
      setLastSaved(true); 
      setTimeout(() => setLastSaved(false), 3000); 
    } catch (e: any) {
      alert(`Error al guardar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (key: string, value: any) => {
    setSiteData(prev => ({ ...prev, content: { ...prev.content, [key]: value } }));
  };

  const updateColors = (key: string, value: string) => {
    setSiteData(prev => ({ ...prev, colors: { ...prev.colors, [key]: value } }));
  };

  const handleFileUpload = async (file: File, idx: number) => {
    if (!user?.id) return;
    try {
      setUploadingIdx(idx);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      const { error: uploadError } = await (supabase.storage.from('microsite-images') as any).upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = (supabase.storage.from('microsite-images') as any).getPublicUrl(filePath);
      const newP = [...(siteData.content.projects as any[])];
      newP[idx].imageUrl = data.publicUrl;
      updateContent('projects', newP);
    } catch (error: any) { 
      console.error(error);
      alert('Error al subir la imagen.'); 
    } finally { 
      setUploadingIdx(null); 
    }
  };

  const downloadQR = useCallback(() => {
    const svg = document.querySelector('#preview-qr svg') as SVGSVGElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 2048;
      canvas.height = 2048;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 2048, 2048);
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `qr-${siteData.slug || 'standmx'}.png`;
        link.href = url;
        link.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }, [siteData.slug]);

  if (authLoading || loading) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-background gap-6 min-h-screen">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-t-2 border-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center uppercase text-[10px] font-black text-primary animate-pulse">SMX</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-background overflow-hidden text-foreground selection:bg-primary/20">
      
      {/* ── SIDEBAR NAV ────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 w-full md:relative md:w-28 md:h-full z-[100] md:z-50 p-4 md:p-0">
        <div className="mx-auto max-w-lg md:max-w-none md:h-full bg-card/95 backdrop-blur-3xl md:bg-card border border-border md:border-t-0 md:border-r md:border-border rounded-[32px] md:rounded-none flex flex-row md:flex-col items-center py-4 md:py-10 px-6 md:px-0 shadow-2xl md:shadow-none">
          <div className="hidden md:flex flex-col items-center gap-2 mb-14">
            <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-2xl shadow-primary/20">
              <Layers className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
          </div>
          <div className="flex-1 flex flex-row md:flex-col gap-2 md:gap-8 w-full justify-around md:justify-center">
            <NavIcon icon={LayoutIcon} active={activeTab === 'diseño'} onClick={() => {setActiveTab('diseño'); setShowMobilePreview(false);}} label="Estilo" />
            <NavIcon icon={Plus} active={activeTab === 'contenido'} onClick={() => {setActiveTab('contenido'); setShowMobilePreview(false);}} label="Data" />
            <NavIcon icon={QrCode} active={activeTab === 'qr'} onClick={() => {setActiveTab('qr'); setShowMobilePreview(false);}} label="Scan" />
            <NavIcon icon={BarChart3} active={activeTab === 'analíticas'} onClick={() => {setActiveTab('analíticas'); setShowMobilePreview(false);}} label="Stats" />
            <button onClick={() => setShowMobilePreview(!showMobilePreview)} className={`md:hidden p-3 rounded-2xl transition-all relative flex flex-col items-center gap-1.5 ${showMobilePreview ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`p-2.5 rounded-xl transition-all ${showMobilePreview ? 'bg-primary/15' : ''}`}>
                 <Eye className="w-6 h-6" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-80">Monitor</span>
            </button>
          </div>
          <button onClick={() => signOut().then(() => router.push('/login'))} className="flex p-4 rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all md:mb-6 shrink-0 active:scale-90" title="Cerrar Ecosistema">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* ── PANEL EDITOR ────────────────────────────────────────── */}
      <div className={`flex-1 md:w-[500px] md:flex-none border-r border-border flex flex-col bg-background relative z-10 ${showMobilePreview ? 'hidden md:flex' : 'flex'}`}>
        <header className="h-20 md:h-24 border-b border-border px-6 md:px-10 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-xl z-20 shrink-0">
          <div className="flex items-center gap-5">
            <div className="md:hidden w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-xl">
              <Layers className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-xs font-black text-foreground flex items-center gap-3 uppercase tracking-[0.3em]">
                 {activeTab === 'diseño' && <Palette className="w-4 h-4 text-primary" />}
                 {activeTab === 'contenido' && <Plus className="w-4 h-4 text-amber-500" />}
                 {activeTab === 'qr' && <QrCode className="w-4 h-4 text-emerald-400" />}
                 {activeTab === 'analíticas' && <BarChart3 className="w-4 h-4 text-indigo-400" />}
                 <span className="opacity-80">{activeTab}</span>
              </h1>
              {lastSaved && <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1.5 mt-1 animate-pulse">● Cloud Sync OK</span>}
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-3 px-7 py-3.5 bg-gradient-brand text-black text-[11px] font-black uppercase rounded-[22px] hover:opacity-90 disabled:opacity-50 transition-all shadow-2xl shadow-primary/20 active:scale-95">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? '...' : 'Publicar'}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-5 md:px-10 py-10 md:py-14 space-y-16 custom-scrollbar pb-40 md:pb-16">
          {activeTab === 'diseño' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 w-full">
              <Section title="ID del Micrositio" icon={Globe}>
                <InputField label="Nombre de Marca" value={siteData.content.displayName} onChange={(v) => updateContent('displayName', v)} />
                <SlugField value={siteData.slug} onChange={(v) => setSiteData(prev => ({ ...prev, slug: v }))} />
                <SelectField label="Ecosistema" value={siteData.type} options={['vCard', 'Menu', 'Showcase']} onChange={(v) => setSiteData(prev => ({ ...prev, type: v }))} />
              </Section>
              <Section title="Estética Digital" icon={Palette}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  <ColorInput label="Primario" value={siteData.colors.primary} onChange={(v) => updateColors('primary', v)} />
                  <ColorInput label="Secundario" value={siteData.colors.secondary} onChange={(v) => updateColors('secondary', v)} />
                  <ColorInput label="Fondo" value={siteData.colors.background} onChange={(v) => updateColors('background', v)} />
                  <ColorInput label="Tarjeta" value={siteData.colors.card} onChange={(v) => updateColors('card', v)} />
                </div>
              </Section>
            </motion.div>
          )}

          {activeTab === 'contenido' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 w-full">
              <Section title="Data Pública" icon={Smartphone}>
                <InputField label="Título Profesional" value={siteData.content.title} onChange={(v) => updateContent('title', v)} />
                <InputField label="Bio / Misión" value={siteData.content.bio} onChange={(v) => updateContent('bio', v)} isArea />
              </Section>
              <Section title="Fuerza de Contacto" icon={Smartphone}>
                <InputField label="WhatsApp (52...)" value={siteData.content.whatsapp} onChange={(v) => updateContent('whatsapp', v)} />
                <InputField label="Teléfono Público" value={siteData.content.phone} onChange={(v) => updateContent('phone', v)} />
                <InputField label="Email Corporativo" value={siteData.content.email} onChange={(v) => updateContent('email', v)} />
              </Section>
              {siteData.type === 'Menu' && (
                <Section title="Menú de Selección" icon={Plus}>
                  <div className="space-y-5 w-full">
                    {(siteData.content.items as any[])?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-center bg-muted/30 p-5 rounded-3xl border border-border transition-all hover:bg-muted/50">
                        <input className="bg-transparent text-sm w-full font-black outline-none text-foreground uppercase tracking-tight" value={item.name} onChange={(e) => { const newI = [...siteData.content.items]; newI[idx].name = e.target.value; updateContent('items', newI); }} />
                        <input className="bg-transparent text-sm w-24 text-right font-black text-primary outline-none" type="number" value={item.price} onChange={(e) => { const newI = [...siteData.content.items]; newI[idx].price = Number(e.target.value); updateContent('items', newI); }} />
                        <button onClick={() => updateContent('items', siteData.content.items.filter((_: any, i: number) => i !== idx))} className="p-3 rounded-2xl hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-5 h-5 text-muted-foreground hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => updateContent('items', [...(siteData.content.items || []), { name: 'Item Nuevo', price: 99 }])} className="w-full py-6 border-2 border-dashed border-border rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/5 hover:border-primary/40 flex justify-center gap-3 items-center transition-all active:scale-[0.98]"><Plus className="w-5 h-5" /> Agregar Item</button>
                  </div>
                </Section>
              )}
              {siteData.type === 'Showcase' && (
                <Section title="Galería Showcase" icon={LayoutIcon}>
                  <div className="space-y-8 w-full">
                    {(siteData.content.projects as any[])?.map((project: any, idx: number) => (
                      <div key={idx} className="bg-muted/30 p-8 rounded-[48px] border border-border space-y-8 relative shadow-2xl w-full">
                        <button onClick={() => updateContent('projects', siteData.content.projects.filter((_: any, i: number) => i !== idx))} className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl z-20 active:scale-90 transition-all border-4 border-background"><X className="w-6 h-6" /></button>
                        <InputField label="Nombre del Proyecto" value={project.title} onChange={(v) => { const newP = [...siteData.content.projects]; newP[idx].title = v; updateContent('projects', newP); }} />
                        <div className="space-y-4">
                          <label className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.3em] px-2">Activo Visual</label>
                          <div className="flex flex-col gap-5">
                             <div className="flex gap-4">
                                <input className="flex-1 bg-background border border-border rounded-[22px] px-6 py-5 text-xs font-black focus:border-primary outline-none transition-all placeholder:opacity-20" placeholder="Link de imagen .jpg/.webp" value={project.imageUrl} onChange={(e) => { const newP = [...(siteData.content.projects as any[])]; newP[idx].imageUrl = e.target.value; updateContent('projects', newP); }} />
                                <div className="relative">
                                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, idx); }} disabled={uploadingIdx === idx} />
                                  <button className="h-full px-7 rounded-[22px] bg-primary text-black flex items-center gap-2 shadow-xl hover:opacity-90 disabled:opacity-50">{uploadingIdx === idx ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}</button>
                                </div>
                             </div>
                             {project.imageUrl && <div className="aspect-[16/10] rounded-[36px] overflow-hidden border-2 border-border bg-black shadow-inner"><img src={project.imageUrl} alt="Preview" className="w-full h-full object-cover" /></div>}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => updateContent('projects', [...(siteData.content.projects || []), { title: 'Nuevo Proyecto', description: '', imageUrl: '' }])} className="w-full py-7 border-2 border-dashed border-border rounded-[48px] text-[12px] font-black uppercase tracking-[0.3em] text-primary hover:bg-primary/5 hover:border-primary/40 flex justify-center gap-3 items-center transition-all active:scale-[0.98]"><Plus className="w-5 h-5" /> Inyectar Proyecto</button>
                  </div>
                </Section>
              )}
            </motion.div>
          )}

          {activeTab === 'qr' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
               <Section title="Puerta al Ecosistema" icon={QrCode}>
                  <div className="bg-muted p-10 md:p-14 rounded-[64px] border border-border flex flex-col items-center gap-12 text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-brand opacity-80" />
                    <div id="preview-qr" className="p-10 bg-white rounded-[56px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] transform hover:scale-[1.03] transition-all duration-700 ring-[12px] ring-white/10 group-hover:ring-primary/20">
                      <QRCodeSVG 
                        value={`https://standmx.com/qr/${microsite?.id || 'demo'}`} 
                        size={260} 
                        level="H" 
                        includeMargin={false} 
                        fgColor="#000000" 
                        imageSettings={microsite?.logo_url ? { src: microsite.logo_url, height: 48, width: 48, excavate: true } : undefined}
                      />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-3xl font-black text-foreground tracking-tighter">QR Estático Vitalicio</h4>
                       <p className="text-[11px] text-muted-foreground px-8 leading-relaxed font-black uppercase tracking-[0.3em] opacity-70">Tu marca evoluciona, tu QR impreso permanece.</p>
                    </div>
                    <div className="w-full pt-6">
                       <button onClick={downloadQR} className="w-full flex items-center justify-center gap-5 bg-primary text-black py-7 rounded-[32px] text-[12px] font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(0,201,177,0.4)] hover:opacity-90 active:scale-95 transition-all">
                          <Download className="w-6 h-6" strokeWidth={3} /> Exportar PNG (Industrial)
                       </button>
                    </div>
                  </div>
               </Section>
            </motion.div>
          )}

          {activeTab === 'analíticas' && (
             <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-8">
                   <StatCard label="Tráfico Total" value={stats?.totalScans || 0} icon={TrendingUp} color="#00c9b1" loading={analyticsLoading} />
                   <StatCard label="Up-Time Cloud" value="99.9%" icon={Globe} color="#6366f1" loading={analyticsLoading} />
                </div>
                <Section title="Vistas Geográficas" icon={MapPin}>
                   <div className="space-y-5">
                      {Object.entries(stats?.byCountry || {}).map(([country, count]: any, idx: number) => (
                         <div key={idx} className="flex justify-between items-center p-7 bg-muted/20 backdrop-blur-md rounded-[36px] border border-border shadow-inner">
                            <span className="text-xs font-black text-foreground uppercase tracking-[0.3em]">{country}</span>
                            <span className="text-xs font-mono text-primary font-black bg-primary/10 px-6 py-2.5 rounded-full border border-primary/20">{count} Scans</span>
                         </div>
                      ))}
                      {Object.keys(stats?.byCountry || {}).length === 0 && <p className="text-[11px] text-muted-foreground italic py-16 text-center font-black tracking-[0.5em] uppercase opacity-30">Waiting for global triggers...</p>}
                   </div>
                </Section>
             </motion.div>
          )}
        </main>
      </div>

      {/* ── PANEL PREVIEW ────────────────────────────────────────── */}
      <div className={`flex-1 bg-background md:flex flex-col items-center justify-center relative p-6 md:p-14 order-2 md:order-3 ${showMobilePreview ? 'fixed inset-0 z-[110] bg-background' : 'hidden md:flex'}`}>
        <div className="md:hidden absolute top-0 left-0 w-full p-8 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-2xl z-50">
           <button onClick={() => setShowMobilePreview(false)} className="flex items-center gap-3 text-muted-foreground font-black text-[11px] uppercase tracking-[0.3em] bg-muted/80 px-6 py-4 rounded-full shadow-lg active:scale-95 transition-all">
              <ChevronLeft className="w-5 h-5" /> Regresar
           </button>
           <div className="flex flex-col items-end gap-1">
              <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em] italic shadow-primary/20 drop-shadow-sm">Monitor Live</span>
              <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">Sinc: Real-time</span>
           </div>
        </div>
        <div className="absolute top-32 md:top-14 left-1/2 -translate-x-1/2 w-full max-w-sm px-8 z-20">
          <div className="bg-card/90 backdrop-blur-3xl border border-border rounded-full h-16 px-10 flex items-center justify-between shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] ring-4 ring-white/5">
            <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-3 truncate pr-6">
              <span className="text-primary/80 font-black">https://</span>
              <span className="text-foreground font-black tracking-tight">{siteData.slug || 'brand'}</span>
              <span className="opacity-40">.standmx.com</span>
            </span>
            <ExternalLink className="w-5 h-5 text-primary drop-shadow-xl" />
          </div>
        </div>
        <div className="relative w-full h-full md:w-[400px] md:h-[820px] bg-black md:rounded-[72px] md:border-[16px] md:border-card shadow-[0_120px_250px_-60px_rgba(0,0,0,1)] overflow-hidden scale-[0.92] md:scale-[0.82] lg:scale-[0.92] origin-center transition-all duration-1000 group">
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[180px] h-10 bg-card rounded-b-[32px] z-[60] shadow-inner" />
          <div className="w-full h-full overflow-y-auto scrollbar-hide pt-32 md:pt-0">
            <MicrositeViewer siteData={{ ...siteData, name: siteData.content.displayName }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Subcomponents (Typed)
interface NavIconProps { icon: LucideIcon; active: boolean; onClick: () => void; label: string; }
function NavIcon({ icon: Icon, active, onClick, label }: NavIconProps) {
  return (
    <button onClick={onClick} className={`relative p-4 md:p-5 rounded-3xl flex flex-col items-center gap-2.5 transition-all duration-700 group ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
      <div className={`p-4 rounded-[22px] transition-all duration-500 ${active ? 'bg-primary/10 shadow-[0_0_30px_rgba(0,201,177,0.3)]' : 'group-hover:bg-muted'}`}>
         <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={active ? 3 : 2} />
      </div>
      <span className={`text-[9px] md:hidden font-black uppercase tracking-[0.3em] transition-opacity ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
      {active && <motion.div layoutId="nav-glow-pulse" className="absolute inset-0 bg-primary/5 rounded-[40px] -z-10 md:hidden" />}
    </button>
  );
}

interface SectionProps { title: string; icon: LucideIcon; children: React.ReactNode; }
function Section({ title, icon: Icon, children }: SectionProps) {
  return (
    <section className="space-y-6 w-full">
      <div className="flex items-center gap-4 text-[12px] font-black text-muted-foreground uppercase tracking-[0.4em] pl-3 drop-shadow-md">
        <Icon className="w-4.5 h-4.5 text-primary" /> {title}
      </div>
      <div className="grid gap-10 bg-card border border-border rounded-[56px] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all hover:border-primary/30">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-brand opacity-20" />
        {children}
      </div>
    </section>
  );
}

interface InputFieldProps { label: string; value: string; onChange: (v: string) => void; isArea?: boolean; }
function InputField({ label, value, onChange, isArea }: InputFieldProps) {
  return (
    <div className="space-y-4 w-full">
      <label className="text-[12px] text-muted-foreground font-black uppercase tracking-[0.4em] px-3">{label}</label>
      {isArea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full bg-muted border border-border rounded-[32px] px-8 py-7 text-sm font-black text-foreground focus:border-primary focus:ring-[12px] focus:ring-primary/5 outline-none min-h-[180px] resize-none transition-all placeholder:opacity-20" />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-muted border border-border rounded-[32px] px-8 py-7 text-sm font-black text-foreground focus:border-primary focus:ring-[12px] focus:ring-primary/5 outline-none transition-all" />
      )}
    </div>
  );
}

interface SlugFieldProps { value: string; onChange: (v: string) => void; }
function SlugField({ value, onChange }: SlugFieldProps) {
  return (
    <div className="space-y-4 w-full">
      <label className="text-[12px] text-muted-foreground font-black uppercase tracking-[0.4em] px-3">Ecosistema ID</label>
      <div className="flex flex-col xl:flex-row items-stretch gap-4 xl:gap-0 xl:rounded-[32px] xl:overflow-hidden xl:border xl:border-border focus-within:border-primary focus-within:ring-[12px] focus-within:ring-primary/5 transition-all">
        <div className="hidden xl:flex bg-background px-8 items-center text-[11px] font-black text-muted-foreground uppercase border-r border-border opacity-60">https://</div>
        <input type="text" value={value} onChange={e => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="flex-1 bg-muted xl:bg-background px-8 py-7 text-sm text-primary font-black outline-none placeholder:opacity-20 border xl:border-0 border-border rounded-[32px] xl:rounded-none" placeholder="mi-nombre-digital" />
        <div className="hidden xl:flex bg-background px-8 items-center text-[11px] font-black text-muted-foreground lowercase border-l border-border opacity-60">.standmx.com</div>
        <div className="xl:hidden flex justify-between px-6 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
           <span>https://</span>
           <span>.standmx.com</span>
        </div>
      </div>
    </div>
  );
}

interface SelectFieldProps { label: string; value: string; options: string[]; onChange: (v: string) => void; }
function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="space-y-4 w-full">
      <label className="text-[12px] text-muted-foreground font-black uppercase tracking-[0.4em] px-3">{label}</label>
      <div className="relative group">
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-muted border border-border rounded-[32px] px-8 py-7 text-base font-black text-foreground outline-none appearance-none cursor-pointer focus:border-primary transition-all pr-20 group-hover:bg-muted/100 uppercase tracking-tighter">
          {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-primary group-hover:scale-125 transition-transform duration-500">
           <ChevronRight className="w-6 h-6 rotate-90" strokeWidth={5} />
        </div>
      </div>
    </div>
  );
}

interface ColorInputProps { label: string; value: string; onChange: (v: string) => void; }
function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div className="space-y-4 group w-full">
      <label className="text-[12px] text-muted-foreground font-black uppercase tracking-[0.4em] px-3">{label}</label>
      <div className="flex items-center gap-6 bg-muted border border-border rounded-[40px] p-4 hover:border-primary/50 transition-all cursor-pointer shadow-inner relative overflow-hidden group">
        <div className="relative w-16 h-16 rounded-[22px] overflow-hidden border-2 border-white/10 shrink-0 shadow-2xl transition-transform group-hover:scale-110 duration-500">
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 w-[300%] h-[300%] cursor-pointer -translate-x-1/4 -translate-y-1/4" />
        </div>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value.toUpperCase())} className="bg-transparent text-sm font-black font-mono text-foreground/90 w-full outline-none uppercase tracking-[0.3em]" />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, loading }: any) {
   return (
      <div className="bg-card border border-border p-12 rounded-[64px] space-y-10 hover:border-primary/30 transition-all shadow-[0_60px_120px_-30px_rgba(0,0,0,0.5)] relative overflow-hidden group w-full">
         <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[100px] rounded-full -translate-y-20 translate-x-20 opacity-40 group-hover:opacity-100 transition-opacity" />
         <div className="flex items-center justify-between relative z-10">
            <div className="w-16 h-16 rounded-[32px] flex items-center justify-center bg-background border-2 border-border/80 shadow-2xl" style={{ color }}>
               <Icon className="w-8 h-8" strokeWidth={3} />
            </div>
            {loading && <Loader2 className="w-7 h-7 text-primary animate-spin" />}
         </div>
         <div className="relative z-10">
            <p className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-3 opacity-60 group-hover:opacity-100 transition-opacity">{label}</p>
            <p className="text-6xl font-black text-foreground tracking-tighter leading-none">{value}</p>
         </div>
      </div>
   );
}
