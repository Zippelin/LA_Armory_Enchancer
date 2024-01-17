import {SOME_TEGEX} from "./constants/regex"
import {someCoolFunc} from "./loaders/loader"

function start(): void {
    let work = someCoolFunc('abc')



    fetch(
        'https://example.com'
    ).then((val) => {
        callbackify(getSome(val))
    })


    console.log(SOME_TEGEX, work);
    
}

function getSome(val: Response): Number {
    return val.status
}

function callbackify(bum: Number) {
    console.log(bum);
    
}

start()