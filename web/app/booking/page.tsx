"use client";
import { useEffect, useState, ChangeEvent } from "react";

interface Booking {
  id: string;
  status: string;
  // add any other booking fields you expect from your API
}

interface Review {
  id: string;
  rating: number;
  comment: string;
}

export default function BookingDetail({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(5);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE;
    fetch(`${base}/api/bookings/${params.id}`)
      .then((r) => r.json())
      .then((data: Booking) => setBooking(data));

    fetch(`${base}/api/reviews/for-booking/${params.id}`)
      .then((r) => r.json())
      .then((data: Review[]) => setReviews(data));
  }, [params.id]);

  async function addReview() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: params.id, rating, comment }),
    });
    const rv: Review = await res.json();
    if (rv.id) setReviews([rv, ...reviews]);
  }

  if (!booking) return <main style={{ padding: 24 }}>Loading...</main>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Booking {booking.id}</h1>
      <p>Status: {booking.status}</p>

      <h2>Reviews</h2>
      <ul>
        {reviews.map((r) => (
          <li key={r.id}>
            {r.rating} — {r.comment}
          </li>
        ))}
      </ul>

      <div>
        <h3>Add review</h3>
        <input
          placeholder="Comment"
          value={comment}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
        />
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setRating(Number(e.target.value))}
        />
        <button onClick={addReview}>Save</button>
      </div>
    </main>
  );
}

