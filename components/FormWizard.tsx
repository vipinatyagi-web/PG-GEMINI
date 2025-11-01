import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaBirthdayCake, FaMapMarkerAlt, FaHeart, FaBriefcase, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

// --- Reusable UI Components (Can be moved to a /ui folder) ---
const Input = (props: any) => <input className="w-full bg-brand-bg border border-brand-violet rounded-lg px-4 py-3 text-white placeholder-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-gold" {...props} />;
const Select = (props: any) => <select className="w-full bg-brand-bg border border-brand-violet rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold" {...props} />;
const Button = ({ children, ...props }: any) => <button className="w-full px-8 py-3 bg-brand-gold text-brand-dark font-bold rounded-full hover:bg-yellow-400 transition-all disabled:bg-gray-500" {...props}>{children}</button>;

const Step1 = ({ data, setData, nextStep }: any) => {
    // ... Geo API logic ...
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoError, setGeoError] = useState('');

    const handleFindPlace = async () => {
        if (!data.birthplace) {
            setGeoError('Kripya jagah ka naam daalein.');
            return;
        }
        setGeoLoading(true);
        setGeoError('');
        try {
            const res = await fetch(`/api/geo?query=${data.birthplace}`);
            const geoData = await res.json();
            if (res.ok) {
                setData({ ...data, lat: geoData.lat, lon: geoData.lon, timezoneOffsetMinutes: geoData.timezoneOffsetMinutes });
            } else {
                throw new Error(geoData.error);
            }
        } catch (err: any) {
            setGeoError(err.message);
        } finally {
            setGeoLoading(false);
        }
    };
    
    return (
    <div>
        <h2 className="text-3xl font-bold text-center mb-6">Aapke Janm Ka Vivaran</h2>
        <div className="space-y-4">
            <div><label className="text-brand-gray mb-1 block">Poora Naam</label><Input value={data.fullName} onChange={(e:any) => setData({...data, fullName: e.target.value})} placeholder="e.g., Rohan Sharma" /></div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="text-brand-gray mb-1 block">Janm Tithi (DOB)</label><Input type="date" value={data.dob} onChange={(e:any) => setData({...data, dob: e.target.value})} /></div>
                <div><label className="text-brand-gray mb-1 block">Janm Samay (TOB)</label><Input type="time" value={data.tob} onChange={(e:any) => setData({...data, tob: e.target.value})} /></div>
            </div>
            <div>
                <label className="text-brand-gray mb-1 block">Janm Sthan</label>
                <div className="flex gap-2">
                    <Input value={data.birthplace} onChange={(e:any) => setData({...data, birthplace: e.target.value})} placeholder="e.g., Mumbai, Maharashtra" />
                    <button onClick={handleFindPlace} disabled={geoLoading} className="px-4 py-2 bg-brand-violet rounded-lg text-white font-semibold disabled:bg-gray-600">{geoLoading ? '...' : 'Khojein'}</button>
                </div>
                {geoError && <p className="text-red-500 text-sm mt-1">{geoError}</p>}
            </div>
            {data.lat && <p className="text-green-400 text-center text-sm">Location set: {data.lat}, {data.lon}</p>}
        </div>
        <div className="mt-8"><Button onClick={nextStep} disabled={!data.fullName || !data.dob || !data.tob || !data.lat}>Aage Badhein <FaArrowRight className="inline ml-2" /></Button></div>
    </div>
)};

const Step2 = ({ data, setData, nextStep, prevStep }: any) => (
    <div>
        <h2 className="text-3xl font-bold text-center mb-6">Aapke Baare Mein Thoda Batayein</h2>
        <div className="grid grid-cols-2 gap-4">
             <div><label className="text-brand-gray mb-1 block">Gender</label><Select value={data.gender} onChange={(e:any) => setData({...data, gender: e.target.value})}><option>Select</option><option value="male">Male</option><option value="female">Female</option></Select></div>
             <div><label className="text-brand-gray mb-1 block">Relationship Status</label><Select value={data.relationshipStatus} onChange={(e:any) => setData({...data, relationshipStatus: e.target.value})}><option>Select</option><option value="single">Single</option><option value="in_relationship">In a Relationship</option><option value="married">Married</option></Select></div>
             <div><label className="text-brand-gray mb-1 block">Career Goal</label><Select value={data.careerGoal} onChange={(e:any) => setData({...data, careerGoal: e.target.value})}><option>Select</option><option value="promotion">Promotion</option><option value="job_change">Job Change</option><option value="business_growth">Business Growth</option></Select></div>
             <div><label className="text-brand-gray mb-1 block">Sabse Badi Chinta</label><Select value={data.topConcern} onChange={(e:any) => setData({...data, topConcern: e.target.value})}><option>Select</option><option value="career">Career</option><option value="love">Love</option><option value="money">Money</option><option value="health">Health</option></Select></div>
        </div>
        <div className="mt-8 flex gap-4">
            <button onClick={prevStep} className="w-1/4 flex items-center justify-center py-3 bg-brand-violet rounded-full"><FaArrowLeft /></button>
            <Button onClick={nextStep} className="w-3/4">Review Karein <FaArrowRight className="inline ml-2" /></Button>
        </div>
    </div>
);

const Step3 = ({ data, prevStep, handleSubmit }: any) => (
    <div>
        <h2 className="text-3xl font-bold text-center mb-6">Apni Jaankari Check Karein</h2>
        <div className="bg-brand-bg p-6 rounded-lg space-y-2 text-lg">
            <p><strong className="text-brand-gold">Naam:</strong> {data.fullName}</p>
            <p><strong className="text-brand-gold">DOB:</strong> {data.dob}</p>
            <p><strong className="text-brand-gold">TOB:</strong> {data.tob}</p>
            <p><strong className="text-brand-gold">Sthan:</strong> {data.birthplace}</p>
            <p><strong className="text-brand-gold">Focus:</strong> {data.topConcern}</p>
        </div>
        <div className="mt-8 flex gap-4">
             <button onClick={prevStep} className="w-1/4 flex items-center justify-center py-3 bg-brand-violet rounded-full"><FaArrowLeft /></button>
            <Button onClick={handleSubmit} className="w-3/4">Meri Kundali Banayein</Button>
        </div>
    </div>
);


const FormWizard = ({ onSubmit }: any) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', dob: '', tob: '', birthplace: '',
    lat: '', lon: '', timezoneOffsetMinutes: 330,
    gender: '', relationshipStatus: '', careerGoal: '', topConcern: '',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  
  const motionProps = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="max-w-2xl mx-auto bg-brand-bg/60 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        <AnimatePresence mode="wait">
            {step === 1 && <motion.div key={1} {...motionProps}><Step1 data={formData} setData={setFormData} nextStep={nextStep} /></motion.div>}
            {step === 2 && <motion.div key={2} {...motionProps}><Step2 data={formData} setData={setFormData} nextStep={nextStep} prevStep={prevStep} /></motion.div>}
            {step === 3 && <motion.div key={3} {...motionProps}><Step3 data={formData} prevStep={prevStep} handleSubmit={() => onSubmit(formData)} /></motion.div>}
        </AnimatePresence>
    </div>
  );
};

export default FormWizard;
