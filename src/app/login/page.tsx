'use client';

import { useState } from 'react';
import { FileSearch, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ADMIN_ID = 'admin@123';
const ADMIN_PASSWORD = 'admin123';

type LoginRole = 'user' | 'admin';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<LoginRole>('user');
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signIn = () => {
    if (role === 'admin' && (adminId !== ADMIN_ID || adminPassword !== ADMIN_PASSWORD)) {
      setError('Admin ID or password is incorrect.');
      return;
    }

    if (role === 'user') {
      if (!fullName.trim() || !email.trim() || !password) {
        setError('Full name, email, and password are required.');
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError('Enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      sessionStorage.setItem('lbb-user-name', fullName.trim());
      sessionStorage.setItem('lbb-user-email', email.trim());
    }

    sessionStorage.setItem('lbb-role', role);
    sessionStorage.setItem('lbb-authenticated', 'true');
    router.push(role === 'admin' ? '/authority-dashboard' : '/upload-ingest');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6" style={{ background: '#212121' }}>
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-7 shadow-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
          <ShieldCheck size={22} className="text-primary" />
        </div>
        <p className="mt-5 text-center text-2xs uppercase tracking-[0.18em] text-muted-foreground">Leaked Before Bell</p>
        <h1 className="mt-2 text-center text-xl font-semibold text-foreground">Choose account type</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Use the user workspace to submit a suspicious paper or the admin workspace to review all authority data.</p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <RoleButton active={role === 'user'} icon={UserRound} label="User" detail="Submit paper" onClick={() => { setRole('user'); setError(''); }} />
          <RoleButton active={role === 'admin'} icon={LockKeyhole} label="Admin" detail="Review all data" onClick={() => { setRole('admin'); setError(''); }} />
        </div>

        {role === 'user' && (
          <div className="mt-5 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-foreground" htmlFor="full-name">Full name</label>
              <input id="full-name" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Enter your full name" autoComplete="name" className="mt-2 w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground" htmlFor="user-email">Email address</label>
              <input id="user-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className="mt-2 w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground" htmlFor="user-password">Password</label>
              <input id="user-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" autoComplete="current-password" className="mt-2 w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
            </div>
          </div>
        )}

        {role === 'admin' && (
          <div className="mt-5 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-foreground" htmlFor="admin-id">Admin ID</label>
              <input id="admin-id" type="text" value={adminId} onChange={(event) => setAdminId(event.target.value)} placeholder="Enter admin ID" autoComplete="username" className="mt-2 w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground" htmlFor="admin-password">Admin password</label>
              <input id="admin-password" type="password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') signIn(); }} placeholder="Enter admin password" autoComplete="current-password" className="mt-2 w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
            </div>
          </div>
        )}
        {error && <p className="mt-2 text-xs text-risk-high">{error}</p>}

        <button type="button" onClick={signIn} className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          {role === 'admin' ? <LockKeyhole size={15} /> : <FileSearch size={15} />}
          Continue as {role === 'admin' ? 'Admin' : 'User'}
        </button>
        <p className="mt-4 text-center text-2xs text-muted-foreground">Prototype login. Production access must be enforced server-side.</p>
      </div>
    </main>
  );
}

function RoleButton({ active, icon: Icon, label, detail, onClick }: { active: boolean; icon: typeof UserRound; label: string; detail: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-lg border px-3 py-3 text-left transition-colors ${active ? 'border-primary bg-primary/10' : 'border-border bg-muted hover:border-primary/40'}`}>
      <Icon size={17} className={active ? 'text-primary' : 'text-muted-foreground'} />
      <span className={`mt-2 block text-xs font-semibold ${active ? 'text-primary' : 'text-foreground'}`}>{label}</span>
      <span className="mt-1 block text-2xs text-muted-foreground">{detail}</span>
    </button>
  );
}
