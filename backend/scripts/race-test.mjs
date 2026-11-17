// Fires several bookings for the SAME slot at the same moment.
// Usage: node scripts/race-test.mjs 2026-11-17 11:00 <serviceId>
const [date, time, serviceId] = process.argv.slice(2);
if (!date || !time || !serviceId) {
  console.log('Usage: node scripts/race-test.mjs <YYYY-MM-DD> <HH:mm> <serviceId>');
  process.exit(1);
}

const attempts = 6;
const stamp = Date.now().toString().slice(-6);

const requests = Array.from({ length: attempts }, (_, i) =>
  fetch('http://localhost:3000/api/v1/public/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { name: `Race Tester ${i + 1}`, phone: `9${String(Math.floor(Math.random() * 1e9)).padStart(9, '0')}` },
      motorcycle: { brand: 'Test', model: 'Racer', registrationNumber: `RACE${stamp}${i + 1}` },
      serviceIds: [serviceId],
      date,
      time,
    }),
  }).then(async (res) => ({ status: res.status, body: await res.json() })),
);

const results = await Promise.all(requests);
const created = results.filter((r) => r.status === 201).length;
const full = results.filter((r) => r.status === 409).length;
console.log(`Sent ${attempts} at once -> ${created} created, ${full} rejected as full`);
for (const r of results) console.log(r.status, r.body.bookingRef ?? r.body.message);