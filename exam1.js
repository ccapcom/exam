const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Input strs: ', function (inputdata) {
    if (checkJSON(inputdata)) {
        let temp = JSON.parse(inputdata);
        if (Array.isArray(temp)) {
            if ((temp.length >= 1) && (temp.length <= 200)) {
                let checklength = temp.filter((el) => {
                    return el.length > 200
                });
                if (checklength.length > 0) {
                    console.log("Some input length is not between in range [0, 200]. Please try agian.");
                    rl.close();
                } else {
                    let result = prefix(temp);
                    console.log(`Output: ${result}`);
                }
            } else {
                console.log("Input length is not between in range [1, 200]. Please try agian.");
                rl.close();
            }
        } else {
            console.log("Input is not Array. Please try agian.");
            rl.close();
        }
    } else {
        console.log("Input can not to JSON parse. Please try agian.");
        rl.close();
    }
});

rl.on('close', function () {
    console.log('\nBYE BYE !!!');
    process.exit(0);
});

function checkJSON(input) {
    try {
        JSON.parse(input);
    } catch (e) {
        return false;
    }
    return true;
}

function prefix(input) {
    let i = 0;
    while (input[0][i] && input.every(w => w[i] === input[0][i])) {
        i++;
    }
    return input[0].substr(0, i);
}