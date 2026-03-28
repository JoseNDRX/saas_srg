'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Smartphone, QrCode, Mail, Phone, ShoppingCart, Plus, Minus, X } from 'lucide-react';

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
  const primary = colors?.primary || '#10b981';
  const secondary = colors?.secondary || '#047857';
  const bg = colors?.background || '#09090b';
  const cardBg = colors?.card || '#18181b';
  const textColor = bg === '#fafafa' ? '#09090b' : '#fafafa';

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
      `\n\n💰 *Total: $${cartTotal}*\n\n📲 Enviado desde StandMX Scan-to-Order`;
    
    const encodedText = encodeURIComponent(text);
    const whatsappNumber = content.whatsapp || '521550000000'; // Default test number
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <div 
      className="min-h-full w-full flex flex-col items-center py-[5%] px-4 overflow-y-auto custom-scrollbar relative"
      style={{ backgroundColor: bg, color: textColor }}
    >
      {/* Botón Flotante del Carrito (Solo para Menú) */}
      {(type === 'Menu' || type === 'menu') && cartCount > 0 && (
        <button 
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 z-[60] p-4 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce hover:scale-105 transition-transform"
          style={{ background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`, color: '#fff' }}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-bold text-sm">{cartCount} items</span>
        </button>
      )}

      {/* Modal del Carrito */}
      {showCart && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-zinc-900 rounded-[32px] p-6 shadow-2xl animate-fade-in border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex gap-2 items-center">
                <ShoppingCart className="w-5 h-5 text-emerald-400" /> Mi Pedido
              </h3>
              <button 
                onClick={() => setShowCart(false)} 
                className="p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto space-y-4 mb-6 custom-scrollbar pr-2">
              {Object.entries(cart).map(([itemName, qty]) => {
                const item = content.items.find((i: any) => i.name === itemName);
                return (
                  <div key={itemName} className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{itemName}</span>
                      <span className="text-[10px] text-emerald-400">${item?.price} u.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => removeFromCart(itemName)} className="p-1 rounded-md bg-white/5 transition-colors"><Minus className="w-3.5 h-3.5"/></button>
                      <span className="text-sm font-mono font-bold text-white">{qty}</span>
                      <button onClick={() => addToCart(itemName)} className="p-1 rounded-md bg-white/5 transition-colors"><Plus className="w-3.5 h-3.5"/></button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/5 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm font-medium">Total a pagar:</span>
                <span className="text-2xl font-black text-white">$ {cartTotal}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full py-4 rounded-2xl font-black text-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl"
                style={{ background: primary }}
              >
                Confirmar y Pedir por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      <div 
        className="w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-black/5"
        style={{ backgroundColor: cardBg }}
      >
        {/* Banner/Header */}
        <div 
          className="h-32 w-full flex items-center justify-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)` }}
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
          <h1 className="relative z-10 text-2xl font-bold text-white tracking-tight text-center px-4">
            {name}
          </h1>
        </div>

        {/* Cuerpos Condicionales */}
        <div className="p-6 flex flex-col items-center">
          
          {(type === 'vCard' || type === 'vcard') && (
            <VCardView content={content} colors={{ primary, bg, cardBg }} />
          )}

          {(type === 'Menu' || type === 'menu') && (
            <div className="w-full relative z-10 -mt-2 pt-2">
              {content.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-black/5 last:border-0 hover:bg-black/5 transition-colors px-1 rounded-md">
                  <div className="flex flex-col gap-0.5 max-w-[60%]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{item.name}</span>
                      {item.badge && <span className="text-[8px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-400 text-black">{item.badge}</span>}
                    </div>
                    {item.description && <span className="text-[10px] opacity-50 line-clamp-1">{item.description}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm mr-2" style={{ color: primary }}>${item.price}</span>
                    <button 
                      onClick={() => addToCart(item.name)}
                      className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all text-emerald-400 group"
                    >
                      <Plus className="w-4 h-4 group-active:scale-125" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                className="w-full mt-8 py-3.5 rounded-2xl font-black text-white shadow-lg transition-all hover:opacity-90 active:scale-95 flex justify-center gap-2 items-center text-xs uppercase tracking-widest"
                style={{ background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)` }}
                onClick={() => {
                  if (cartCount > 0) setShowCart(true);
                  else handleCheckout();
                }}
              >
                {cartCount > 0 ? 'Ver Mi Carrito' : 'Consultas por WhatsApp'} <Smartphone className="w-4 h-4"/>
              </button>
            </div>
          )}

        </div>
      </div>
      
      <div className="mt-8 mb-4 text-[10px] font-medium opacity-50 flex items-center gap-2">
        <QrCode className="w-3.5 h-3.5" />
        StandMX Digital Identity
      </div>
    </div>
  );
}

function VCardView({ content, colors }: any) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-20 h-20 rounded-full -mt-16 border-4 shadow-lg mb-4 flex items-center justify-center relative z-20"
        style={{ backgroundColor: colors.cardBg, borderColor: colors.bg }}>
        <span className="text-3xl">📇</span>
      </div>
      
      <p className="font-bold text-lg text-center">{content.displayName || 'Sin nombre'}</p>
      <p className="font-medium text-sm text-center opacity-80" style={{ color: colors.primary }}>
        {content.title || 'Especialista'}
      </p>
      
      {content.bio && (
        <p className="text-xs opacity-60 text-center mt-3 mb-6 line-clamp-3">
          {content.bio}
        </p>
      )}
      
      <div className="w-full flex flex-col gap-2.5 mt-2">
        {content.phone && <ContactBtn icon={Phone} label="Llamar" href={`tel:${content.phone}`} color={colors.primary} />}
        {content.whatsapp && <ContactBtn icon={Smartphone} label="WhatsApp" href={`https://wa.me/${content.whatsapp}`} color={colors.primary} />}
        {content.email && <ContactBtn icon={Mail} label="Enviar Correo" href={`mailto:${content.email}`} color={colors.primary} />}
        
        {content.socialLinks?.map((link: any, i: number) => (
          <Link 
            key={i} href={link.url || '#'}
            className="w-full py-2.5 rounded-xl font-semibold text-xs text-center transition-all hover:brightness-110 active:scale-[0.98] border border-white/5"
            style={{ backgroundColor: colors.primary, color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            {link.platform || 'Link'}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ContactBtn({ icon: Icon, label, href, color }: any) {
  return (
    <a 
      href={href} 
      className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
    >
      <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}20`, color: color }}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs font-bold text-zinc-300">{label}</span>
    </a>
  );
}
