import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

// --- Reusable UI Components (Can be moved to a /ui folder) ---
const Input = (props: any) => (
  <input
    className="w-full bg-brand-bg border border-brand-violet rounded-lg px-4 py-3 text-white placeholder-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-gold"
    {...props}
  />
);
const Select = (props: any) => (
  <select
    className="w-full bg-brand-bg border border-brand-violet rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
    {...props}
  />
);
const Button = ({ children, ...props }: any) => (
  <button
    className="w-full px-8 py-3 bg-brand-gold text-brand-dark font-bold rounded-full hover:bg-yellow-400 transition-all disabled:bg-gray-500"
    {...props}
  >
    {children}
  </button>
);

// ---------------------- STEP 1 ----------------------
const Step1 = ({ data, setData, nextStep }: any) => {
  // Keyless lat/lon mode
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  // NEW: keyless apply function (no GOOGLE_MAPS_API_KEY needed)
  const applyLatLon = async () => {
    if (!data.lat || !data.lon) {
      setGeoError('Kripya Latitude aur Longitude daalein.');
      return;
    }
    setGeoLoading(true);
    setGeoError('');
    try {
      const url = `/api/geo?lat=${encodeURIComponent(
        data.lat
      )}&lon=${encodeURIComponent(data.lon)}&tz=${encodeURIComponent(
        data.timezoneOffsetMinutes
      )}&address=${encodeURIComponent(data.birthplace || '')}&country=India`;

      const res = await fetch(url);
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Location fetch failed');

      // normalize back
      setData({
        ...data,
        lat: String(j.lat),
        lon: String(j.lon),
        timezoneOffsetMinutes: Number(j.tz_offset_minutes || data.timezoneOffsetMinutes),
        // optional: overwrite formatted address (if provided)
        birthplace: j.address || data.birthplace,
      });
    } catch (err: any) {
      setGeoError(err.message);
    } finally {
      setGeoLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6">Aapke Janm Ka Vivaran</h2>

      <p className="text-sm text-brand-gray mb-4">
        <b>No Google mode:</b> Birthplace ke hisaab se <b>Latitude</b>, <b>Longitude</b> aur <b>TZ minutes</b> (India = 330) daalein.
      </p>

      <div className="space-y-4">
        <div>
          <label className="text-brand-gray mb-1 block">Poora Naam</label>
          <Input
            value={data.fullName}
            onChange={(e: any) => setData({ ...data, fullName: e.target.value })}
            placeholder="e.g., Rohan Sharma"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-brand-gray mb-1 block">Janm Tithi (DOB)</label>
            <Input
              type="date"
              value={data.dob}
              onChange={(e: any) => setData({ ...data, dob: e.target.value })}
            />
          </div>
          <div>
            <label className="text-brand-gray mb-1 block">Janm Samay (TOB)</label>
            <Input
              type="time"
              value={data.tob}
              onChange={(e: any) => setData({ ...data, tob: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-brand-gray mb-1 block">Janm Sthan (Address label)</label>
          <Input
            value={data.birthplace}
            onChange={(e: any) => setData({ ...data, birthplace: e.target.value })}
            placeholder="e.g., Panipat, Haryana"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-brand-gray mb-1 block">Latitude</label>
            <Input
              value={data.lat}
              onChange={(e: any) => setData({ ...data, lat: e.target.value })}
              placeholder="e.g., 29.3909"
            />
          </div>
          <div>
            <label className="text-brand-gray mb-1 block">Longitude</label>
            <Input
              value={data.lon}
              onChange={(e: any) => setData({ ...data, lon: e.target.value })}
              placeholder="e.g., 76.9635"
            />
          </div>
          <div>
            <label className="text-brand-gray mb-1 block">TZ minutes (IST = 330)</label>
            <Input
              value={data.timezoneOffsetMinutes}
              onChange={(e: any) =>
                setData({ ...data, timezoneOffsetMinutes: e.target.value })
              }
              placeholder="e.g., 330"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={applyLatLon}
            disabled={geoLoading}
            className="px-4 py-2 bg-brand-violet rounded-lg text-white font-semibold disabled:bg-gray-600"
          >
            {geoLoading ? '...' : 'Apply Lat/Lon'}
          </button>
          <button
            type="button"
            onClick={() => setData({ ...data, timezoneOffsetMinutes: 330 })}
            className="px-4 py-2 border border-brand-violet rounded-lg text-white font-semibold"
          >
            Set IST
          </button>
        </div>

        {geoError && <p className="text-red-500 text-sm mt-1">{geoError}</p>}
        {data.lat && data.lon && (
          <p className="text-green-400 text-center text-sm">
            Location set: {data.lat}, {data.lon} (TZ: {data.timezoneOffsetMinutes})
          </p>
        )}
      </div>

      <div className="mt-8">
        <Button
          onClick={nextStep}
          disabled={!data.fullName || !data.dob || !data.tob || !data.lat || !data.lon}
        >
          Aage Badhein <FaArrowRight className="inline ml-2" />
        </Button>
      </div>
    </div>
  );
};

// ---------------------- STEP 2 ----------------------
const Step2 = ({ data, setData, nextStep, prevStep }: any) => (
  <div>
    <h2 className="text-3xl font-bold text-center mb-6">Aapke Baare Mein Thoda Batayein</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-brand-gray mb-1 block">Gender</label>
        <Select
          value={data.gender}
          onChange={(e: any) => setData({ ...data, gender: e.target.value })}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Select>
      </div>
      <div>
        <label className="text-brand-gray mb-1 block">Relationship Status</label>
        <Select
          value={data.relationshipStatus}
          onChange={(e: any) =>
            setData({ ...data, relationshipStatus: e.target.value })
          }
        >
          <option value="">Select</option>
          <option value="single">Single</option>
          <option value="in_relationship">In a Relationship</option>
          <option value="married">Married</option>
        </Select>
      </div>
      <div>
        <label className="text-brand-gray mb-1 block">Career Goal</label>
        <Select
          value={data.careerGoal}
          onChange={(e: any) => setData({ ...data, careerGoal: e.target.value })}
        >
          <option value="">Select</option>
          <option value="promotion">Promotion</option>
          <option value="job_change">Job Change</option>
          <option value="business_growth">Business Growth</option>
        </Select>
      </div>
      <div>
        <label className="text-brand-gray mb-1 block">Sabse Badi Chinta</label>
        <Select
          value={data.topConcern}
          onChange={(e: any) => setData({ ...data, topConcern: e.target.value })}
        >
          <option value="">Select</option>
          <option value="career">Career</option>
          <option value="love">Love</option>
          <option value="money">Money</option>
          <option value="health">Health</option>
        </Select>
      </div>
    </div>

    <div className="mt-8 flex gap-4">
      <button
        onClick={prevStep}
        className="w-1/4 flex items-center justify-center py-3 bg-brand-violet rounded-full"
      >
        <FaArrowLeft />
      </button>
      <Button onClick={nextStep} className="w-3/4">
        Review Karein <FaArrowRight className="inline ml-2" />
      </Button>
    </div>
  </div>
);

// ---------------------- STEP 3 ----------------------
const Step3 = ({ data, prevStep, handleSubmit }: any) => (
  <div>
    <h2 className="text-3xl font-bold text-center mb-6">Apni Jaankari Check Karein</h2>
    <div className="bg-brand-bg p-6 rounded-lg space-y-2 text-lg">
      <p>
        <strong className="text-brand-gold">Naam:</strong> {data.fullName}
      </p>
      <p>
        <strong className="text-brand-gold">DOB:</strong> {data.dob}
      </p>
      <p>
        <strong className="text-brand-gold">TOB:</strong> {data.tob}
      </p>
      <p>
        <strong className="text-brand-gold">Sthan:</strong> {data.birthplace}
      </p>
      <p>
        <strong className="text-brand-gold">Lat/Lon:</strong> {data.lat}, {data.lon} (TZ: {data.timezoneOffsetMinutes})
      </p>
      <p>
        <strong className="text-brand-gold">Focus:</strong> {data.topConcern}
      </p>
    </div>
    <div className="mt-8 flex gap-4">
      <button
        onClick={prevStep}
        className="w-1/4 flex items-center justify-center py-3 bg-brand-violet rounded-full"
      >
        <FaArrowLeft />
      </button>
      <Button onClick={handleSubmit} className="w-3/4">
        Meri Kundali Banayein
      </Button>
    </div>
  </div>
);

// ---------------------- WRAPPER ----------------------
const FormWizard = ({ onSubmit }: any) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    tob: '',
    birthplace: '',
    lat: '',
    lon: '',
    timezoneOffsetMinutes: 330, // IST default
    gender: '',
    relationshipStatus: '',
    careerGoal: '',
    topConcern: '',
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const motionProps = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.5 },
  };

  // Submit ko compute API format me map kar do
  const handleFinalSubmit = () => {
    onSubmit({
      ...formData,
      // compute API expects tz_offset_minutes
      tz_offset_minutes: formData.timezoneOffsetMinutes,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-brand-bg/60 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key={1} {...motionProps}>
            <Step1 data={formData} setData={setFormData} nextStep={nextStep} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key={2} {...motionProps}>
            <Step2
              data={formData}
              setData={setFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key={3} {...motionProps}>
            <Step3
              data={formData}
              prevStep={prevStep}
              handleSubmit={handleFinalSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormWizard;
