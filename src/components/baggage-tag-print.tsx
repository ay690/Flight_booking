/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface Passenger {
  id: number;
  firstName: string;
  lastName: string;
  seat?: {
    id: string;
    price: number;
  };
}

interface BookingData {
  id: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime?: string;
  arrivalTime?: string;
  flightNumber?: string;
  pnr?: string;
  passengers: Passenger[];
  bags?: number;
  [key: string]: any; // For any additional properties
}

interface BaggageTagPrintProps {
  data: {
    passenger: Passenger & { name?: string }; // Allow name to be optional
    booking: Omit<BookingData, 'passengers'>;
    tagNumber: number;
  };
}

export const BaggageTagPrint: React.FC<BaggageTagPrintProps> = ({ data }) => {
  const { passenger, booking, tagNumber } = data;
  const { from, to, departureDate, departureTime, arrivalTime, flightNumber, pnr, id } = booking;
  
  // Use name if provided, otherwise combine firstName and lastName
  const passengerName = passenger.name || `${passenger.firstName || ''} ${passenger.lastName || ''}`.trim();
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    fontFamily: 'sans-serif',
    lineHeight: '1.5',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#1e40af',
    color: '#ffffff',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const contentStyle: React.CSSProperties = {
    padding: '16px',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    marginBottom: '12px',
  };

  const labelStyle: React.CSSProperties = {
    flex: '0 0 120px',
    color: '#4b5563',
    fontWeight: 500,
  };

  const valueStyle: React.CSSProperties = {
    flex: 1,
    color: '#1f2937',
  };

  const dividerStyle: React.CSSProperties = {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '16px 0',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ fontWeight: 'bold' }}>BAGGAGE TAG #{tagNumber}</div>
        <div style={{ fontSize: '0.875rem' }}>PNR: {pnr || '--'}</div>
      </div>
      
      <div style={contentStyle}>
        <div style={rowStyle}>
          <div style={labelStyle}>Passenger</div>
          <div style={valueStyle}>{passengerName}</div>
        </div>
        
        <div style={rowStyle}>
          <div style={labelStyle}>Flight</div>
          <div style={valueStyle}>
            PNR: {pnr || id || '--'} {flightNumber || 'N/A'} • {from} to {to}
          </div>
        </div>
        
        <div style={rowStyle}>
          <div style={labelStyle}>Date</div>
          <div style={valueStyle}>{departureDate}</div>
        </div>
        
        <div style={rowStyle}>
          <div style={labelStyle}>Departure</div>
          <div style={valueStyle}>{departureTime}</div>
        </div>
        
        <div style={rowStyle}>
          <div style={labelStyle}>Arrival</div>
          <div style={valueStyle}>{arrivalTime}</div>
        </div>
        
        <div style={dividerStyle} />
        
        <div style={rowStyle}>
          <div style={labelStyle}>Cabin Baggage</div>
          <div style={valueStyle}>1 x 7kg (max 14 x 9 x 10 in)</div>
        </div>
        
        <div style={rowStyle}>
          <div style={labelStyle}>Check-in Baggage</div>
          <div style={valueStyle}>1 x 23kg (max 62 in total dimensions)</div>
        </div>
      </div>
    </div>
  );
};

export default BaggageTagPrint;
