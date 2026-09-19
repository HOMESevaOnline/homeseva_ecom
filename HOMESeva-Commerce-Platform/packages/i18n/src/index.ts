import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    welcome: 'Welcome to HOMESeva Online',
    // Add more English translations here
  },
  od: {
    welcome: 'HOMESeva Online କୁ ସ୍ବାଗତ',
    // Add more Odia translations here
  },
};

const i18n = createI18n({
  locale: 'en', // set locale
  messages, // set locale messages
});

export default i18n;