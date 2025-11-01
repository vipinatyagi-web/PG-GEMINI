import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaShareAlt, FaStar, FaBriefcase, FaHeart, FaNotesMedical, FaLightbulb } from 'react-icons/fa';
import ChatWidget from './ChatWidget';
// A simple PDF generation utility (you would create this file)
// import { generatePdf } from '@/lib/pdfGenerator'; 

const Section = ({ title, icon, children }: any) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="bg-brand-bg/60 rounded-xl mb-4 overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left">
                <div className="flex items-center gap-3">
                    <div className="text-brand-gold text-xl">{icon}</div>
                    <h3 className="text-xl font-bold">{title}</h3>
                </div>
                <motion.div animate={{ rotate: isOpen ? 0 : -90 }}>▼</motion.div>
            </button>
            {isOpen && <div className="p-4 pt-0 text-brand-gray">{children}</div>}
        </div>
    );
};


const KundaliReport = ({ data }: { data: any }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    alert("PDF Download functionality is being implemented!");
    // You would call your PDF generation function here
    // const { generatePdf } = await import('@/lib/pdfGenerator');
    // generatePdf(reportRef.current, `PavitraGyaan_${data.meta.name}.pdf`);
  };

  const handleShare = () => {
    const text = `Dekho meri AI-powered Kundali Pavitra Gyaan se! Tum bhi try karo.`;
    const url = window.location.href;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="animation-fade-in">
        <div className="text-center mb-8 bg-brand-bg/60 p-6 rounded-2xl">
            <h1 className="text-4xl font-bold">Kundali Phaladesh for <span className="text-brand-gold">{data.meta.name}</span></h1>
            <p className="text-brand-gray mt-2">{data.summary.core_focus}</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
            <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-3 bg-brand-violet rounded-full font-semibold"><FaDownload /> Download PDF</button>
            <button onClick={handleShare} className="flex items-center gap-2 px-6 py-3 bg-brand-violet rounded-full font-semibold"><FaShareAlt /> Share on WhatsApp</button>
        </div>

        <div ref={reportRef} className="p-2">
            <Section title="Career" icon={<FaBriefcase />}>
                <h4 className="font-bold text-lg text-white mb-2">{data.sections.career.headline}</h4>
                <p className="mb-2">{data.sections.career.forensic}</p>
                <div className="border-l-2 border-brand-gold pl-3 mt-3">
                    <strong className="text-brand-light">Action Plan:</strong>
                    <ul className="list-disc list-inside mt-1">
                        <li><strong>Aaj:</strong> {data.sections.career.actions.today}</li>
                        <li><strong>7 Din Mein:</strong> {data.sections.career.actions.seven_days}</li>
                    </ul>
                </div>
            </Section>

            <Section title="Love & Relationship" icon={<FaHeart />}>
                 <h4 className="font-bold text-lg text-white mb-2">{data.sections.love.headline}</h4>
                 <p className="mb-2">{data.sections.love.forensic}</p>
            </Section>
            
            <Section title="Upaay (Remedies)" icon={<FaLightbulb />}>
                <p>{data.remedies[0].name} - {data.remedies[0].reason} ({data.remedies[0].when})</p>
            </Section>
        </div>

        <ChatWidget />
    </div>
  );
};

export default KundaliReport;
