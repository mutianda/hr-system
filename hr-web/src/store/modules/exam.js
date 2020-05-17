
import examlist from '@/mock/examlist'

const state = {
  examlist: examlist
}

const mutations = {
  SET_EXAMLIST: (state, exam) => {
    state.examlist.push(exam)
  }
}

const actions = {

  addExam({ commit }, exam) {
    return new Promise((resolve, reject) => {
      commit('SET_EXAMLIST', exam)
      const data = {
        status: true
      }
      debugger
      resolve(data)
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
