module.exports = ({ config }) => {
  const android = { ...config.android };
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (googleMapsApiKey) {
    android.config = {
      ...android.config,
      googleMaps: {
        ...android.config?.googleMaps,
        apiKey: googleMapsApiKey,
      },
    };
  } else {
    console.warn(
      'GOOGLE_MAPS_API_KEY is not set; Android map tiles will not load in this build.'
    );
  }

  return { ...config, android };
};
