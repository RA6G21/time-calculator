function decimalToMinutes(decimal) {
    let hours = Math.floor(decimal);
    let minutes = Math.round((decimal - hours) * 100);  
    return (hours * 60) + minutes;
}

function minutesToDecimal(totalMinutes) {
    let isNegative = totalMinutes < 0; // Track negative values
    totalMinutes = Math.abs(totalMinutes); // Work with positive values

    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;

    let result = `${isNegative ? '-' : ''}${hours}.${minutes < 10 ? '0' : ''}${minutes}`;
    return parseFloat(result);
}

function subtractTimes() {
    let input = document.getElementById("subInput").value;
    let numbers = input.split("-").map(x => x.trim());

    try {
        let totalMinutes = decimalToMinutes(parseFloat(numbers[0]));
        for (let i = 1; i < numbers.length; i++) {
            totalMinutes -= decimalToMinutes(parseFloat(numbers[i]));
        }
        let result = minutesToDecimal(totalMinutes);
        document.getElementById("subResult").textContent = "Resulting Time: " + result;
    } catch {
        document.getElementById("subResult").textContent = "Invalid input. Please enter decimal times correctly.";
    }
}

function addTimes() {
    let input = document.getElementById("addInput").value;
    let numbers = input.split("+").map(x => x.trim());

    try {
        let totalMinutes = numbers.reduce((sum, num) => sum + decimalToMinutes(parseFloat(num)), 0);
        let result = minutesToDecimal(totalMinutes);
        document.getElementById("addResult").textContent = "Total Time: " + result;
    } catch {
        document.getElementById("addResult").textContent = "Invalid input. Please enter decimal times correctly.";
    }
}
