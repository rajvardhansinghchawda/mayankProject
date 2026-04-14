import React, { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import DetailsForm from './components/DetailsForm';
import api from '../../../services/api';

const AddUser = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    department_id: '',
    section_id: '',
    roll_number: '',
    enrollment_number: '',
    employee_id: '',
    designation: '',
  });
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  React.useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const resp = await api.get('/users/departments/');
        const data = resp.data?.data || resp.data?.results || resp.data || [];
        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load departments', err);
      }
    };
    fetchDepartments();
  }, []);

  React.useEffect(() => {
    const fetchSections = async () => {
      if (selectedRole !== 'student') return;
      try {
        const params = formData.department_id ? { department_id: formData.department_id } : {};
        const resp = await api.get('/users/sections/', { params });
        // Backend returns { success: true, data: [...] }
        const data = resp.data?.data || resp.data?.results || (Array.isArray(resp.data) ? resp.data : []);
        setSections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load sections', err);
      }
    };
    fetchSections();
  }, [selectedRole, formData.department_id]);

  const getValidationError = () => {
    if (step === 1 && !selectedRole) {
      return 'Please select a user role to continue.';
    }

    if (step !== 2) return '';

    if (!formData.full_name.trim()) return 'Full name is required.';
    if (!formData.email.trim()) return 'Institutional email is required.';

    if (selectedRole === 'student') {
      if (!formData.roll_number.trim()) return 'Roll number is required for students.';
      if (!formData.enrollment_number.trim()) return 'Enrollment number is required for students.';
      if (!formData.section_id) return 'Please select a section for the student.';
    }

    if (selectedRole === 'teacher') {
      if (!formData.employee_id.trim()) return 'Employee ID is required for teachers.';
      if (!formData.department_id) return 'Please select a department for the teacher.';
    }

    return '';
  };

  const handleContinue = async () => {
    setError('');
    setSuccess('');
    const validationError = getValidationError();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }

    const payload = {
      email: formData.email.trim(),
      full_name: formData.full_name.trim(),
      role: selectedRole,
    };

    if (selectedRole === 'student') {
      payload.roll_number = formData.roll_number.trim();
      payload.enrollment_number = formData.enrollment_number.trim();
      payload.section_id = formData.section_id;
    }

    if (selectedRole === 'teacher') {
      payload.employee_id = formData.employee_id.trim();
      payload.department_id = formData.department_id;
      payload.designation = formData.designation.trim();
    }

    setLoading(true);
    try {
      const resp = await api.post('/users/create/', payload);
      const createdUser = resp.data?.data;
      const defaultPassword = selectedRole === 'student'
        ? payload.roll_number
        : selectedRole === 'teacher'
          ? payload.employee_id
          : 'ChangeMe@2025';

      setSuccess(`User created: ${createdUser?.email || payload.email}. Temporary password: ${defaultPassword}`);
      setStep(1);
      setSelectedRole('');
      setFormData({
        full_name: '',
        email: '',
        department_id: '',
        section_id: '',
        roll_number: '',
        enrollment_number: '',
        employee_id: '',
        designation: '',
      });
    } catch (err) {
      console.error('Failed to create user', err);
      const backendError = err.response?.data?.errors || err.response?.data?.error || err.response?.data?.detail;
      setError(typeof backendError === 'string' ? backendError : JSON.stringify(backendError || 'Failed to create user'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-12 font-body">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4">Add Individual User</h1>
        <p className="text-on-surface-variant font-medium">Manually register a single user into the institutional ecosystem.</p>
        
        <div className="flex items-center justify-center gap-4 mt-10">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all border-2 ${
                step >= s ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-slate-100 text-slate-300'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 rounded-full ${step > s ? 'bg-primary' : 'bg-slate-100'}`}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[48px] p-8 lg:p-16 shadow-sm border border-slate-50 transition-all hover:shadow-xl">
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-2xl bg-green-50 border border-green-100 p-4 text-sm font-bold text-green-700">
            {success}
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-xl font-black text-on-surface mb-8 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary">Step 1: Select User Role</h3>
            <RoleSelector selectedRole={selectedRole} onSelect={setSelectedRole} />
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl font-black text-on-surface mb-8 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary">Step 2: Basic Information</h3>
            <DetailsForm
              role={selectedRole}
              formData={formData}
              setFormData={setFormData}
              departments={departments}
              sections={sections}
            />
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-10">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <span className="material-symbols-outlined text-4xl">verified_user</span>
            </div>
            <h3 className="text-2xl font-black text-on-surface mb-4">Ready to Provision</h3>
            <p className="text-slate-500 mb-10 max-w-md mx-auto">The user will be created and an invitation email will be sent to their institutional address immediately.</p>
            <div className="p-8 bg-slate-50 rounded-[32px] border border-white text-left max-w-sm mx-auto mb-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Summary</p>
              <div className="space-y-4">
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-slate-400">Name</span>
                  <span className="text-on-surface">{formData.full_name || '-'}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-slate-400">Email</span>
                  <span className="text-on-surface">{formData.email || '-'}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-slate-400">Role</span>
                  <span className="text-on-surface uppercase tracking-widest text-[10px]">{selectedRole}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-slate-400">Module</span>
                  <span className="text-on-surface">Institutional v2</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 flex items-center justify-between gap-6 pt-10 border-t border-slate-50">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1 || loading}
            className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              step === 1 ? 'opacity-0' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
          >
            Back
          </button>
          
          <button 
            onClick={handleContinue}
            disabled={loading}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-60"
          >
            {loading ? 'Creating...' : step === 3 ? 'Confirm & Create' : 'Continue'}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">person_add</span>
          <span className="material-symbols-outlined text-4xl">hail</span>
          <span className="material-symbols-outlined text-4xl">how_to_reg</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">IAM Managed Identity • Secure Provisioning Channel • SARAS Identity-v2</p>
      </div>
    </div>
  );
};

export default AddUser;
