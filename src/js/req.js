11import axios from "axios";


const ReqHost = "https://labapi.nloli.xyz/tako_web/"


export async function axiosGet(url, data) {
    return new Promise((resolve, reject) => {
        axios.get(ReqHost + url, data).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

export async function axiosPost(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(ReqHost + url, data).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}