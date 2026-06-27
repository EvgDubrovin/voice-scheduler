export function getGoogleAccessToken() {
  return new Promise((resolve, reject) => {
    const initTokenClient = window.google?.accounts?.oauth2?.initTokenClient;

    if (!initTokenClient) {
      reject(new Error('Google OAuth client is not available'));
      return;
    }

    const tokenClient = initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope:
        'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
      callback: (response) => {
        if (response?.access_token) {
          resolve(response.access_token);
        } else {
          reject(new Error('Failed to obtain Google access token'));
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: '' });
  });
}
