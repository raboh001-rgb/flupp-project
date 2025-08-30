"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BookingDetail;
const react_1 = require("react");
function BookingDetail({ params }) {
    const [booking, setBooking] = (0, react_1.useState)(null);
    const [reviews, setReviews] = (0, react_1.useState)([]);
    const [comment, setComment] = (0, react_1.useState)("");
    const [rating, setRating] = (0, react_1.useState)(5);
    (0, react_1.useEffect)(() => {
        const base = process.env.NEXT_PUBLIC_API_BASE;
        fetch(`${base}/api/bookings/${params.id}`)
            .then((r) => r.json())
            .then((data) => setBooking(data));
        fetch(`${base}/api/reviews/for-booking/${params.id}`)
            .then((r) => r.json())
            .then((data) => setReviews(data));
    }, [params.id]);
    async function addReview() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: params.id, rating, comment }),
        });
        const rv = await res.json();
        if (rv.id)
            setReviews([rv, ...reviews]);
    }
    if (!booking)
        return <main style={{ padding: 24 }}>Loading...</main>;
    return (<main style={{ padding: 24 }}>
      <h1>Booking {booking.id}</h1>
      <p>Status: {booking.status}</p>

      <h2>Reviews</h2>
      <ul>
        {reviews.map((r) => (<li key={r.id}>
            {r.rating} — {r.comment}
          </li>))}
      </ul>

      <div>
        <h3>Add review</h3>
        <input placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)}/>
        <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))}/>
        <button onClick={addReview}>Save</button>
      </div>
    </main>);
}
