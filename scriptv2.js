function decimalToMinutes(decimal) {
    let hours = Math.floor(decimal);
    let minutes = Math.round((decimal - hours) * 100); // Ensure correct minutes
    return hours * 60 + minutes;
}

function minutesToDecimal(minutes) {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    return parseFloat(`${hours}.${mins < 10 ? "0" : ""}${mins}`); // Ensures hh.mm format
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
