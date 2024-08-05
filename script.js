const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDispaly = document.querySelector("[data-lengthNumber]")
const passwordDispaly = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generate-password")
const allCheckbox = document.querySelectorAll("input[type=checkbox]")

let password = ""
let passwordLength = 10;
let checkCount = 0;

handleSlider()
// set passwordLength

setIndicator('#ccc')

function handleSlider() {
    inputSlider.value = passwordLength
    lengthDispaly.innerText = passwordLength;
    const min = inputSlider.min
    const max = inputSlider.max
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider()
})


const symbols = '!~`@#$%^&*()_-+={[}}]|\:;"<,>.?/';


function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function generateRandomNumber() {
    return getRndInt(0, 9)
}
function generateUpperCase() {
    return String.fromCharCode(getRndInt(65, 91))
}
function generateLowerCase() {
    return String.fromCharCode(getRndInt(97, 123))
}
function generateSymbol() {
    const rndNum = getRndInt(0, symbols.length)
    return symbols.charAt(rndNum);
}


function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}


function calcStrength() {
    let hasUpper = false;
    let hasLower = false
    let hasNum = false
    let hasSym = false
    if (lowercaseCheck.checked) hasLower = true;
    if (uppercaseCheck.checked) hasUpper = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;


    if (hasNum && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0")
    } else if (
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6
    ) {
        setIndicator("#ff0")
    }
    else (
        setIndicator("#f00")
    )
}


function handleCheckBoxChange() {
    checkCount = 0;
    allCheckbox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    })


    //special condtion
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider()
    }

}
allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})


async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDispaly.value)
        copyMsg.innerText = "copied"
    } catch (e) {
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active")

    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000)
}


copyBtn.addEventListener('click', () => {
    if (passwordDispaly.value) {
        copyContent();
    }
})


function shufflePassword(array){
    //fisher yates method
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp;
    }
    let str = ""
    array.forEach((el) => (str += el))
    return str;
}

generateBtn.addEventListener('click', () => {
    //none of checkbox are selected 
    if(checkCount <= 0) return;


    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider()
    }


    //let start to create a new password
    password =""

    //let put the element mentiond in element

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase()
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase()
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber()
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol()
    // }

    let funcArr = []

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase) 

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase) 

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber) 

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol) 


    //cumposaryfunction

    for(let i =0; i < funcArr.length; i++){
        password += funcArr[i]();   
    }

    for(let i =0; i < passwordLength-funcArr.length; i++){
        let randIndex = getRndInt(0, funcArr.length)
        password += funcArr[randIndex]();
    }

    //shuffle

    password = shufflePassword(Array.from(password));

    passwordDispaly.value = password;
    calcStrength()

})