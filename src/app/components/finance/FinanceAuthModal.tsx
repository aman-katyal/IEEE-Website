import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  KeyRound,
  ShieldCheck,
  Building2,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { REAL_COMMITTEES, type AuthSessionData } from './financeData';

export interface FinanceAuthModalProps {
  onLogin: (session: AuthSessionData) => void;
  defaultRole?: 'COMMITTEE_LEAD' | 'TREASURER';
  defaultCommitteeId?: string;
  committees?: { id: string; name: string }[];
}

export function FinanceAuthModal({
  onLogin,
  defaultRole = 'COMMITTEE_LEAD',
  defaultCommitteeId = 'rov',
  committees = REAL_COMMITTEES,
}: FinanceAuthModalProps) {
  const [role, setRole] = useState<'COMMITTEE_LEAD' | 'TREASURER'>(defaultRole);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>(defaultCommitteeId);
  const [pin, setPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRoleChange = (newRole: 'COMMITTEE_LEAD' | 'TREASURER') => {
    setRole(newRole);
    setPin('');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedPin = pin.trim();

    if (!trimmedPin) {
      setErrorMessage('Please enter your authentication PIN to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/finance/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: trimmedPin,
          role: role === 'TREASURER' ? 'treasurer' : 'committee',
          committeeId: role === 'COMMITTEE_LEAD' ? selectedCommitteeId : undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      setIsSubmitting(false);

      if (res.ok && (data.authenticated || data.success) && data.session) {
        if (data.session.token) {
          try {
            sessionStorage.setItem('boilerbooks_token', data.session.token);
            localStorage.setItem('boilerbooks_token', data.session.token);
          } catch {}
        }
        onLogin({
          role: data.session.role,
          committeeId: data.session.committeeId,
          committeeName: data.session.committeeName,
          name: data.session.name,
          email: data.session.email,
          token: data.session.token,
        });
        return;
      }

      setErrorMessage(
        data.message || data.error || 'Invalid authentication passcode. Please check your credentials or contact treasurer@purdueieee.org.'
      );
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Unable to connect to authentication service. Please check your network connection.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-[#121214]/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-xl overflow-hidden relative">
        {/* Glow accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 via-[#EBD3A9] to-sky-400" />

        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
            <span>BoilerBooks</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              3.0
            </span>
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm mt-1">
            Secure Financial Portal · Purdue IEEE Student Branch
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-4">
          {/* Role selector tabs */}
          <div
            role="tablist"
            aria-label="Role Selection"
            className="grid grid-cols-2 p-1 bg-slate-900/80 rounded-lg border border-slate-800 mb-6"
          >
            <button
              type="button"
              role="tab"
              aria-selected={role === 'COMMITTEE_LEAD'}
              aria-controls="role-panel-committee"
              id="role-tab-committee"
              onClick={() => handleRoleChange('COMMITTEE_LEAD')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-xs font-medium transition-all ${
                role === 'COMMITTEE_LEAD'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Committee Lead</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={role === 'TREASURER'}
              aria-controls="role-panel-treasurer"
              id="role-tab-treasurer"
              onClick={() => handleRoleChange('TREASURER')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-xs font-medium transition-all ${
                role === 'TREASURER'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Treasurer Master</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'COMMITTEE_LEAD' && (
              <div className="space-y-1.5" id="role-panel-committee" role="tabpanel" aria-labelledby="role-tab-committee">
                <Label htmlFor="committee-select" className="text-xs font-medium text-slate-300">
                  Select Technical Committee
                </Label>
                <Select
                  value={selectedCommitteeId}
                  onValueChange={(val) => setSelectedCommitteeId(val)}
                >
                  <SelectTrigger
                    id="committee-select"
                    data-testid="committee-select-trigger"
                    className="w-full bg-slate-900 border-slate-700 text-slate-100 h-10 focus:border-sky-500"
                  >
                    <SelectValue placeholder="Choose committee..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                    {(committees && committees.length > 0 ? committees : REAL_COMMITTEES).map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-slate-200 focus:bg-sky-600 focus:text-white">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {role === 'TREASURER' && (
              <div
                className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 flex items-start gap-2"
                id="role-panel-treasurer"
                role="tabpanel"
                aria-labelledby="role-tab-treasurer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-200">Executive Access Required:</span>{' '}
                  Master PIN grants branch-wide budget oversight, Purdue COOL exporter privileges, and dues reconciliation.
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pin-input" className="text-xs font-medium text-slate-300">
                  {role === 'TREASURER' ? 'Treasurer Master Passcode' : 'Committee Access Passcode'}
                </Label>
                <span className="text-[10px] text-slate-500 font-normal">
                  {role === 'TREASURER' ? 'Executive PIN required' : 'Committee PIN required'}
                </span>
              </div>

              <div className="relative">
                <Input
                  id="pin-input"
                  data-testid="pin-input"
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={role === 'TREASURER' ? 'Enter master passcode...' : 'Enter committee passcode...'}
                  className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 placeholder:font-sans placeholder:tracking-normal placeholder:opacity-50 pr-10 h-10 tracking-widest font-mono focus:border-sky-500"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none"
                  aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-xs text-red-300 flex items-start gap-2 animate-in fade-in-50 duration-200"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-medium h-10 shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : `Enter ${role === 'TREASURER' ? 'Treasurer' : 'Committee'} Portal`}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="px-6 py-4 bg-slate-900/40 border-t border-slate-800 text-center flex flex-col gap-1.5">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-[#EBD3A9]" />
            Protected by Cloudflare Workers & D1 Auth Middleware
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
