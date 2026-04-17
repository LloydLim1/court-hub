export const featuredCourts = [
  {
    title: 'Center Court',
    detail: 'Indoor hardwood with club lighting, live score sync, and pro camera angles.',
    meta: 'Open play until 11:30 PM'
  },
  {
    title: 'Skyline Rooftop',
    detail: 'Blue acrylic surface with city-night sessions, cardio drills, and private bookings.',
    meta: '3 coaching slots left today'
  },
  {
    title: 'Recovery Studio',
    detail: 'Stretch flow, physio consults, and post-match wellness built into every membership.',
    meta: 'Included for League Pass members'
  }
] as const;

export const homeHighlights = [
  {
    label: 'Tonight at CourtHub',
    value: 'City League Finals',
    note: 'Doors open 6:45 PM with courtside check-in and express concessions.'
  },
  {
    label: 'Fresh Drop',
    value: 'Weekend ladder play',
    note: 'Challenge-based scheduling, live leaderboards, and coach reviews in one flow.'
  },
  {
    label: 'Club Pulse',
    value: '91% court utilization',
    note: 'High demand on premium courts means mobile-first booking matters.'
  }
] as const;

export const userMoments = [
  {
    title: 'Warm-up Window',
    detail: 'Thursday, 6:15 PM - Court 2 - shared recovery playlist ready.'
  },
  {
    title: 'Shooting Lab',
    detail: 'Friday, 7:30 AM - personalized three-point reps with motion capture clips.'
  },
  {
    title: 'League Night',
    detail: 'Saturday, 8:00 PM - semifinal bracket with auto-updating box score.'
  }
] as const;

export const userActions = [
  'Book an open court',
  'Join a ladder match',
  'Message your coach',
  'View payment history'
] as const;

export const adminSnapshot = [
  {
    label: 'Occupancy',
    value: '91%',
    note: 'Peak usage centered on Court 1 and Skyline Rooftop.'
  },
  {
    label: 'Revenue today',
    value: '$12.8K',
    note: 'Membership renewals are pacing 18% ahead of last Friday.'
  },
  {
    label: 'Staff on shift',
    value: '18',
    note: 'Two referees and one physio still available for reassignment.'
  }
] as const;

export const adminQueue = [
  'Approve three sponsor lounge requests',
  'Confirm trainer rotation for the 7 PM clinics',
  'Review one flagged payment from a guest booking',
  'Send finals-night push notification to premium members'
] as const;
