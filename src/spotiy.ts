const CLIENT_ID = 'bb19977389fe4cee9c166d6bd4c7ffa9';
const CLIENT_SECRET = 'aebe98118f4e4532945d7a1eb9584a0d';

let accessToken: string = '';

export const getAccessToken = async () => {
  if (accessToken) return accessToken;

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await result.json();
  accessToken = data.access_token;
  return accessToken;
};

export const searchTracks = async (query: string) => {
  const token = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data.tracks.items;
};
