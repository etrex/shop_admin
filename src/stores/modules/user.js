import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentRole: 'admin',
    userInfo: {
      name: 'Admin',
      avatar: ''
    }
  }),

  actions: {
    setRole(role) {
      this.currentRole = role
    }
  }
})