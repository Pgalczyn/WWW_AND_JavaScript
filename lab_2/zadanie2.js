function sum(x,y) {
    return x+y;
}

// function sum_strings(a){
//     let sum = 0;
//     for(let value of a){
//         sum += parseInt(value);
//     }
// }

function sum_strings(a){
    return a.reduce((acc, num) =>{
        num = parseInt(num)
        if(!isNaN(num)){
            return acc += num;
        }
        return acc;
    },0)
}

function digits(s) {
    let sumEven = 0
    let sumOdd = 0

    for(let num of s) {
        num = Number(num)
        if (isNaN(num)) continue;
        if (num % 2 === 0){
            sumEven += num;
        }
        else
            sumOdd += num;
    }
    return[sumOdd,sumEven];
}

function isUpperCase(a){
    if(a == a.toUpperCase()){
        return true
    }
    return false
}

function letters(s){
    let lowerCase = 0;
    let upperCase = 0;

    for(let letter of s){
        if(!isNaN(Number(letter))) continue;
        if(isUpperCase(letter)){
            upperCase++;
        }
        else lowerCase++;
    }
    return [lowerCase,upperCase];
}
