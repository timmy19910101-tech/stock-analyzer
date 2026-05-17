export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace('/api/sync/', '');

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, OPTIONS',
        'access-control-allow-headers': '*',
        'access-control-max-age': '86400',
      }
    });
  }

  if (context.request.method === 'GET') {
    const data = await context.env.STOCKS_KV.get(path);
    return new Response(data || '{"stocks":[]}', {
      headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' }
    });
  }

  if (context.request.method === 'POST') {
    const body = await context.request.text();
    await context.env.STOCKS_KV.put(path, body);
    return new Response('{"ok":true}', {
      headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405 });
}
