import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from './App';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    html, body, #root, #root > div {
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      overflow: auto;
    }
  `;
  document.head.appendChild(style);
}

registerRootComponent(App);