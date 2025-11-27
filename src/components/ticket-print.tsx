interface Passenger {
  id: string;
  name: string;
  seat?: {
    id: string;
    price: number;
  };
}

interface BookingData {
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  flightNumber: string;
  pnr: string;
  bookingId: string;
  passengers: Passenger[];
}

interface TicketPrintProps {
  booking: BookingData;
  passenger: Passenger;
}

export function TicketPrint({ booking, passenger }: TicketPrintProps) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      color: '#0a0a0a',
      fontFamily: 'sans-serif',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#171717',
            marginBottom: '4px'
          }}>
            {booking.to}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Destination
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#171717',
          fontWeight: 'bold'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#171717',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            color: '#ffffff'
          }}>
            ✈
          </div>
          <span>SkyRoute</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            Passenger
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#171717'
          }}>
            {passenger.name}
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            Flight
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#171717'
          }}>
            {booking.flightNumber}
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            Date
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#171717'
          }}>
            {new Date(booking.departureTime).toLocaleDateString()}
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            Boarding Time
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#171717'
          }}>
            {booking.departureTime} - {booking.arrivalTime}
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            From
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#171717'
          }}>
            {booking.from} - {booking.to}
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            Seat
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#171717'
          }}>
            {passenger.seat?.id || '--'}
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            PNR
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#171717'
          }}>
            {booking.pnr || '--'}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '12px',
        borderRadius: '6px',
        textAlign: 'center',
        fontFamily: 'monospace',
        letterSpacing: '2px',
        fontSize: '16px',
        color: '#171717',
        marginTop: '16px'
      }}>
        {booking.bookingId}
      </div>
    </div>
  );
}
