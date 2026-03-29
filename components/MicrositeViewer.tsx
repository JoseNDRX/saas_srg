'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Smartphone, QrCode, Mail, Phone, ShoppingCart, Plus, Minus, X, Image as ImageIcon, MapPin, Share2, Globe, ExternalLink, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Microsite Viewer Component (PWA Lite)
 * Renderiza vCards, Menús y Showcases con look & feel nativo.
 */
export function MicrositeViewer({ 
  siteData 
}: { 
  siteData: { 
    name: string; 
    type: string; 
    content: any;
    colors: any;
  } 
}) {
  const { name, type, content, colors } = siteData;
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);

  // Fallback defaults
  const primary = colors?.primary || '#00c9b1';
  const secondary = colors?.secondary || '#a78bfa';
  const bg = colors?.background || '#09090b';
  const cardBg = colors?.card || '#111113';
  const textColor = bg === '#fafafa' || bg === '#ffffff' ? '#09090b' : '#fafafa';

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = content.items?.reduce((total: number, item: any) => {
    return total + (item.price * (cart[item.name] || 0));
  }, 0) || 0;

  const addToCart = (itemName: string) => {
    setCart(prev => ({ ...prev, [itemName]: (prev[itemName] || 0) + 1 }));
  };

  const removeFromCart = (itemName: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemName] > 1) newCart[itemName]--;
      else delete newCart[itemName];
      return newCart;
    });
  };

  const handleCheckout = () => {
    const text = `🍽️ *Pedido de ${name}*\n\n` + 
      Object.entries(cart).map(([name, qty]) => `- ${qty}x ${name}`).join('\n') +
      `\n\n💰 *Total: $${cartTotal}*\n\n📲 Pedido vía StandMX`;
    
    const encodedText = encodeURIComponent(text);
    const whatsappNumber = content.whatsapp || '';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <div 
      className="min-h-full w-full flex flex-col items-center pb-20 overflow-y-auto custom-scrollbar relative font-sans"
      style={{ backgroundColor: bg, color: textColor }}
    >
      {/* 🟢 CARRITO FLOTANTE (Solo Menú) */}
      <AnimatePresence>
        {(type === 'Menu' || type === 'menu') && cartCount > 0 && (
          <motion.button 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setShowCart(true)}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] px-8 py-5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-3 backdrop-blur-xl border border-white/20 active:scale-95 transition-all"
            style={{ backgroundImage: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`, color: '#000' }}
          >
            <ShoppingCart className="w-5 h-5" strokeWidth={3} />
            <span className="font-black text-sm uppercase tracking-widest">{cartCount} items en pedido</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 🛒 MODAL CARRITO */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-md bg-[#18181b] rounded-[40px] p-8 shadow-2xl border border-white/5"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white flex gap-3 items-center">
                  <ShoppingCart className="w-6 h-6 text-primary" /> Mi Carrito
                </h3>
                <button onClick={() => setShowCart(false)} className="p-3 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 transition-all">
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>
              
              <div className="max-h-[40vh] overflow-y-auto space-y-4 mb-8 custom-scrollbar pr-2">
                {Object.entries(cart).map(([itemName, qty]) => {
                  const item = content.items?.find((i: any) => i.name === itemName);
                  return (
                    <div key={itemName} className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">{itemName}</span>
                        <span className="text-[11px] text-primary font-bold uppercase">${item?.price} c/u</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => removeFromCart(itemName)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"><Minus className="w-4 h-4"/></button>
                        <span className="text-sm font-black font-mono text-white">{qty}</span>
                        <button onClick={() => addToCart(itemName)} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/20 active:scale-110 transition-all"><Plus className="w-4 h-4"/></button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-white/10 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em]">Total Pedido:</span>
                  <span className="text-3xl font-black text-white">$ {cartTotal}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-5 rounded-[22px] font-black text-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] shadow-2xl active:scale-95"
                  style={{ backgroundImage: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)` }}
                >
                  Enviar Pedido vía WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📱 CONTENEDOR PRINCIPAL */}
      <div 
        className="w-full max-w-lg md:rounded-[40px] overflow-hidden shadow-2xl flex flex-col min-h-full md:min-h-0 md:mt-10"
        style={{ backgroundColor: cardBg }}
      >
        {/* 🔥 HEADER / HERO */}
        <div 
          className="relative min-h-[160px] md:min-h-[200px] w-full flex flex-col items-center justify-center px-6 overflow-hidden"
          style={{ backgroundImage: `linear-gradient(135deg, ${primary}40 0%, ${secondary}20 100%)` }}
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[20px]" />
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
          
          <h1 className="relative z-10 text-3xl md:text-4xl font-black text-white tracking-tighter text-center leading-none">
            {name}
          </h1>
          {content.title && (
             <p className="relative z-10 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mt-3 opacity-60 text-center">
                {content.title}
             </p>
          )}
        </div>

        {/* 🧩 CUERPO DINÁMICO */}
        <div className="p-6 md:p-8 flex flex-col items-center -mt-8 md:-mt-10 relative z-10 bg-[#111113] rounded-t-[40px]">
          
          {/* vCard View */}
          {(type === 'vCard' || type === 'vcard' || type === 'VCard') && (
             <VCardView content={content} colors={{ primary, secondary, bg, cardBg }} />
          )}

          {/* Menú View */}
          {(type === 'Menu' || type === 'menu') && (
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 mb-6 opacity-30">
                 <div className="h-[1px] flex-1 bg-white" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Menú de Selección</span>
                 <div className="h-[1px] flex-1 bg-white" />
              </div>

              {content.items?.map((item: any, i: number) => (
                <div 
                  key={i} 
                  className="group flex justify-between items-center p-5 bg-white/5 rounded-3xl border border-white/5 active:bg-white/10 active:scale-[0.98] transition-all cursor-pointer"
                  onClick={() => addToCart(item.name)}
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="font-bold text-sm text-white group-hover:text-primary transition-colors">{item.name}</span>
                    {item.description && <span className="text-[11px] text-zinc-500 leading-tight line-clamp-2">{item.description}</span>}
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-black font-mono text-sm text-primary">${item.price}</span>
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                       <Plus className="w-5 h-5" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              ))}
              
              {(!content.items || content.items.length === 0) && (
                <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                   <ShoppingCart className="w-10 h-10" />
                   <p className="text-xs font-black uppercase">Carta en construcción</p>
                </div>
              )}
            </div>
          )}

          {/* Showcase View */}
          {(type === 'Showcase' || type === 'showcase') && (
            <div className="w-full space-y-8">
              <div className="flex items-center gap-3 mb-2 opacity-30">
                 <div className="h-[1px] flex-1 bg-white" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Mis Proyectos</span>
                 <div className="h-[1px] flex-1 bg-white" />
              </div>

              <div className="grid grid-cols-1 gap-6">
                {content.projects?.map((project: any, i: number) => (
                  <div key={i} className="group overflow-hidden rounded-[32px] bg-[#1a1a1c] border border-white/5 shadow-2xl transition-all hover:-translate-y-2 active:scale-95">
                    {project.imageUrl && (
                      <div className="aspect-[16/10] w-full overflow-hidden relative">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                         <div className="absolute bottom-4 left-4 p-2 rounded-xl bg-primary/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-black" />
                         </div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-black text-lg text-white mb-2 tracking-tight group-hover:text-primary transition-colors">{project.title || 'Proyecto'}</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed font-medium line-clamp-3">{project.description || 'Sin descripción detallada disponible.'}</p>
                    </div>
                  </div>
                ))}
              </div>

              {(!content.projects || content.projects.length === 0) && (
                <div className="py-20 flex flex-col items-center justify-center opacity-20 gap-4 border-4 border-dashed border-white/5 rounded-[40px] w-full">
                   <ImageIcon className="w-12 h-12" />
                   <p className="text-[10px] font-black uppercase tracking-[0.2em]">Cargando Portfolio...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* 🚀 BRANDING INFERIOR */}
      <Link 
        href="https://standmx.com" 
        target="_blank"
        className="mt-12 flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-lg">
           <Smartphone className="w-4 h-4 text-black" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
           Power by StandMX SaaS
        </div>
      </Link>
    </div>
  );
}

// 📇 SUB-VIEW: vCARD
function VCardView({ content, colors }: any) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Profil Avatar Placeholder */}
      <div className="w-24 h-24 rounded-[32px] bg-gradient-brand shadow-2xl mb-6 flex items-center justify-center scale-95 hover:scale-100 transition-transform duration-500 border-4"
        style={{ borderColor: colors.cardBg }}>
        <span className="text-4xl">🚀</span>
      </div>
      
      <div className="text-center mb-10 w-full px-4">
        <h2 className="text-2xl font-black text-white tracking-tighter mb-1">
          {content.displayName || 'Nombre de Marca'}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-4">
           <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
              {content.title || 'Direct Manager'}
           </span>
        </div>
        <p className="text-sm font-medium text-zinc-500 leading-relaxed max-w-xs mx-auto text-balance">
          {content.bio || 'Haz clic abajo para conectar con nosotros y guardar nuestro contacto profesional.'}
        </p>
      </div>
      
      <div className="w-full flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 w-full">
           {content.whatsapp && <MiniContactBtn icon={Smartphone} label="Chat" href={`https://wa.me/${content.whatsapp}`} color={colors.primary} />}
           {content.phone && <MiniContactBtn icon={Phone} label="Call" href={`tel:${content.phone}`} color={colors.secondary} />}
        </div>
        
        {content.email && (
           <ContactBtn 
              icon={Mail} 
              label="Contactar vía Email" 
              href={`mailto:${content.email}`} 
              color={colors.primary} 
           />
        )}

        <div className="h-[1px] w-full bg-white/5 my-4" />

        <div className="flex flex-col gap-3 w-full">
           {content.socialLinks?.map((link: any, i: number) => (
             <a 
               key={i} 
               href={link.url || '#'}
               target="_blank"
               className="w-full py-5 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] text-center transition-all hover:scale-[1.02] active:scale-95 shadow-xl flex items-center justify-center gap-3"
               style={{ backgroundColor: colors.primary, color: '#000' }}
             >
               <Globe className="w-4 h-4" />
               {link.platform || 'Visitar Web'}
             </a>
           ))}
        </div>
        
        <button 
           className="w-full mt-4 py-3 border border-dashed border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
        >
           Guardar en Contactos (.VCF)
        </button>
      </div>
    </div>
  );
}

// UI HELPERS
function MiniContactBtn({ icon: Icon, label, href, color }: any) {
  return (
    <a 
      href={href} 
      className="flex flex-col items-center justify-center gap-2 p-5 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-90"
    >
      <Icon className="w-6 h-6" style={{ color }} strokeWidth={2.5} />
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
    </a>
  );
}

function ContactBtn({ icon: Icon, label, href, color }: any) {
  return (
    <a 
      href={href} 
      className="flex items-center gap-5 p-5 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/10 active:scale-[0.98] transition-all group"
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 group-hover:bg-primary/20 transition-colors" style={{ color }}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-black text-white">{label}</span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Link oficial</span>
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-800 ml-auto" />
    </a>
  );
}
