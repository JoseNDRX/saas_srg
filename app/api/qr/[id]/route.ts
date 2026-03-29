import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Smart QR Redirect Handler
 * GET /api/qr/[id]
 *
 * Looks up the QR code record, logs the analytics scan,
 * and issues a 301 redirect to the current microsite URL.
 *
 * The 301 redirect preserves the QR code itself while allowing
 * the underlying URL to change when a user upgrades their plan.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return new NextResponse('QR ID required', { status: 400 });
  }

  // 1. Look up the QR code (include microsite_id for analytics)
  const { data: qr, error } = await supabase
    .from('qr_codes')
    .select('microsite_id, current_url, redirect_url, is_301_redirect')
    .eq('id', id)
    .single();

  if (error || !qr) {
    return new NextResponse('QR code not found', { status: 404 });
  }

  // 2. Log analytics (fire-and-forget)
  const userAgent = request.headers.get('user-agent');
  const referrer = request.headers.get('referer');
  void supabase
    .from('qr_analytics')
    .insert({
      microsite_id: qr.microsite_id,
      scanned_at: new Date().toISOString(),
      user_agent: userAgent,
      referrer,
    })
    .then(() => {/* intentionally fire-and-forget */});

  // 3. Determine target URL
  const targetUrl = qr.redirect_url ?? qr.current_url;

  // 4. 301 redirect (permanent — cached by browsers and scan history)
  return NextResponse.redirect(targetUrl, {
    status: qr.is_301_redirect ? 301 : 302,
  });
}

