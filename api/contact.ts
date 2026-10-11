import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ContactPayload {
  name: string;
  email: string;
  currentSite?: string;
  scope: string;
  consent: boolean;
  turnstileToken?: string;
  _hp_company?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  // 1. Origin verification
  const origin = req.headers['origin'] || req.headers['referer'] || '';
  const isProd = process.env.VERCEL_ENV === 'production';

  if (isProd) {
    const isAllowedOrigin = typeof origin === 'string' && (
      origin.startsWith('https://www.protorevdigital.com') ||
      origin.startsWith('https://protorevdigital.com')
    );
    if (!isAllowedOrigin) {
      return res.status(403).json({ ok: false, message: 'Forbidden origin' });
    }
  }

  const body: ContactPayload = req.body || {};

  // 2. Honeypot check: silently drop bots
  if (body._hp_company && body._hp_company.trim().length > 0) {
    return res.status(200).json({ ok: true, status: 'Payload received' });
  }

  // 3. Payload validation
  if (!body.name || !body.email || !body.scope || !body.consent) {
    return res.status(400).json({
      ok: false,
      message: 'Missing required fields or consent confirmation'
    });
  }

  // 4. Cloudflare Turnstile Verification
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
  const token = body.turnstileToken;

  if (token && turnstileSecret) {
    try {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: token,
          remoteip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || ''
        })
      });

      const verifyData = await verifyRes.json() as { success: boolean };
      if (!verifyData.success && isProd) {
        return res.status(400).json({
          ok: false,
          message: 'Security token verification failed. Please try again.'
        });
      }
    } catch (err) {
      if (isProd) {
        return res.status(500).json({
          ok: false,
          message: 'Security validation service error'
        });
      }
    }
  }

  // 5. Forward to n8n Webhook
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  const n8nSecret = process.env.N8N_WEBHOOK_SECRET;

  if (n8nUrl) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (n8nSecret) {
        headers['X-Webhook-Secret'] = n8nSecret;
      }

      const forwardRes = await fetch(n8nUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          source: 'www.protorevdigital.com',
          name: body.name,
          email: body.email,
          currentSite: body.currentSite || null,
          scope: body.scope,
          consent: body.consent,
          timestamp: new Date().toISOString()
        })
      });

      const forwardData = await forwardRes.json().catch(() => null) as { executionId?: string } | null;

      if (forwardRes.ok) {
        return res.status(200).json({
          ok: true,
          executionId: forwardData?.executionId || undefined
        });
      } else {
        return res.status(502).json({
          ok: false,
          message: 'Automated webhook is paused. Please send your enquiry directly to hello@protorevdigital.com'
        });
      }
    } catch (err) {
      return res.status(502).json({
        ok: false,
        message: 'Automated webhook is paused. Please send your enquiry directly to hello@protorevdigital.com'
      });
    }
  }

  // If n8n URL is not configured (e.g. in development sandbox)
  return res.status(200).json({
    ok: true,
    executionId: 'SIMULATED_INGRESS_QUEUE',
    message: 'Payload validated in simulation mode'
  });
}
