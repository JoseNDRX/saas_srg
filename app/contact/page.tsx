'use client';

import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simular envío
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-screen w-full bg-background py-20 px-4 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(0,201,177,0.08),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10">
          
          {/* Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
                Hablemos de tu <br />
                <span className="gradient-text-standmx">Presencia Digital</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
                ¿Tienes dudas sobre nuestros planes o necesitas una solución personalizada? Nuestro equipo está listo para ayudarte.
              </p>
            </div>

            <div className="space-y-6">
              <ContactCard 
                icon={Mail} 
                title="Correo Electrónico" 
                value="hola@standmx.com" 
                href="mailto:hola@standmx.com"
                color="text-blue-500"
              />
              <ContactCard 
                icon={MessageSquare} 
                title="WhatsApp Business" 
                value="+52 55 1234 5678" 
                href="https://wa.me/525512345678"
                color="text-emerald-500"
              />
              <ContactCard 
                icon={Phone} 
                title="Teléfono Directo" 
                value="800 STAND MX" 
                href="tel:8007826369"
                color="text-primary"
              />
            </div>

            <div className="p-8 rounded-[32px] glass border border-border bg-primary/5">
              <h4 className="font-bold text-foreground mb-2">Horario de Atención</h4>
              <p className="text-sm text-muted-foreground">Lunes a Viernes: 9:00 AM — 6:00 PM (CDMX)</p>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-[40px] p-8 md:p-12 border border-border shadow-2xl relative"
          >
            {submitted ? (
              <div className="py-20 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/10">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">¡Mensaje Recibido!</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">
                  Gracias por contactarnos. Un asesor se pondrá en contacto contigo en menos de 24 horas hábiles.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-sm font-bold text-primary hover:underline transition-all"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nombre</label>
                    <input required type="text" placeholder="Tu nombre" className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                    <input required type="email" placeholder="tu@email.com" className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asunto</label>
                  <select className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer">
                    <option>Consulta General</option>
                    <option>Soporte Técnico</option>
                    <option>Ventas / Planes Enterprise</option>
                    <option>Reportar un problema</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mensaje</label>
                  <textarea required rows={4} placeholder="¿En qué podemos ayudarte?" className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" />
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-foreground text-background font-bold py-5 rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-foreground/10 flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Enviar Solicitud</span>
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

function ContactCard({ icon: Icon, title, value, href, color }: any) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-5 p-2 pr-6 rounded-3xl hover:bg-muted transition-all group"
    >
      <div className={`w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">{title}</p>
        <p className="text-sm font-bold text-foreground">{value}</p>
      </div>
    </a>
  );
}
