// Convert decimal time (e.g., 2.56) to total minutes (e.g., 176)
function decimalToMinutes(decimal) {
    let isNegative = decimal < 0; // Track if the decimal time is negative
    decimal = Math.abs(decimal); // Work with positive values for calculation

    let hours = Math.floor(decimal); // Extract the integer part (hours)
    let minutes = Math.round((decimal - hours) * 100); // Extract the decimal part (minutes)

    // Calculate total minutes and apply the negative sign if necessary
    let totalMinutes = (hours * 60) + minutes;
    return isNegative ? -totalMinutes : totalMinutes;
}

// Convert total minutes (e.g., 176) back to decimal time (e.g., 2.56)
function minutesToDecimal(totalMinutes) {
    let isNegative = totalMinutes < 0; // Track if the total minutes are negative
    totalMinutes = Math.abs(totalMinutes); // Work with positive values for calculation

    let hours = Math.floor(totalMinutes / 60); // Extract hours
    let minutes = totalMinutes % 60; // Extract remaining minutes

    // Format the result with proper handling of negative values
    let result = `${isNegative ? '-' : ''}${hours}.${minutes < 10 ? '0' : ''}${minutes}`;
    return parseFloat(result); // Convert the formatted string back to a number
}

// Add multiple decimal times entered by the user
function addTimes() {
    let input = document.getElementById("addInput").value; // Get user input
    let numbers = input.split("+").map(x => x.trim()); // Split input by "+" and remove spaces

    try {
        let totalMinutes = numbers.reduce((sum, num) => sum + decimalToMinutes(parseFloat(num)), 0); // Add all numbers
        let result = minutesToDecimal(totalMinutes); // Convert result back to decimal format
        document.getElementById("addResult").textContent = "Total Time: " + result; // Display result
    } catch {
        document.getElementById("addResult").textContent = "Invalid input. Please enter decimal times correctly."; // Handle errors
    }
}

// Subtract multiple decimal times entered by the user
function subtractTimes() {
    let input = document.getElementById("subInput").value; // Get user input
    let numbers = input.split("-").map(x => x.trim()); // Split input by "-" and remove spaces

    try {
        let totalMinutes = decimalToMinutes(parseFloat(numbers[0])); // Convert first number to minutes
        for (let i = 1; i < numbers.length; i++) {
            totalMinutes -= decimalToMinutes(parseFloat(numbers[i])); // Subtract each number
        }
        let result = minutesToDecimal(totalMinutes); // Convert result back to decimal format
        document.getElementById("subResult").textContent = "Resulting Time: " + result; // Display result
    } catch {
        document.getElementById("subResult").textContent = "Invalid input. Please enter decimal times correctly."; // Handle errors
    }
}
