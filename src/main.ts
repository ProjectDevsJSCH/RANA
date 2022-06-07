import { createApp } from 'vue';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import '@/assets/styles/index.css';
import '@/assets/styles/_globals.scss';
import '@/assets/styles/_mixins.scss';

createApp(App).use(store).use(router).mount('#app');
