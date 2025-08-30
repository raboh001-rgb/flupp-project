import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, Calendar, User, Mail, Phone } from 'lucide-react';

const FluppPaymentForm = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  
  // Mock booking data
  const [bookingData] = useState({
    petName: 'Buddy',
    species: 'Dog',
    serviceType: 'Premium Grooming',
    date: '2025-09-01',
    time: '10:00 AM',
    duration: '2 hours',
    price: 75.00,
    provider: 'Sarah Johnson',
    location: '123 Pet Care Lane'
  });

  // Mock payment form data
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    cardholderName: '',
    savePaymentMethod: false
  });

  // Simulate creating payment intent
  useEffect(() => {
    const timer = setTimeout(() => {
      setClientSecret('pi_mock_client_secret_12345');
      setPaymentReady(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    if (!paymentReady || !clientSecret) return;
    
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      alert('Payment successful! Booking confirmed.');
      setIsLoading(false);
    }, 2000);
  };

  const isFormValid = formData.email && formData.cardholderName && paymentReady;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
        <p className="text-gray-600">Secure payment for your pet care service</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Pet</span>
              <span className="font-medium">{bookingData.petName} ({bookingData.species})</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Service</span>
              <span className="font-medium">{bookingData.serviceType}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium">{bookingData.date} at {bookingData.time}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{bookingData.duration}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Provider</span>
              <span className="font-medium">{bookingData.provider}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 mt-4">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">${bookingData.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Contact Details</h3>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number (optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Card Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Card Information</h3>
            
            <div className="space-y-2">
              <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
                Cardholder Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="cardholderName"
                  type="text"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            
            {/* Stripe Elements Placeholder */}
            <div className="space-y-2">
              <label htmlFor="card-element" className="block text-sm font-medium text-gray-700">
                Card Details *
              </label>
              <div 
                id="card-element" 
                className="w-full p-4 border border-gray-300 rounded-lg bg-white min-h-[50px] flex items-center text-gray-500"
              >
                {paymentReady ? (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span>Stripe Elements would be mounted here</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 animate-pulse">
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    <span>Loading secure payment form...</span>
                  </div>
                )}
              </div>
              {!paymentReady && (
                <p className="text-sm text-gray-500">Initializing secure payment processing...</p>
              )}
            </div>
          </div>

          {/* Save Payment Method */}
          <div className="flex items-center space-x-3 py-2">
            <input
              id="savePaymentMethod"
              type="checkbox"
              checked={formData.savePaymentMethod}
              onChange={(e) => handleInputChange('savePaymentMethod', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="savePaymentMethod" className="text-sm text-gray-700">
              Save payment method for future bookings
            </label>
          </div>

          {/* Payment Status */}
          {!clientSecret && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-yellow-700 text-sm">Setting up secure payment...</span>
              </div>
            </div>
          )}

          {clientSecret && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-green-600" />
                <span className="text-green-700 text-sm">Secure payment ready</span>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={!isFormValid || isLoading}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              !isFormValid || isLoading
                ? 'bg-gray-300 cursor-not-allowed opacity-60' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Payment...</span>
              </div>
            ) : !paymentReady ? (
              'Preparing Payment...'
            ) : !isFormValid ? (
              'Complete Required Fields'
            ) : (
              `Pay $${bookingData.price.toFixed(2)} - Complete Booking`
            )}
          </button>

          {/* Security Notice */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Lock className="h-4 w-4" />
              <span>Secured by Stripe • Your payment information is encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluppPaymentForm;