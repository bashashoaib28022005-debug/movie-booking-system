const seatGrid = document.getElementById("seat-grid");

let selectedSeats = [];

const TOTAL_ROWS = 10;
const SEATS_PER_ROW = 16;


// CREATE SCREEN
const screen = document.createElement("div");
screen.className = "screen-bar";
seatGrid.appendChild(screen);


// CREATE SEATS
for(let row=0; row<TOTAL_ROWS; row++){

    const rowDiv = document.createElement("div");
    rowDiv.className = "seat-row";

    for(let seat=0; seat<SEATS_PER_ROW; seat++){

        const seatBtn = document.createElement("div");

        seatBtn.className = "seat";

        seatBtn.dataset.id = row+"-"+seat;

        seatBtn.onclick = () => toggleSeat(seatBtn);

        rowDiv.appendChild(seatBtn);
    }

    seatGrid.appendChild(rowDiv);
}


// TOGGLE FUNCTION
function toggleSeat(seat){

    const id = seat.dataset.id;

    if(selectedSeats.includes(id)){

        selectedSeats =
            selectedSeats.filter(s=>s!==id);

        seat.classList.remove("selected");

    }else{

        selectedSeats.push(id);

        seat.classList.add("selected");
    }

    console.log(selectedSeats);
}
