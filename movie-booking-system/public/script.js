// Seat and Snack Logic for ShoNova
const totalEl = document.getElementById("total");
let selectedSeats = [];
const seatPrice = 150;

// Update Total Amount
function updateTotal() {
    // Calculate seat price
    let total = selectedSeats.length * seatPrice;
    
    // Calculate snack prices (selecting all checked checkboxes with class 'snack')
    const checkedSnacks = document.querySelectorAll(".snack:checked");
    checkedSnacks.forEach(snack => {
        total += Number(snack.value);
    });
    
    // Display total
    if (totalEl) {
        totalEl.innerText = total;
    }
}

// Seat Selection Logic
document.querySelectorAll(".seat").forEach(seat => {
    seat.addEventListener("click", () => {
        if (seat.classList.contains("booked")) return;

        seat.classList.toggle("selected");
        const seatId = seat.innerText;

        if (selectedSeats.includes(seatId)) {
            selectedSeats = selectedSeats.filter(s => s !== seatId);
        } else {
            selectedSeats.push(seatId);
        }
        updateTotal();
    });
});

// Snack Selection Listener
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('snack')) {
        updateTotal();
    }
});

// Process Payment
function processPayment(method) {
    if (selectedSeats.length === 0) {
        alert("Machi, seats select pannu!");
        return;
    }
    
    alert(method + " Payment Successful!");
    
    // Save to LocalStorage for the ticket page
    localStorage.setItem("seats", selectedSeats.join(","));
    localStorage.setItem("total", totalEl.innerText);
    localStorage.setItem("ticketid", "SN" + Math.floor(Math.random() * 1000000));
    
    window.location.href = "ticket.html";
}