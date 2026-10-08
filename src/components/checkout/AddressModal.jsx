import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { MapPin, Phone, User, Globe, Home } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddressModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    country: 'India'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.street || !formData.city || !formData.state || !formData.zip || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    // Simulate slight delay for premium feel
    setTimeout(() => {
      onSave(formData);
      setLoading(false);
      onClose();
    }, 800);
  };

  const inputClasses = "w-full bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-2xl px-5 py-4 text-xs font-bold text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A]/50 focus:outline-none focus:ring-2 focus:ring-[#C5A880]/20 focus:border-[#C5A880] transition-all uppercase tracking-widest";
  const labelClasses = "text-[10px] font-black text-[#6E6D7A] uppercase tracking-[0.2em] mb-2 block ml-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Shipping Address" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recipient Name */}
          <div className="md:col-span-2">
            <label className={labelClasses}>Recipient Name</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6E6D7A] group-focus-within:text-[#C5A880] transition-colors">
                <User size={14} />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={`${inputClasses} pl-12`}
                required
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="md:col-span-2">
            <label className={labelClasses}>Street Address</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6E6D7A] group-focus-within:text-[#C5A880] transition-colors">
                <Home size={14} />
              </div>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="House No, Building, Street Name"
                className={`${inputClasses} pl-12`}
                required
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className={labelClasses}>City</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6E6D7A] group-focus-within:text-[#C5A880] transition-colors">
                <MapPin size={14} />
              </div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City Name"
                className={`${inputClasses} pl-12`}
                required
              />
            </div>
          </div>

          {/* State */}
          <div>
            <label className={labelClasses}>State</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6E6D7A] group-focus-within:text-[#C5A880] transition-colors">
                <Globe size={14} />
              </div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State Name"
                className={`${inputClasses} pl-12`}
                required
              />
            </div>
          </div>

          {/* Zip Code */}
          <div>
            <label className={labelClasses}>Zip Code</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6E6D7A] group-focus-within:text-[#C5A880] transition-colors">
                <MapPin size={14} />
              </div>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="6-Digit Code"
                className={`${inputClasses} pl-12`}
                required
                maxLength="6"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className={labelClasses}>Phone Number</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6E6D7A] group-focus-within:text-[#C5A880] transition-colors">
                <Phone size={14} />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-Digit Mobile"
                className={`${inputClasses} pl-12`}
                required
                maxLength="10"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#EFECE6] dark:border-[#2A2A2E] flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-8 py-4 border border-[#EFECE6] dark:border-[#2A2A2E] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#6E6D7A] hover:bg-[#FAF9F6] dark:hover:bg-[#121214] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-white transition-all shadow-xl shadow-black/10 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Save & Select Address'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddressModal;
