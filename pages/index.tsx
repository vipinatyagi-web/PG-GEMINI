import { useState } from 'react';
import Head from 'next/head';
import FormWizard from '@/components/FormWizard';
import KundaliReport from '@/components/KundaliReport';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AnimatePresence, motion } from 'framer-motion';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      className="w-16 h-16 border-4 border-t-brand-gold border-brand-violet rounded-full mb-4"
    />
    <h2 className="text-2xl font-bold text-brand-gold">Kundali Taiyaar Ho Rahi Hai...</h2>
    <p className="text-brand-gray mt-2">Pandit ji aapke grahon ki sthiti ka vishleshan kar rahe hain.</p>
  </div>
);

const ErrorMessage = ({ message, onReset }: { message: string, onReset: () => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold text-red-500">Ek Samasya Aa Gayi Hai</h2>
        <p className="text-brand-gray mt-2 mb-6">{message}</p>
        <button onClick={onReset} className="px-8 py-3 bg-brand-gold text-brand-dark font-bold rounded-full hover:bg-yellow-400 transition-all">
            Phir Se Prayaas Karein
        </button>
    </div>
);

export default function Home() {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    setReportData(null);
    try {
      const response = await fetch('/api/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Server par Grah shant nahi hain. Kripya thodi der baad prayaas karein.');
      const data = await response.json();
      setReportData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setReportData(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <>
      <Head>
        <title>Pavitra Gyaan - Aapke Bhavishya Ka Darpan</title>
        <meta name="description" content="AI-powered Kundali and Horoscope generator for Indian users." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen bg-brand-dark font-sans">
        <Header onLogoClick={resetState} />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LoadingSpinner /></motion.div>
            ) : error ? (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ErrorMessage message={error} onReset={resetState} /></motion.div>
            ) : reportData ? (
              <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><KundaliReport data={reportData} /></motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FormWizard onSubmit={handleFormSubmit} /></motion.div>
            )}
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </>
  );
}
