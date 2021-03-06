import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [
      {
        imageUrl: 'https://media.timeout.com/images/102920649/image.jpg',
        id: 'asdasfrq12312',
        title: 'Meetup in New York',
        date: new Date(),
        location: 'New York',
        description: 'New York, New York'
      },
      {
        imageUrl: 'https://theflightfinder.com/wp-content/uploads/2017/12/amsterdam2-696x392.jpg',
        id: 'asdasrqdsad12',
        title: 'Meetup in Amsterdam',
        date: new Date(),
        location: 'Paris',
        description: 'It\'s Paris!'
      }
    ],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    loadMeetups ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
        .then((data) => {
          const meetups = []
          const obj = data.val()
          for (let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              creatorId: obj[key].creatorId
            })
          }
          commit('setLoadedMeetups', meetups)
          commit('setLoading', false)
        })
        .catch((error) => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    createMeetup ({ commit, getters }, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      firebase.database().ref('meetups').push(meetup)
        .then((data) => {
          const key = data.key
          // console.log(key)
          commit('createMeetup', {
            ...meetup,
            id: key
          })
        })
        .catch((error) => {
          console.log(error)
        })
      // Retach out to firebase and store it
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(
              user => {
                commit('setLoading', false)
                const newUser = {
                  id: user.uid,
                  registeredMeetups: []
                }
                commit('setUser', newUser)
              }
            )
            .catch(
              error => {
                commit('setLoading', false)
                commit('setError', error)
                console.log(error)
              }
            )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredMeetups: []
            }
            commit('setUser', newUser)
          })
          .catch(
              error => {
                commit('setLoading', false)
                commit('setError', error)
                console.log(error)
              }
          )
    },
    clearError ({commit}) {
      commit('clearError')
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', { id: payload.uid, registeredMeetups: [] })
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    },
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
})
