export const SET_PROVIDR = 'SET_PROVIDERS';

export const setProviders = providers => dispatch => {
  dispatch({
    type: SET_PROVIDR,
    payload: providers,
  });
};
