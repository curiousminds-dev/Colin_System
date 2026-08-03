import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, ChevronLeft, ChevronRight, Save, User, GraduationCap, Users, Bus, Phone, ShieldCheck, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const steps = [
  { id: 1, label: 'Personal details', icon: User },
  { id: 2, label: 'Enrolment', icon: GraduationCap },
  { id: 3, label: 'Guardian details', icon: Users },
  { id: 4, label: 'Boarding and transport', icon: Bus },
  { id: 5, label: 'Emergency contact', icon: Phone },
  { id: 6, label: 'Consent and privacy', icon: ShieldCheck },
  { id: 7, label: 'QR credential', icon: QrCode },
];

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  otherNames: z.string().optional(),
  gender: z.enum(['male', 'female']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  admissionNumber: z.string().min(3, 'Admission number is required'),
  lin: z.string().min(3, 'LIN is required'),
  classId: z.string().min(1, 'Class is required'),
  streamName: z.string().min(1, 'Stream is required'),
  enrollmentDate: z.string().min(1, 'Enrolment date is required'),
  guardianName: z.string().min(2, 'Guardian name is required'),
  guardianRelationship: z.string().min(2, 'Relationship is required'),
  guardianPhone: z.string().min(10, 'Valid phone number required'),
  guardianEmail: z.string().email('Valid email required').optional().or(z.literal('')),
  boardingStatus: z.enum(['day', 'boarding']),
  dormitoryId: z.string().optional(),
  transportRoute: z.string().optional(),
  emergencyName: z.string().min(2, 'Emergency contact name required'),
  emergencyPhone: z.string().min(10, 'Valid phone number required'),
  consentData: z.boolean(),
  consentPhotos: z.boolean(),
  consentMedical: z.boolean(),
  qrToken: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function LearnerRegistrationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  const { register, handleSubmit, formState: { errors }, trigger, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nationality: 'Ugandan',
      boardingStatus: 'day',
      consentData: false,
      consentPhotos: false,
      consentMedical: false,
    },
  });

  const fieldError = (name: keyof FormData) => errors[name]?.message as string | undefined;

  const next = async () => {
    const fieldsByStep: Record<number, (keyof FormData)[]> = {
      1: ['firstName', 'lastName', 'gender', 'dateOfBirth', 'nationality'],
      2: ['admissionNumber', 'lin', 'classId', 'streamName', 'enrollmentDate'],
      3: ['guardianName', 'guardianRelationship', 'guardianPhone'],
      4: ['boardingStatus'],
      5: ['emergencyName', 'emergencyPhone'],
      6: ['consentData', 'consentPhotos', 'consentMedical'],
    };
    const valid = await trigger(fieldsByStep[step] as (keyof FormData)[]);
    if (valid) setStep((s) => Math.min(s + 1, steps.length));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = (data: FormData) => {
    console.log('Registered:', data);
    setConfirmed(true);
    toast.success('Learner registered successfully');
  };

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-xl font-semibold text-navy">Learner Registered Successfully</h2>
        <p className="mt-2 max-w-md text-center text-sm text-slate-500">
          The learner record has been created. A QR credential can now be generated and printed for identity verification.
        </p>
        <div className="mt-6 flex gap-2">
          <Button variant="outline" onClick={() => navigate('/learners')}>Back to learners</Button>
          <Button onClick={() => { setConfirmed(false); setStep(1); }}>Register another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 lg:p-6">
      <div className="mb-6">
        <button onClick={() => navigate('/learners')} className="mb-3 flex items-center gap-1 text-xs text-slate-500 hover:text-navy">
          <ChevronLeft className="h-3.5 w-3.5" /> Back to learners
        </button>
        <h1 className="text-xl font-semibold text-navy">Register New Learner</h1>
        <p className="mt-1 text-sm text-slate-500">Complete all steps to enrol a new learner and generate identity credentials.</p>
      </div>

      {/* Stepper */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                step === s.id ? 'bg-cyan-brand text-white' : step > s.id ? 'bg-success/10 text-success' : 'bg-slate-100 text-slate-400',
              )}
            >
              {step > s.id ? <Check className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.id}</span>
            </div>
            {i < steps.length - 1 && <ChevronRight className="mx-0.5 h-3 w-3 text-slate-300" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy">Personal details</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="First name" required error={fieldError('firstName')}>
                  <Input {...register('firstName')} placeholder="Amina" className="h-9 text-xs" />
                </FormField>
                <FormField label="Last name" required error={fieldError('lastName')}>
                  <Input {...register('lastName')} placeholder="Nansubuga" className="h-9 text-xs" />
                </FormField>
                <FormField label="Other names">
                  <Input {...register('otherNames')} placeholder="Optional" className="h-9 text-xs" />
                </FormField>
                <FormField label="Gender" required error={fieldError('gender')}>
                  <select {...register('gender')} className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </FormField>
                <FormField label="Date of birth" required error={fieldError('dateOfBirth')}>
                  <Input type="date" {...register('dateOfBirth')} className="h-9 text-xs" />
                </FormField>
                <FormField label="Nationality" required error={fieldError('nationality')}>
                  <Input {...register('nationality')} placeholder="Ugandan" className="h-9 text-xs" />
                </FormField>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy">Enrolment details</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Admission number" required error={fieldError('admissionNumber')} help="Format: NC/YYYY/NNNN">
                  <Input {...register('admissionNumber')} placeholder="NC/2026/1001" className="h-9 text-xs" />
                </FormField>
                <FormField label="Learner Identification Number (LIN)" required error={fieldError('lin')} help="Ministry-issued unique ID">
                  <Input {...register('lin')} placeholder="LIN-100001" className="h-9 text-xs" />
                </FormField>
                <FormField label="Class" required error={fieldError('classId')}>
                  <select {...register('classId')} className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs">
                    <option value="">Select class...</option>
                    <option value="c1">Senior One</option>
                    <option value="c2">Senior Two</option>
                    <option value="c3">Senior Three</option>
                    <option value="c4">Senior Four</option>
                    <option value="c5">Senior Five</option>
                    <option value="c6">Senior Six</option>
                  </select>
                </FormField>
                <FormField label="Stream" required error={fieldError('streamName')}>
                  <select {...register('streamName')} className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs">
                    <option value="">Select stream...</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </FormField>
                <FormField label="Enrolment date" required error={fieldError('enrollmentDate')}>
                  <Input type="date" {...register('enrollmentDate')} className="h-9 text-xs" />
                </FormField>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy">Guardian details</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Guardian full name" required error={fieldError('guardianName')}>
                  <Input {...register('guardianName')} placeholder="John Nansubuga" className="h-9 text-xs" />
                </FormField>
                <FormField label="Relationship" required error={fieldError('guardianRelationship')}>
                  <select {...register('guardianRelationship')} className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs">
                    <option value="">Select...</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </FormField>
                <FormField label="Phone number" required error={fieldError('guardianPhone')} help="+256 7XX XXX XXX">
                  <Input {...register('guardianPhone')} placeholder="+256 77X XXX XXX" className="h-9 text-xs" />
                </FormField>
                <FormField label="Email (optional)" error={fieldError('guardianEmail')}>
                  <Input {...register('guardianEmail')} placeholder="guardian@gmail.com" className="h-9 text-xs" />
                </FormField>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy">Boarding and transport</h3>
              <FormField label="Boarding status" required error={fieldError('boardingStatus')}>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs cursor-pointer hover:bg-slate-50">
                    <input type="radio" value="day" {...register('boardingStatus')} className="text-cyan-brand" />
                    Day scholar
                  </label>
                  <label className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs cursor-pointer hover:bg-slate-50">
                    <input type="radio" value="boarding" {...register('boardingStatus')} className="text-cyan-brand" />
                    Boarding
                  </label>
                </div>
              </FormField>
              {watch('boardingStatus') === 'boarding' && (
                <FormField label="Dormitory" help="Assign a dormitory for boarding learners">
                  <select {...register('dormitoryId')} className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs">
                    <option value="">Select dormitory...</option>
                    <option value="d1">Nile Boys Dormitory</option>
                    <option value="d2">Victoria Boys Dormitory</option>
                    <option value="d3">Pearl Girls Dormitory</option>
                    <option value="d4">Equator Girls Dormitory</option>
                  </select>
                </FormField>
              )}
              <FormField label="Transport route (optional)" help="For day scholars using school transport">
                <Input {...register('transportRoute')} placeholder="Route 03 — Kololo" className="h-9 text-xs" />
              </FormField>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy">Emergency contact</h3>
              <p className="text-xs text-slate-500">This person will be contacted in case of an emergency if the primary guardian is unreachable.</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Emergency contact name" required error={fieldError('emergencyName')}>
                  <Input {...register('emergencyName')} placeholder="Mary Nansubuga" className="h-9 text-xs" />
                </FormField>
                <FormField label="Emergency contact phone" required error={fieldError('emergencyPhone')}>
                  <Input {...register('emergencyPhone')} placeholder="+256 77X XXX XXX" className="h-9 text-xs" />
                </FormField>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy">Consent and privacy</h3>
              <div className="space-y-3">
                {[
                  { name: 'consentData' as const, label: 'I confirm that the data provided is accurate and consent to its use for school administration purposes.' },
                  { name: 'consentPhotos' as const, label: 'I consent to the use of the learner\'s photograph for identification and school records only.' },
                  { name: 'consentMedical' as const, label: 'I consent to the school providing first aid and seeking medical attention in emergencies.' },
                ].map((c) => (
                  <label key={c.name} className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" {...register(c.name)} className="mt-0.5 rounded border-border text-cyan-brand" />
                    <span className="text-xs text-navy">{c.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy">QR credential</h3>
              <p className="text-xs text-slate-500">
                A QR credential will be generated containing an opaque token. No personal information is encoded in the QR code itself.
                The token is linked to this learner record in the secure database.
              </p>
              <div className="flex flex-col items-center rounded-lg border border-dashed border-border bg-slate-50 p-8">
                <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-white shadow-sm">
                  <QrCode className="h-16 w-16 text-navy" />
                </div>
                <p className="mt-3 text-xs text-slate-500">QR code will be generated upon completion</p>
              </div>
              <FormField label="Credential token (auto-generated)" help="You may override with a pre-assigned token">
                <Input {...register('qrToken')} placeholder="Auto-generated on save" className="h-9 text-xs" />
              </FormField>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            {step > 1 && (
              <Button type="button" variant="outline" size="sm" onClick={prev}>
                <ChevronLeft className="mr-1.5 h-3.5 w-3.5" /> Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm">
              <Save className="mr-1.5 h-3.5 w-3.5" /> Save draft
            </Button>
            {step < steps.length ? (
              <Button type="button" size="sm" onClick={next}>
                Next <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button type="submit" size="sm">
                <Check className="mr-1.5 h-3.5 w-3.5" /> Complete registration
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, required, error, help, children }: { label: string; required?: boolean; error?: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {label} {required && <span className="text-danger">*</span>}
      </Label>
      {children}
      {help && !error && <p className="text-[10px] text-slate-400">{help}</p>}
      {error && <p className="text-[10px] text-danger">{error}</p>}
    </div>
  );
}
