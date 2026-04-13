import {SET_PROVIDR} from '../Actions/actions';
const initialState = {
  providers: [],
};

function ProvidersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PROVIDR:
      return {...state, providersa: action.payload};
    default:
      return state;
  }
}

export default ProvidersReducer;
