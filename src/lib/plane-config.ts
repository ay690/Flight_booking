import type { Seat, SeatType } from "@/types";

const seatStructure: ({ type: SeatType; isOccupied: boolean } | null)[][] = [
  // 30 rows, 6 seats per row (A-F)
  ...Array(30).fill([
    { type: 'window', isOccupied: false }, { type: 'middle', isOccupied: false }, { type: 'aisle', isOccupied: false },
    null, // Aisle
    { type: 'aisle', isOccupied: false }, { type: 'middle', isOccupied: false }, { type: 'window', isOccupied: false },
  ])
];

// Marking some rows as exit rows
[10, 11].forEach(rowIdx => {
  seatStructure[rowIdx] = seatStructure[rowIdx].map(seat => (seat ? { ...seat, type: 'exit' } : null));
});


export const seatPricing = {
  window: 500,
  middle: 300,
  aisle: 400,
  exit: 700,
};

export const generateSeats = (): (Seat | null)[][] => {
  const seatLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  return seatStructure.map((row, rowIndex) => {
    let seatIndex = 0;
    return row.map((seatInfo) => {
      if (seatInfo === null) {
        return null; // Represents the aisle
      }
      
      const id = `${rowIndex + 1}${seatLabels[seatIndex]}`;
      seatIndex++;
      
      const isOccupied = Math.random() < 0.2;

      return {
        id,
        type: seatInfo.type,
        isOccupied: isOccupied,
        price: seatPricing[seatInfo.type],
      };
    });
  });
};
