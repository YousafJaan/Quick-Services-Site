/**
 * Cloudflare Pages Serverless Function: /api/upload
 * Handles academic image uploads, validates MIME types, and returns structured metadata.
 */

export async function onRequestPost({ request }) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    // 1. Handle Multipart Form Data
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file || typeof file === 'string') {
        return new Response(JSON.stringify({ error: 'No file provided in form data' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'File size exceeds 5MB limit' }), {
          status: 413,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Check allowed MIME types
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return new Response(JSON.stringify({ error: 'Invalid file format. Only PNG, JPG, WebP allowed.' }), {
          status: 415,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const id = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

      return new Response(JSON.stringify({
        success: true,
        id,
        filename: file.name,
        size: file.size,
        type: file.type,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 2. Handle JSON with Base64 Payload
    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (!body.dataUrl && !body.base64) {
        return new Response(JSON.stringify({ error: 'Missing image payload' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const id = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      return new Response(JSON.stringify({
        success: true,
        id,
        title: body.title || 'Uploaded Research Image',
        type: body.type || 'image/webp',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify({ error: 'Unsupported Content-Type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
