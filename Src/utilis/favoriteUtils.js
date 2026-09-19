export const getProviderId = provider =>
  String(provider?.provider_id ?? provider?.user_id ?? provider?.id ?? '');

export const isActiveFavorite = favorite =>
  String(favorite?.status ?? favorite?.favorite_status ?? '1') !== '0';

export const hasActiveFavorite = (favorites, provider) => {
  const providerId = getProviderId(provider);

  if (!providerId) {
    return false;
  }

  return favorites.some(
    favorite =>
      isActiveFavorite(favorite) && getProviderId(favorite) === providerId,
  );
};
