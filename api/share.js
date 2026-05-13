const escape = (str) =>
    String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

export default function handler(req, res) {
    const { anchor, title, desc, image, openEpisode } = req.query;

    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host  = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${proto}://${host}`;

    const ogTitle = escape(title ? `${title} · Creamos Juntos` : 'Creamos Juntos');
    const ogDesc  = escape(desc  || 'Una comunidad que crece en fe.');
    const ogImage = image && image.startsWith('/') && !image.includes('://')
        ? `${baseUrl}${image}`
        : `${baseUrl}/apple-touch-icon.png`;

    let appUrl;
    if (openEpisode) {
        appUrl = `${baseUrl}/#/recursos?openEpisode=${encodeURIComponent(openEpisode)}`;
    } else if (anchor) {
        appUrl = `${baseUrl}/#/?anchor=${encodeURIComponent(anchor)}`;
    } else {
        appUrl = baseUrl;
    }

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${ogTitle}</title>

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:site_name"   content="Creamos Juntos" />
  <meta property="og:title"       content="${ogTitle}" />
  <meta property="og:description" content="${ogDesc}" />
  <meta property="og:image"       content="${ogImage}" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type"   content="image/jpeg" />
  <meta property="og:url"         content="${appUrl}" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${ogTitle}" />
  <meta name="twitter:description" content="${ogDesc}" />
  <meta name="twitter:image"       content="${ogImage}" />

  <!-- Redirect humanos al SPA -->
  <meta http-equiv="refresh" content="0;url=${appUrl}" />
  <script>window.location.replace("${appUrl}");</script>
</head>
<body></body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(html);
}
