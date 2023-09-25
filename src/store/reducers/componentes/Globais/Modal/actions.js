export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'

export const openModal = (payload) =>({
    type: OPEN_MODAL,
    payload,
})

export const closeModal = (payload) => ({
  type: CLOSE_MODAL,
  payload,
})