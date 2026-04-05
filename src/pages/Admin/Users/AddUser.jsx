import React, { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import DetailsForm from './components/DetailsForm';

const AddUser = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('student');

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
        {step === 1 && (
          <div>
            <h3 className="text-xl font-black text-on-surface mb-8 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary">Step 1: Select User Role</h3>
            <RoleSelector selectedRole={selectedRole} onSelect={setSelectedRole} />
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl font-black text-on-surface mb-8 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary">Step 2: Basic Information</h3>
            <DetailsForm />
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
            disabled={step === 1}
            className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              step === 1 ? 'opacity-0' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
          >
            Back
          </button>
          
          <button 
            onClick={() => step < 3 ? setStep(step + 1) : alert('User Provisioned')}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3"
          >
            {step === 3 ? 'Confirm & Create' : 'Continue'}
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
