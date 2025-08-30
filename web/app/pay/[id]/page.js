"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PayPage;
const react_1 = require("react");
const react_stripe_js_1 = require("@stripe/react-stripe-js");
const StripeProvider_1 = __importDefault(require("@/components/StripeProvider"));
function PayInner({ id }) {
    const stripe = (0, react_stripe_js_1.useStripe)();
    const elements = (0, react_stripe_js_1.useElements)();
    const [clientSecret, setClientSecret] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const base = process.env.NEXT_PUBLIC_API_BASE;
        fetch(`${base}/api/payments/create-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: id })
        })
            .then((r) => r.json())
            .then((d) => setClientSecret(d.clientSecret))
            .catch(() => setClientSecret(null));
    }, [id]);
    async function pay() {
        if (!stripe || !elements || !clientSecret)
            return;
        const card = elements.getElement(react_stripe_js_1.CardElement);
        if (!card)
            return;
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card }
        });
        if (result.error) {
            alert(result.error.message);
            return;
        }
        window.location.href = `/thanks/${id}`;
    }
    return (<main style={{ padding: 24 }}>
      <h1>Payment</h1>
      <react_stripe_js_1.CardElement />
      <button onClick={pay} disabled={!stripe || !clientSecret}>
        Pay
      </button>
    </main>);
}
function PayPage({ params }) {
    return (<StripeProvider_1.default>
      <PayInner id={params.id}/>
    </StripeProvider_1.default>);
}
