// pages/index.tsx (andar Home component)
const handleFormSubmit = async (formData:any) => {
  setIsLoading(true); setError(null); setReportData(null);
  try {
    const response = await fetch('/api/compute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    console.log('COMPUTE RESPONSE 👉', data); // 👈 debug
    if (!response.ok) throw new Error(data?.error || 'Server error');
    setReportData(data);
  } catch (err:any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
