import { Plus, Search, FileText, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';


const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://localhost:5001';

const prevPrescriptions = [
  {
    id: 1,
    rxNumber: 'RX001',
    patient: 'John Smith',
    date: '2024-01-18',
    doctor: 'Dr. Michael Chen',
    diagnosis: 'Hypertension',
    medications: [
      { name: 'Amlodipine', dosage: '5mg, Once daily for 30 days', instructions: 'Take in the morning' },
      { name: 'Losartan', dosage: '50mg, Once daily for 30 days', instructions: 'Take with food' },
    ],
    notes: 'Follow up in 4 weeks. Monitor blood pressure daily.',
    status: 'Sent',
  },
  {
    id: 2,
    rxNumber: 'RX002',
    patient: 'Emma Wilson',
    date: '2024-01-18',
    doctor: 'Dr. Sarah Johnson',
    diagnosis: 'Common Cold',
    medications: [
      { name: 'Paracetamol', dosage: '500mg, Three times daily for 5 days', instructions: 'Take after meals' },
    ],
    notes: 'Rest and stay hydrated.',
    status: 'Dispensed',
  },
];

const templates = [
  { name: 'General Checkup', count: 18 },
  { name: 'Cold & Flu', count: 12 },
  { name: 'Hypertension Follow-up', count: 9 },
  { name: 'Diabetes Review', count: 7 },
];

// Common medicines for quick selection
const commonMedicines = [
  'Paracetamol', 'Ibuprofen', 'Amlodipine', 'Losartan', 'Atorvastatin',
  'Metformin', 'Aspirin', 'Omeprazole', 'Amoxicillin', 'Ciprofloxacin',
];

// Medicine dosage database with common dosages for each medicine
const medicineDosageMap: Record<string, { dosages: string[], unit: string }> = {
  'Paracetamol': { dosages: ['250mg', '325mg', '500mg', '650mg', '1000mg'], unit: 'mg' },
  'Ibuprofen': { dosages: ['200mg', '400mg', '600mg', '800mg'], unit: 'mg' },
  'Aspirin': { dosages: ['75mg', '100mg', '150mg', '300mg', '500mg'], unit: 'mg' },
  'Amlodipine': { dosages: ['2.5mg', '5mg', '10mg'], unit: 'mg' },
  'Losartan': { dosages: ['25mg', '50mg', '100mg'], unit: 'mg' },
  'Atorvastatin': { dosages: ['10mg', '20mg', '40mg', '80mg'], unit: 'mg' },
  'Metformin': { dosages: ['250mg', '500mg', '850mg', '1000mg'], unit: 'mg' },
  'Omeprazole': { dosages: ['10mg', '20mg', '40mg'], unit: 'mg' },
  'Amoxicillin': { dosages: ['125mg', '250mg', '500mg', '750mg', '1000mg'], unit: 'mg' },
  'Ciprofloxacin': { dosages: ['250mg', '500mg', '750mg', '1000mg'], unit: 'mg' },
};

// Dosage patterns
const dosagePatterns = [
  { pattern: '1-0-1', label: 'Morning & Night' },
  { pattern: '1-1-1', label: 'Morning, Afternoon, Night' },
  { pattern: '0-1-0', label: 'Afternoon Only' },
  { pattern: '0-0-1', label: 'Night Only' },
  { pattern: '1-0-0', label: 'Morning Only' },
  { pattern: '0-1-1', label: 'Afternoon & Night' },
  {pattern : '1-1-0', label: 'Morning & Afternoon'},
  // pattern for have medicine only when pain occurs
  {pattern : 'PRN', label: 'As needed (PRN)'},


];

// Meal timings
const mealTimings = [
  { value: 'before-meal', label: 'Before Meal' },
  { value: 'after-meal', label: 'After Meal' },
  { value: 'with-meal', label: 'With Meal' },
  { value: 'empty-stomach', label: 'Empty Stomach' },
];

// Lab tests with requirements
const labTestsList = [
  { id: 'hba1c', name: 'HbA1c (Diabetes)', requirement: 'Empty stomach', category: 'Blood' },
  { id: 'cbc', name: 'CBC (Complete Blood Count)', requirement: 'Empty stomach preferred', category: 'Blood' },
  { id: 'lft', name: 'LFT (Liver Function Test)', requirement: 'Empty stomach', category: 'Blood' },
  { id: 'rft', name: 'RFT (Renal Function Test)', requirement: 'Empty stomach', category: 'Blood' },
  { id: 'tsh', name: 'TSH (Thyroid)', requirement: 'Empty stomach', category: 'Blood' },
  { id: 'lipid', name: 'Lipid Profile', requirement: 'Empty stomach, 12 hours fasting', category: 'Blood' },
  { id: 'blood-sugar', name: 'Fasting Blood Sugar', requirement: 'Empty stomach, 8-10 hours fasting', category: 'Blood' },
  { id: 'urine', name: 'Urine Analysis', requirement: 'Early morning first sample', category: 'Urine' },
  { id: 'urine-culture', name: 'Urine Culture', requirement: 'Sterile container, midstream sample', category: 'Urine' },
  { id: 'abdominal-scan', name: 'Abdominal Scan (USG)', requirement: 'Empty stomach, full bladder', category: 'Imaging' },
  { id: 'chest-xray', name: 'Chest X-Ray', requirement: 'No special preparation', category: 'Imaging' },
  { id: 'ecg', name: 'ECG (Electrocardiogram)', requirement: 'No special preparation', category: 'Cardiac' },
];

export function OPDRx() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [labTests, setLabTests] = useState<any[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientSuggestions, setPatientSuggestions] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [headerData, setHeaderData] = useState({
    patientFirstName: '',
    patientLastName: '',  
    email: '',
    mobile: '',
    doctor: '',
    dob: '',
    diagnosis: '',
    date: new Date().toISOString().split('T')[0],
  });
  
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '' as string | number,
    pattern: '1-1-1',
    frequency: { morning: false, afternoon: false, night: false },
    mealTiming: 'after-meal',
    duration: '',
    showFreqDetail: false,
  });

  const [newLabTest, setNewLabTest] = useState<'open' | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle click outside the search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSuggestions]);

  // Fetch patient suggestions from API
  useEffect(() => {
    if (patientSearch.length > 0) {
      setShowSuggestions(true);
      setLoadingPatients(true);
      const searchPatients = async () => {
        try {
          const response = await fetch(
            `${apiBaseUrl}/api/Patient/search/${patientSearch}`
          );
           
          if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);
            // Handle various response formats
            let suggestions = [];
            if (Array.isArray(data)) {
              suggestions = data;
            } else if (data?.data && Array.isArray(data.data)) {
              suggestions = data.data;
            } else if (data?.results && Array.isArray(data.results)) {
              suggestions = data.results;
            } else if (data && typeof data === 'object' && !Array.isArray(data)) {
              // Single object response - wrap in array
              suggestions = [data];
            }
            setPatientSuggestions(suggestions);
          }
        } catch (error) {
          console.error('Patient search error:', error);
          setPatientSuggestions([]);
        } finally {
          setLoadingPatients(false);
        }
      };
      const timer = setTimeout(searchPatients, 300);
      return () => clearTimeout(timer);
    } else {
      setPatientSuggestions([]);
      setLoadingPatients(false);
      setShowSuggestions(false);
    }
  }, [patientSearch]);

  const selectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setHeaderData({
      ...headerData,
      patientFirstName: patient.firstName || '',
      patientLastName: patient.lastName || '',
      email: patient.email || '',
      mobile: patient.mobile || patient.phone || '',
    });
    setPatientSearch('');
    setPatientSuggestions([]);
    setShowPatientForm(false);
  };

  const addNewPatient = () => {
    if (headerData.patientFirstName && headerData.patientLastName && headerData.mobile) {
      setSelectedPatient({
        firstName: headerData.patientFirstName,
        lastName: headerData.patientLastName,
        email: headerData.email,
        mobile: headerData.mobile,
        dob : headerData.dob,
      });
      setShowPatientForm(false);
    }
  };

  const handleMedicineNameChange = (value: string) => {
    setNewMed({ ...newMed, name: value });
  };

  const addMedicine = () => {
    if (newMed.name && newMed.duration) {
      setMedicines([...medicines, { id: Date.now(), ...newMed }]);
      setNewMed({
        name: '',
        dosage: '',
        pattern: '1-1-1',
        frequency: { morning: false, afternoon: false, night: false },
        mealTiming: 'after-meal',
        duration: '',
        showFreqDetail: false,
      });
    }
  };

  const removeMedicine = (id: number) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const addLabTest = (test: any) => {
    if (!labTests.find(t => t.id === test.id)) {
      setLabTests([...labTests, test]);
      setNewLabTest(null);
    }
  };

  const removeLabTest = (id: string) => {
    setLabTests(labTests.filter(t => t.id !== id));
  };

  const sendPrescription = async () => {
    if (!selectedPatient || medicines.length === 0) {
      alert('Please select a patient and add at least one medicine');
      return;
    }

    try {
      // Parse medicines into DTO format
      const medicinesDto = medicines.map(med => {
        // Extract number from dosage string (e.g., "500mg" → 500)
        const dosageNumber = parseInt(med.dosage.replace(/[a-zA-Z\s\/]/g, '')) || 0;
        
        // Parse duration (e.g., "7 days" → duration: 7, durationType: "days")
        const durationParts = med.duration.trim().split(/\s+/);
        const duration = parseInt(durationParts[0]) || 1;
        const durationType = durationParts[1] || 'days';

        return {
          MedicineName: med.name,
          Dosage: dosageNumber,
          FrequencyPattern: med.pattern,
          MealTiming: med.mealTiming,
          Duration: duration,
          DurationType: durationType,
        };
      });

      // Parse lab tests into DTO format
      const labTestsDto = labTests.map(test => ({
        TestName: test.name,
        Requirement: test.requirement,
        Category: test.category,
      }));

      // Create prescription DTO
      const prescriptionDto = {
        PatientId: selectedPatient.id,
        DoctorName: headerData.doctor,
        Notes: '', // Add notes field if you have it
        Medicines: medicinesDto,
        LabTests: labTestsDto,
      };

      // Send to backend
      const response = await fetch('https://your-api-endpoint/api/Prescription/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescriptionDto),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Prescription created successfully! ID: ${result}`);
        // Reset form
        setMedicines([]);
        setLabTests([]);
        setSelectedPatient(null);
      } else {
        alert('Failed to create prescription');
      }
    } catch (error) {
      console.error('Error sending prescription:', error);
      alert('Error sending prescription');
    }
  };

  const getMealLabel = (timing: string) => {
    return mealTimings.find(m => m.value === timing)?.label || timing;
  };

  const getPatternDisplay = (med: any) => {
    if (med.showFreqDetail) {
      const freq = [];
      if (med.frequency.morning) freq.push('Morning');
      if (med.frequency.afternoon) freq.push('Afternoon');
      if (med.frequency.night) freq.push('Night');
      return freq.join(', ');
    }
    return med.pattern;
  };

  return (
    <div>
      <div className="mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">OPD Rx</h1>
          <p className="text-gray-600">Manage prescriptions and OPD records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6">
        <div className="space-y-4">
          {/* Header Info with Patient Search */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white rounded-lg shadow-md p-6 border border-blue-200 relative overflow-hidden">
            {/* Watermark background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none text-9xl font-black text-blue-500 transform -rotate-45" style={{ width: '200%', height: '200%' }}>
              <div className="whitespace-nowrap">Rx Rx Rx Rx Rx Rx Rx Rx Rx Rx</div>
            </div>
            <div className="relative">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Create Prescription</h2>
                <p className="text-gray-600">Start by entering patient details and diagnosis</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg">
                  Save Draft
                </button>
                <button onClick={sendPrescription} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg">
                  Send Prescription
                </button>
              </div>
            </div>

            {/* Patient Search Section */}
            {!selectedPatient && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Search or Create Patient
                </label>
                <div className="relative z-50" ref={searchContainerRef}>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Start typing patient name..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {showSuggestions && (
                      <div className="relative top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        {loadingPatients && (
                          <div className="px-4 py-3 text-center text-gray-500">
                            <span>Loading</span> <span className="animate-bounce">.</span><span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span><span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                          </div>
                        )}
                        {!loadingPatients && patientSuggestions.length === 0 && (
                          <>
                            <div className="px-4 py-3 text-center text-gray-500">
                              No records found
                            </div>
                            <button
                              onClick={() => setShowPatientForm(!showPatientForm)}
                              className="w-full text-left px-4 py-2 hover:bg-blue-50 border-t border-gray-200 bg-blue-50 text-primary-600 font-medium"
                            >
                              + New Patient
                            </button>
                          </>
                        )}
                        {patientSuggestions.length > 0 && (
                          <>
                            {patientSuggestions.map((patient, idx) => (
                              <button
                                key={idx}
                                onClick={() => selectPatient(patient)}
                                className="w-full text-left px-4 py-2 hover:bg-primary-50 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium">{patient.name || patient.firstName + ' ' + patient.lastName}</div>
                                <div className="text-xs text-gray-500">{patient.mobile || patient.phone}</div>
                              </button>
                            ))}
                            <button
                              onClick={() => setShowPatientForm(!showPatientForm)}
                              className="w-full text-left px-4 py-2 hover:bg-blue-50 border-t border-gray-200 bg-blue-50 text-primary-600 font-medium"
                            >
                              + New Patient
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {showPatientForm && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className='block text-sm font-medium text-gray-700 mb-3'><span className="text-sm font-medium text-gray-700">Patient details</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">First Name *</span>
                        <input
                          type="text"
                          value={headerData.patientFirstName}
                          onChange={(e) => setHeaderData({ ...headerData, patientFirstName: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">Last Name *</span>
                        <input
                          type="text"
                          value={headerData.patientLastName}
                          onChange={(e) => setHeaderData({ ...headerData, patientLastName: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">Mobile *</span>
                        <input
                          type="tel"
                          value={headerData.mobile}
                          onChange={(e) => setHeaderData({ ...headerData, mobile: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">Email</span>
                        <input
                          type="email"
                          value={headerData.email}
                          onChange={(e) => setHeaderData({ ...headerData, email: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">Date of Birth</span>
                        <input
                          type="date"
                          value={headerData.dob}
                          onChange={(e) => setHeaderData({ ...headerData, dob: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </label>
                    </div>
                    <button
                      onClick={addNewPatient}
                      className="mt-3 w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
                    >
                      Save Patient & Continue
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedPatient && (
              <div className="mb-6 pb-6 border-b border-gray-200 bg-primary-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{selectedPatient.firstName} {selectedPatient.lastName} </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {selectedPatient.mobile && <span>{selectedPatient.mobile}</span>}
                      {selectedPatient.email && <span className="ml-3">{selectedPatient.email}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPatient(null);
                      setHeaderData({
                        patientFirstName: '',
                        patientLastName: '',
                        email: '',
                        mobile: '',
                        doctor: '',
                        dob: '',
                        diagnosis: '',
                        date: new Date().toISOString().split('T')[0],
                      });
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Other Header Fields */}
            {selectedPatient && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Doctor</span>
                  <input
                    type="text"
                    value={headerData.doctor}
                    onChange={(e) => setHeaderData({ ...headerData, doctor: e.target.value })}
                    placeholder="Doctor name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Date</span>
                  <input
                    type="date"
                    value={headerData.date}
                    onChange={(e) => setHeaderData({ ...headerData, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </label>
                {/* <label className="col-span-full space-y-2">
                  <span className="text-sm font-medium text-gray-700">Diagnosis</span>
                  <input
                    type="text"
                    value={headerData.diagnosis}
                    onChange={(e) => setHeaderData({ ...headerData, diagnosis: e.target.value })}
                    placeholder="Diagnosis / complaint"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </label> */}
              </div>
            )}
            </div>
          </div>

          {selectedPatient && (
            <>
              {/* Medicines Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Medicines</h2>
                <p className="text-sm text-gray-600 mb-4">Add medicines with smart dosage selection and frequency patterns</p>

                {/* Medicine Input Form */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 mb-4">
                  <div className="space-y-4">
                    {/* Medicine Name */}
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Medicine Name</span>
                      <input
                        type="text"
                        placeholder="e.g., Paracetamol"
                        value={newMed.name}
                        onChange={(e) => handleMedicineNameChange(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        list="medicine-suggestions"
                      />
                      <datalist id="medicine-suggestions">
                        {commonMedicines.map(med => (
                          <option key={med} value={med} />
                        ))}
                      </datalist>
                    </label>

                    {/* Dosage - Medicine-based chips with Custom Input */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Dosage</span>
                      {/* Dosage chips and custom input on same line */}
                      <div className="flex flex-wrap gap-2 items-center">
                        {/* Suggested dosages based on medicine name */}
                        {newMed.name && medicineDosageMap[newMed.name] && (
                          <>
                            {medicineDosageMap[newMed.name].dosages.map((preset) => (
                              <button
                                key={preset}
                                onClick={() => setNewMed({ ...newMed, dosage: preset })}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition border-2 ${
                                  newMed.dosage === preset
                                    ? 'border-primary-600 bg-primary-600 text-white'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary-400'
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                          </>
                        )}
                        {/* Custom Dosage Input with Unit Selector */}
                        <input
                          type="text"
                          placeholder="Custom"
                          value={typeof newMed.dosage === 'string' && !medicineDosageMap[newMed.name]?.dosages.includes(newMed.dosage) ? newMed.dosage.replace(/[a-zA-Z\s\/]/g, '') : ''}
                          onChange={(e) => {
                            if (e.target.value || newMed.dosage === '') {
                              const unit = typeof newMed.dosage === 'string' ? newMed.dosage.replace(/[0-9.]/g, '').trim() || 'mg' : 'mg';
                              setNewMed({ ...newMed, dosage: e.target.value ? e.target.value + unit : '' });
                            }
                          }}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <select
                          value={typeof newMed.dosage === 'string' ? newMed.dosage.replace(/[0-9.]/g, '').trim() || 'mg' : 'mg'}
                          onChange={(e) => {
                            const num = typeof newMed.dosage === 'string' ? newMed.dosage.replace(/[a-zA-Z\s\/]/g, '') : '';
                            setNewMed({ ...newMed, dosage: num ? num + e.target.value : '' });
                          }}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        >
                          <option value="mg">mg</option>
                          <option value="ml">ml</option>
                          <option value="g">g</option>
                          <option value="tablet">tablet</option>
                          <option value="capsule">capsule</option>
                          <option value="drop">drop</option>
                          <option value="unit">unit</option>
                        </select>
                      </div>
                    </div>

                    {/* Frequency Pattern - Chips */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Frequency Pattern</span>
                      <div className="flex flex-wrap gap-2">
                        {dosagePatterns.map((p) => (
                          <button
                            key={p.pattern}
                            onClick={() => setNewMed({ ...newMed, pattern: p.pattern })}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition border-2 ${
                              newMed.pattern === p.pattern
                                ? 'border-primary-600 bg-primary-600 text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-primary-400'
                            }`}
                          >
                            {p.pattern}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Meal Timing - Chips */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Meal Timing</span>
                      <div className="flex flex-wrap gap-2">
                        {mealTimings.map((m) => (
                          <button
                            key={m.value}
                            onClick={() => setNewMed({ ...newMed, mealTiming: m.value })}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition border-2 ${
                              newMed.mealTiming === m.value
                                ? 'border-primary-600 bg-primary-600 text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-primary-400'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration - Chips with Custom Inline */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Duration</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        {['7 days', '2 weeks', '15 days', '1 month'].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setNewMed({ ...newMed, duration: preset })}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition border-2 ${
                              newMed.duration === preset
                                ? 'border-primary-600 bg-primary-600 text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-primary-400'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                        {/* Custom Duration Inline */}
                        <div className="flex gap-1.5 items-center ml-2">
                          <input
                            type="number"
                            placeholder="No."
                            min="1"
                            value={newMed.duration && !['7 days', '2 weeks', '15 days', '1 month'].includes(newMed.duration) ? newMed.duration.replace(/[^0-9]/g, '') : ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                const unit = newMed.duration?.replace(/[0-9]/g, '') || ' days';
                                setNewMed({ ...newMed, duration: e.target.value + unit });
                              }
                            }}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm w-14 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <select
                            value={newMed.duration && !['7 days', '2 weeks', '15 days', '1 month'].includes(newMed.duration) ? newMed.duration.replace(/[0-9]/g, '').trim() : 'days'}
                            onChange={(e) => {
                              const num = newMed.duration?.replace(/[^0-9]/g, '') || '1';
                              setNewMed({ ...newMed, duration: num + ' ' + e.target.value });
                            }}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                          >
                            <option value="days">days</option>
                            <option value="weeks">weeks</option>
                            <option value="months">months</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={addMedicine}
                    disabled={!newMed.name || !newMed.duration}
                    className="w-full mt-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <Plus size={18} className="inline mr-2" />
                    Add Medicine
                  </button>
                </div>

                {/* Added Medicines List */}
                {medicines.length > 0 ? (
                  <div className="space-y-3">
                    {medicines.map(med => (
                      <div key={med.id} className="bg-gradient-to-r from-blue-50 to-transparent border border-blue-200 rounded-lg p-4 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{med.name} {med.dosage && <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-xs font-medium mr-2">{med.dosage}</span>}</div>
                          <div className="text-sm text-gray-700 mt-1">
                            <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-xs font-medium">{getPatternDisplay(med)}</span>
                            {' • '}
                            <span className="text-gray-600">{getMealLabel(med.mealTiming)}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{med.duration}</div>
                        </div>
                        <button
                          onClick={() => removeMedicine(med.id)}
                          className="text-red-600 hover:text-red-800 ml-4 flex-shrink-0"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No medicines added yet. Add one above.
                  </div>
                )}
              </div>

              {/* Lab Tests Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Lab Tests</h2>
                <p className="text-sm text-gray-600 mb-4">Add lab tests with their specific requirements (empty stomach, early morning, etc.)</p>

                {/* Lab Test Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Lab Test</label>
                  <div className="relative">
                    <button
                      onClick={() => setNewLabTest(newLabTest ? null : 'open')}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="text-gray-700">{newLabTest === 'open' ? 'Choose test...' : 'Select a test'}</span>
                      <ChevronDown size={18} className="text-gray-400" />
                    </button>
                    
                    {newLabTest === 'open' && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        {['Blood', 'Urine', 'Imaging', 'Cardiac'].map(category => (
                          <div key={category}>
                            <div className="px-4 py-2 bg-gray-100 font-medium text-gray-900 text-sm sticky top-0">{category} Tests</div>
                            {labTestsList
                              .filter(t => t.category === category)
                              .map(test => (
                                <button
                                  key={test.id}
                                  onClick={() => addLabTest(test)}
                                  className="w-full text-left px-4 py-2 hover:bg-primary-50 border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="font-medium text-gray-900">{test.name}</div>
                                  <div className="text-xs text-gray-500 italic">{test.requirement}</div>
                                </button>
                              ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Added Lab Tests */}
                {labTests.length > 0 ? (
                  <div className="space-y-3">
                    {labTests.map(test => (
                      <div key={test.id} className="bg-gradient-to-r from-amber-50 to-transparent border border-amber-200 rounded-lg p-4 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{test.name}</div>
                          <div className="text-sm text-amber-800 mt-1 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                            {test.requirement}
                          </div>
                        </div>
                        <button
                          onClick={() => removeLabTest(test.id)}
                          className="text-red-600 hover:text-red-800 ml-4 flex-shrink-0"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No lab tests added yet. Select one above.
                  </div>
                )}
              </div>

              {/* Notes and Follow-up */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
                <textarea
                  rows={4}
                  placeholder="Follow-up instructions, special notes, lifestyle changes, etc."
                  className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Previous Prescriptions */}
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-white rounded-lg shadow-md p-6 border-2 border-amber-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Previous Prescriptions</h3>
                    <p className="text-sm text-gray-500">Review past prescriptions for this patient if needed.</p>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all
                  </button>
                </div>

                <div className="space-y-4">
                  {prevPrescriptions.map((rx) => (
                    <div key={rx.id} className="rounded-2xl border border-gray-200 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>#{rx.id}</span>
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">{rx.status}</span>
                          </div>
                          <div className="text-base font-semibold">{rx.patient}</div>
                          <div className="text-sm text-gray-600">{rx.diagnosis}</div>
                        </div>
                        <div className="text-sm text-gray-500">{rx.doctor} • {rx.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar - Templates */}
        <aside className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Template Selector</h3>
                <p className="text-sm text-gray-500">Select a template to prefill the prescription quickly.</p>
              </div>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Manage
              </button>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 mb-4">
              <Search className="text-gray-400" size={18} />
              <input type="text" placeholder="Search templates..." className="w-full outline-none" />
            </div>
            <div className="space-y-3">
              {templates.map((template, index) => (
                <div key={index} className="flex items-center gap-3 rounded-2xl border border-gray-200 px-3 py-3">
                  <div className="w-11 h-11 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{template.name}</div>
                    <div className="text-sm text-gray-500">{template.count} uses</div>
                  </div>
                  <button className="ml-auto text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Pro Tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span>•</span>
                <span>Click dosage chips for quick selection</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>After adding medicine, expand frequency for Morning/Afternoon/Night</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span><strong>Lab tests</strong> auto-show requirements for patient clarity</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Search patient by name or create a new one</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
