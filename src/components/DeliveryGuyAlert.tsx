import { useState } from 'react';
import { Shield, Bell, CheckCircle2, Radio } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import SectionHeader from '../shared/SectionHeader';
import useTimeoutQueue from '../shared/useTimeoutQueue';
import getPublicAssetUrl from '../shared/getPublicAssetUrl';

export default function DeliveryGuyAlert() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [securityStatus, setSecurityStatus] = useState('Standby • Patio Perimeter 100% Secure');
  const [scaredScootersCount, setScaredScootersCount] = useState(148);
  const schedule = useTimeoutQueue();

  const triggerSecuritySimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSecurityStatus('ALERT: DELIVERY SCOOTER DETECTED AT 100M');

    schedule(() => {
      setSecurityStatus('PATROL_OS: DEPLOYING AUDIO WARNING PROTOCOL 🐾');
    }, 1000);

    schedule(() => {
      setSecurityStatus('THREAT NEUTRALIZED • PARCEL DROPPED SAFELY AT GATE');
      setScaredScootersCount(c => c + 1);
      setIsSimulating(false);
    }, 3000);
  };

  return (
    <section id="patrolos" className="py-20 sm:py-28 md:py-32 relative border-t border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={<><Shield className="w-3.5 h-3.5 text-zinc-600" />PatrolOS 4.0 Perimeter Defense</>}
          title="Zero-Tolerance Delivery Defense."
          description="A friendly companion indoors, an impassable front gate sentinel outdoors. No Amazon parcel or delivery scooter crosses the patio unannounced."
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
          
          {/* Left: Guard Illustration Frame */}
          <div className="lg:col-span-7">
            <Card variant="raised" className="p-4 sm:p-8 rounded-[36px] shadow-xl relative overflow-hidden">
              
              {/* Camera Header Bar */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSimulating ? 'bg-zinc-900 animate-ping' : 'bg-zinc-700'}`} />
                  <span className="font-bold">PATIO_CAM_02 • GATE_SENTRY</span>
                </div>

                <div className="px-3 py-1 rounded-full bg-zinc-100 font-mono text-xs text-zinc-800 font-semibold border border-zinc-200">
                  SCOOTERS DETERRED: {scaredScootersCount}
                </div>
              </div>

              {/* Guard Illustration */}
              <div className="relative aspect-square max-h-[380px] sm:max-h-[420px] mx-auto rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200 flex items-center justify-center p-3">
                <img 
                  src={getPublicAssetUrl('/images/luna_sticker_guard.jpg')}
                  alt="Luna guarding patio gate illustration"
                  className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                />

                {/* Live Alert Banner */}
                {isSimulating && (
                  <div className="absolute top-4 left-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur-md text-zinc-950 text-xs font-mono flex items-center justify-between border-2 border-zinc-900 shadow-xl animate-bounce">
                    <span className="flex items-center gap-2 font-bold">
                      <Radio className="w-4 h-4 text-zinc-900 animate-pulse" />
                      ACTIVE INTERCEPTION IN PROGRESS
                    </span>
                    <span className="text-[10px] bg-zinc-100 text-zinc-900 font-bold px-2 py-0.5 rounded border border-zinc-300">LVL 5 BARK</span>
                  </div>
                )}
              </div>

              {/* Bottom Quote Caption */}
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>"Sitting proudly beside her favorite plant pot."</span>
                <span className="text-zinc-900 font-bold">SENTINEL_ACTIVE</span>
              </div>

            </Card>
          </div>

          {/* Right: Security Control Terminal */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="raised" className="p-6 sm:p-8 rounded-3xl shadow-lg space-y-6">
              
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Live Terminal
                </div>
                <h3 className="font-display font-bold text-2xl text-zinc-950 mt-1">
                  Delivery Deterrence Control
                </h3>
              </div>

              {/* White Simulation Trigger Button */}
              <Button
                onClick={triggerSecuritySimulation}
                disabled={isSimulating}
                variant="primary"
                size="lg"
                className={`w-full py-4 rounded-2xl font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer ${
                  isSimulating
                    ? 'bg-zinc-100 text-zinc-900 border-2 border-zinc-900 scale-95'
                    : 'bg-white hover:bg-zinc-50 border-2 border-zinc-900 text-zinc-950 hover:scale-102 active:scale-98 shadow-md'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>{isSimulating ? 'SIMULATION IN PROGRESS...' : 'SIMULATE INCOMING DELIVERY'}</span>
              </Button>

              {/* Status Readout Box */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">System Status:</div>
                <div className="text-xs font-mono text-zinc-900 font-bold truncate">
                  {securityStatus}
                </div>
              </div>

              {/* Official Gate Rules */}
              <div className="space-y-3 pt-2 border-t border-zinc-100">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  Active Protocols:
                </div>
                
                <div className="space-y-2.5 text-xs text-zinc-600">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                    <span><b>Protocol Alpha:</b> Audible bark response triggered within 0.12s of scooter engine noise.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                    <span><b>Protocol Beta:</b> Immediate nasal inspection of cardboard box to confirm snack content.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                    <span><b>Protocol Gamma:</b> Tail wag propeller activated upon family retrieval.</span>
                  </div>
                </div>
              </div>

            </Card>
          </div>

        </div>

      </div>
    </section>
  );
}
