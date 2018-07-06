import Vue from 'vue'
import Cookies from 'js-cookie'
import VueI18n from 'vue-i18n'
import enLang from './en'
import zhLang from './zh'

Vue.use(VueI18n)

const message = {
    zh: zhLang,
    en: enLang
}

const i18n = new VueI18n({
    locale: Cookies.get('language') || 'en',
    messages: message
})

export default i18n