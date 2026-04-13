export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace('/api/chart/', '');
  
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-allow-headers': '*',
        'access-control-max-age': '86400',
      }
    });
  }

  const yahooUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(path) + '?' + url.searchParams.toString();
  
  try {
    const resp = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const data = await resp.text();
    return new Response(data, {
      headers: {
        'access-control-allow-origin': '*',
        'content-type': 'application/json',
        'cache-control': 'public, max-age=60'
      }
    });
  } catch(e) {
    return new Response(JSON.stringify({error: e.message}), {
      status: 500,
      headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' }
    });
  }
}