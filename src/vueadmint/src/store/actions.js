import * as types from './mutation-types'

export const saveNewsList = ({commit}, newsList) => {
    commit(types.SET_LIST, newsList)
}