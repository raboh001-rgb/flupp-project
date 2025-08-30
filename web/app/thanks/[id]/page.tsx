export default function Thanks({ params }: { params: { id: string } }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>Thanks!</h1>
      <p>Your booking ID: {params.id}</p>
      <a href={`/booking/${params.id}`}>View booking</a>
    </main>
  );
}
