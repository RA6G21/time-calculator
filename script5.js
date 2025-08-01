// Convert decimal time (e.g., 2.56) to total minutes (e.g., 176)
function decimalToMinutes(decimal) {  
    let isNegative = decimal < 0;  
    decimal = Math.abs(decimal);  

    let hours = Math.floor(decimal);  
    let minutes = Math.round((decimal - hours) * 100);  

    let totalMinutes = (hours * 60) + minutes;  
    return isNegative ? -totalMinutes : totalMinutes;  
}  

// Convert total minutes (e.g., 176) back to HH:MM format
function minutesToTime(totalMinutes) {  
    let isNegative = totalMinutes < 0;  
    totalMinutes = Math.abs(totalMinutes);  

    let hours = Math.floor(totalMinutes / 60);  
    let minutes = totalMinutes % 60;  

    let result = `${isNegative ? '-' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;  
    return result;  
}  

// Add multiple decimal times entered by the user  
function addTimes() {  
    let input = document.getElementById("addInput").value;  
    let numbers = input.split("+").map(x => x.trim());  

    try {  
        let totalMinutes = numbers.reduce((sum, num) => sum + decimalToMinutes(parseFloat(num)), 0);  
        let result = minutesToTime(totalMinutes);  
        document.getElementById("addResult").textContent = "Total Time: " + result;  
    } catch {  
        document.getElementById("addResult").textContent = "Invalid input. Please enter decimal times correctly.";  
    }  
}  

// Subtract multiple decimal times entered by the user  
function subtractTimes() {  
    let input = document.getElementById("subInput").value;  
    let numbers = input.split("-").map(x => x.trim());  

    try {  
        let totalMinutes = decimalToMinutes(parseFloat(numbers[0]));  
        for (let i = 1; i < numbers.length; i++) {  
            totalMinutes -= decimalToMinutes(parseFloat(numbers[i]));  
        }  
        let result = minutesToTime(totalMinutes);  
        document.getElementById("subResult").textContent = "Resulting Time: " + result;  
    } catch {  
        document.getElementById("subResult").textContent = "Invalid input. Please enter decimal times correctly.";  
    }  
}

// Add Enter key functionality
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("addInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addTimes();
            gtag('event', 'calculate', { operation: 'addition' });
        }
    });

    document.getElementById("subInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            subtractTimes();
            gtag('event', 'calculate', { operation: 'subtraction' });
        }
    });
});