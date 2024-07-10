// src/stores/themeStore.js
import { ref } from 'vue'


// window.sessionStorage.getItem('userInfo')


export const GetUserInfo = () => {
    return JSON.parse(window.sessionStorage.getItem('userInfo'))
}

export const SetUserInfo = (userInfo) => {
    window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export const RemoveUserInfo = () => {
    window.sessionStorage.removeItem('userInfo')
}


// ctoken

export const GetCtoken = () => {
    return window.sessionStorage.getItem('ctoken')
}

export const SetCtoken = (ctoken) => {
    window.sessionStorage.setItem('ctoken', ctoken)
}

export const RemoveCtoken = () => {
    window.sessionStorage.removeItem('ctoken')
}