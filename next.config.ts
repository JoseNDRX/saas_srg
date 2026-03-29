import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  turbopack: {
    root: ".",
  },
  // @ts-ignore
  allowedDevOrigins: [
    '192.168.1.131', 'demo.192.168.1.131', 'menu.192.168.1.131',
    'localhost', 'demo.localhost', 'menu.localhost', '127.0.0.1',
    'pectic-alla-cerous.ngrok-free.dev', '*.ngrok-free.app', '*.ngrok-free.dev',
    'saassrg2026.vercel.app', 'saas-srg.netlify.app'
  ],
};

export default nextConfig;
