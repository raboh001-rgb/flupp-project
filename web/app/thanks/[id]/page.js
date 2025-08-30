"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Thanks;
function Thanks({ params }) {
    return (<main style={{ padding: 24 }}>
      <h1>Thanks!</h1>
      <p>Your booking ID: {params.id}</p>
      <a href={`/booking/${params.id}`}>View booking</a>
    </main>);
}
