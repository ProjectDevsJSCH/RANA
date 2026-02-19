import { createApp } from 'vue';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';

import '@/assets/styles/index.css';
import '@/assets/styles/_globals.scss';
import '@/assets/styles/_mixins.scss';
import '@/assets/styles/_transitions.scss';

createApp(App)
  .use(router)
  .mount('#app');
