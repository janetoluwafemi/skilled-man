import { CommonActions } from '@react-navigation/native';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  if (_navigator) {
    _navigator.navigate(routeName, params);
  }
}

function goBack() {
  if (_navigator && _navigator.canGoBack()) {
    _navigator.dispatch(CommonActions.goBack());
  }
}

export default {
  navigate,
  setTopLevelNavigator,
  goBack,
};