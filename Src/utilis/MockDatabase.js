export let sharedMockRequests = [
  {
    booking_id: '1001',
    name: 'Ikrama',
    service_date: '2026-09-18',
    service_time: '10:00 AM',
    status: 'pending',
    service: 'Driver',
    profile: null,
    file: 'license_copy_1001.pdf',
    price: '$45.00',
  },
  {
    booking_id: '1002',
    name: 'Sarah Williams',
    service_date: '2026-09-19',
    service_time: '02:30 PM',
    status: 'pending',
    service: 'Bricklayer',
    profile: null,
    file: 'wall_damage_photo.jpg',
    price: '$85.00',
  },
  {
    booking_id: '1003',
    name: 'David Smith',
    service_date: '2026-09-20',
    service_time: '09:15 AM',
    status: 'pending',
    service: 'Plumber',
    profile: null,
    file: 'wall_damage_photo.jpg',
    price: '$120.00',
  },
];

export const updateMockRequestStatus = (id, newStatus) => {
  const index = sharedMockRequests.findIndex(req => req.booking_id === id);
  if (index !== -1) {
    sharedMockRequests[index].status = newStatus;
  }
};
