import React, { useState } from 'react';
import { HdbListing, Viewing } from '../types';

interface BookViewingModalProps {
  listing: HdbListing;
  onClose: () => void;
  onConfirmViewing: (viewing: Viewing) => void;
}

export const BookViewingModal: React.FC<BookViewingModalProps> = ({
  listing,
  onClose,
  onConfirmViewing,
}) => {
  const [selectedDate, setSelectedDate] = useState('Saturday, 30 Aug 2026');
  const [selectedTime, setSelectedTime] = useState('2:30 PM - 3:15 PM');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const availableDates = [
    'Saturday, 30 Aug 2026',
    'Sunday, 31 Aug 2026',
    'Monday, 1 Sep 2026',
    'Wednesday, 3 Sep 2026',
  ];

  const availableSlots = [
    '10:30 AM - 11:15 AM',
    '2:30 PM - 3:15 PM',
    '4:00 PM - 4:45 PM',
    '7:00 PM - 7:45 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newViewing: Viewing = {
      id: `viewing-${Date.now()}`,
      listingId: listing.id,
      propertyTitle: `${listing.block} ${listing.street}`,
      estate: `${listing.town.charAt(0).toUpperCase() + listing.town.slice(1)} (${listing.district})`,
      date: selectedDate,
      timeSlot: selectedTime,
      consultantName: 'Marcus Wong',
      consultantPhone: '+65 9123 4567',
      status: 'Confirmed',
      notes: notes || 'Inspection of unit condition and natural ventilation check.',
      flatType: listing.flatType,
      price: listing.price,
    };

    setIsSuccess(true);
    setTimeout(() => {
      onConfirmViewing(newViewing);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">check</span>
            </div>
            <h3 className="text-headline-lg font-bold text-on-surface">
              Viewing Scheduled!
            </h3>
            <p className="text-body-md text-on-surface-variant max-w-sm mx-auto text-sm">
              Your viewing for <strong>{listing.block} {listing.street}</strong> is confirmed. Consultant Marcus Wong will meet you on site.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
              <div>
                <h3 className="text-title-md font-bold text-on-surface">
                  Schedule Property Viewing
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {listing.block} {listing.street} ({listing.flatType})
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-4 space-y-4">
              {/* Consultant Banner */}
              <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    MW
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">Marcus Wong</p>
                    <p className="text-[11px] text-on-surface-variant">PropTrust Assigned Consultant</p>
                  </div>
                </div>
                <span className="text-[11px] font-label-sm text-secondary font-medium bg-secondary-container/20 px-2 py-0.5 rounded">
                  Free On-Site Service
                </span>
              </div>

              {/* Select Date */}
              <div>
                <label className="text-label-sm uppercase text-on-surface-variant block mb-1.5 text-xs">
                  Select Date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                        selectedDate === date
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Time Slot */}
              <div>
                <label className="text-label-sm uppercase text-on-surface-variant block mb-1.5 text-xs">
                  Available Time Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                        selectedTime === slot
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="text-label-sm uppercase text-on-surface-variant block mb-1 text-xs">
                  Questions / Specific Areas to Inspect (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Check bedroom natural lighting, kitchen floor condition, noise levels..."
                  rows={2}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary"
                />
              </div>

              {/* Footer */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium rounded-lg hover:bg-surface-container text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Confirm Viewing Appointment
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
