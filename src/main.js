import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.filter('date', DateFilter)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyBKpa7GeFGNJYCWoXr6NpT_O11EMCDupno',
      authDomain: 'devmeetup-d48a3.firebaseapp.com',
      databaseURL: 'https://devmeetup-d48a3.firebaseio.com',
      projectId: 'devmeetup-d48a3',
      storageBucket: ''
    })
  }
})
