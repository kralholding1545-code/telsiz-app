// Netlify Function: kullanıcı için imzalı bir LiveKit erişim tokenı üretir.
// API Key/Secret asla frontend'e gönderilmez, sadece burada (sunucu tarafında) kullanılır.

const { AccessToken } = require('livekit-server-sdk');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { room, identity } = JSON.parse(event.body || '{}');

    if (!room || !identity) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'room ve identity zorunlu' }),
      };
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Sunucu yapılandırması eksik (LIVEKIT_API_KEY / LIVEKIT_API_SECRET)' }),
      };
    }

    // İsim çakışmalarını önlemek için identity'ye kısa bir rastgele ek koyuyoruz.
    const uniqueIdentity = `${identity}-${Math.random().toString(36).slice(2, 7)}`;

    const at = new AccessToken(apiKey, apiSecret, {
      identity: uniqueIdentity,
      name: identity,
      ttl: '6h',
    });

    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const jwt = await at.toJwt();

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: jwt, identity: uniqueIdentity }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Token üretilemedi', detail: String(err) }),
    };
  }
};
