import { atom } from 'jotai'

const appPage = atom('useCases')
const appDevice = atom(null)
const appCurrentCall = atom(null)

export { appPage, appDevice, appCurrentCall}