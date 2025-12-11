import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Chrome, Shield, ArrowLeft, CheckCircle, Lock, User as UserIcon, Calendar, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { User } from '../types';
import { UserManager } from '../userManager';
import { supabase, isConfigured } from '../supabaseClient';

interface AuthScreenProps {
  onLogin: (user: User, isGuest: boolean) => void;
}

type AuthStep = 'LANDING' | 'EMAIL_ENTRY' | 'PROFILE_SETUP';

interface AuthError {
    code: string;
    title: string;
    message: string;
    suggestion?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<AuthStep>('LANDING');
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState<AuthError | null>(null);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState('');
  
  const [isRegistering, setIsRegistering] = useState(false);

  // Check for existing session on mount (e.g. user verified email and returned)
  useEffect(() => {
    const checkSession = async () => {
        if (isConfigured) {
            const { data: { session } } = await supabase.auth.getSession();
            // If session exists but AuthScreen is still mounted, it means App.tsx couldn't find a profile.
            // Therefore, we must be in the Profile Setup phase.
            if (session) {
                setStep('PROFILE_SETUP');
            }
        }
    };
    checkSession();
  }, []);

  // --- Handlers ---

  const handleGuestLogin = () => {
    const guestUser: User = {
        email: 'guest@nexus.play',
        name: 'Guest',
        surname: 'Player',
        dob: '',
        ownedGameIds: [],
        transactions: [],
        stats: { hoursPlayed: 0, achievementsUnlocked: 0, gamesOwned: 0, credits: 0 }
    };
    onLogin(guestUser, true);
  };

  const handleDevBypass = () => {
      // Allow developer to bypass auth error if they can't fix backend immediately
      const mockUser: User = {
        email: 'dev@nexus.play',
        name: 'Dev',
        surname: 'User',
        dob: '2000-01-01',
        ownedGameIds: [],
        transactions: [],
        stats: { hoursPlayed: 999, achievementsUnlocked: 10, gamesOwned: 5, credits: 999 }
      };
      onLogin(mockUser, false);
  };

  const startGoogleFlow = async () => {
    setLoading(true);
    setErrorState(null);
    
    if (isConfigured) {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });

            if (error) throw error;
            // The OAuth flow will redirect the page, so no code after this runs immediately
        } catch (error: any) {
            console.error("Supabase Google Auth Error", error);
            
            let customError: AuthError = {
                code: error.code || 'unknown',
                title: "Authentication Failed",
                message: error.message
            };
            
            // Supabase specific hints for common setup errors
            if (error.message.includes("missing OAuth secret") || error.code === "validation_failed") {
                 customError.title = "Google Auth Not Configured";
                 customError.message = "The Google Login provider is enabled but missing the Client Secret in Supabase.";
                 customError.suggestion = "Go to Supabase Dashboard > Authentication > Providers > Google and enter your Client ID and Client Secret.";
                 // Mark code as bypassable
                 customError.code = 'config/missing_secret';
            } else if (error.message.includes("configuration")) {
                 customError.suggestion = "Check Google Provider settings in Supabase Authentication > Providers.";
            }

            setErrorState(customError);
            setLoading(false);
        }
    } else {
        setErrorState({
            code: 'config/missing',
            title: "Configuration Missing",
            message: "Valid Supabase keys not found in supabaseClient.ts",
            suggestion: "Please add your Supabase URL and Anon Key."
        });
        setLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !password) {
        setErrorState({ code: 'validation', title: "Missing Fields", message: "Please fill in all fields." });
        return;
    }
    setLoading(true);
    setErrorState(null);
    
    try {
        if (isConfigured) {
            if (isRegistering) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;

                // FIX: Only proceed to profile setup if a session is established immediately.
                // If email confirmation is enabled, session will be null.
                if (data.session) {
                     setStep('PROFILE_SETUP');
                } else if (data.user) {
                     window.alert(`Registration successful! Please check your email (${email}) to confirm your account before logging in.`);
                     setIsRegistering(false); // Return to login state
                     // Optional: setStep('LANDING'); 
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                
                if (error) throw error;
                // Listener in App.tsx will handle the rest
            }
        } else {
             setErrorState({
                code: 'config/missing',
                title: "Configuration Missing",
                message: "Valid Supabase credentials not found.",
                suggestion: "Check supabaseClient.ts"
            });
        }
    } catch (error: any) {
        console.error("Auth Error", error);
        let msg = error.message;
        
        setErrorState({
            code: error.code || 'auth_error',
            title: "Login Failed",
            message: msg
        });
    } finally {
        setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    if (!name || !surname || !dob) {
        window.alert("Please complete your profile.");
        return;
    }

    setLoading(true);
    
    const newUser: User = {
        email: email,
        name,
        surname,
        dob,
        ownedGameIds: [],
        transactions: [],
        stats: { hoursPlayed: 0, achievementsUnlocked: 0, gamesOwned: 0, credits: 50 }
    };

    try {
        if (isConfigured) {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                await UserManager.initializeUser(newUser, user.id);
                onLogin(newUser, false);
            } else {
                 // Enhanced error message for missing session
                 setErrorState({ 
                    code: 'auth/no-user', 
                    title: "Authentication Error", 
                    message: "No active session found. You may need to verify your email or log in again.",
                    suggestion: "If you just registered, please check your inbox for a confirmation link." 
                 });
            }
        } else {
             // Fallback
             setErrorState({ code: 'auth/no-user', title: "Error", message: "Config missing." });
        }
    } catch (e: any) {
        console.error("Profile Save Error", e);
        setErrorState({ code: 'profile_error', title: "Save Failed", message: e.message || "Unknown error" });
    } finally {
        setLoading(false);
    }
  };

  // --- Render Steps ---

  const renderErrorModal = () => {
      if (!errorState) return null;
      
      const isConfigError = errorState.code === 'config/missing' || errorState.code === 'config/missing_secret';
      
      return (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-nexus-card border border-red-500/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
                  <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-red-500/10 rounded-full">
                          <AlertTriangle className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                          <h3 className="text-white font-bold text-lg">{errorState.title}</h3>
                          <p className="text-gray-400 text-sm mt-1">{errorState.message}</p>
                      </div>
                  </div>
                  
                  {errorState.suggestion && (
                      <div className="bg-white/5 rounded-lg p-3 text-xs text-nexus-nav mb-4 border border-white/5">
                          <strong className="text-nexus-cyan block mb-1">Suggestion:</strong>
                          {errorState.suggestion}
                      </div>
                  )}

                  <div className="flex flex-col gap-2">
                      <button 
                          onClick={() => window.open('https://app.supabase.com/', '_blank')}
                          className="w-full py-3 rounded-xl bg-nexus-card border border-white/10 hover:bg-white/5 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                          <ExternalLink className="w-4 h-4" /> Open Supabase Console
                      </button>
                      
                      {/* Bypass Option for Devs */}
                      {isConfigError && (
                          <button 
                              onClick={handleDevBypass}
                              className="w-full py-3 rounded-xl bg-nexus-cyan/10 border border-nexus-cyan/30 hover:bg-nexus-cyan/20 text-nexus-cyan text-sm font-bold transition-colors mt-1"
                          >
                              Simulate Success (Dev Bypass)
                          </button>
                      )}

                      <button 
                          onClick={() => setErrorState(null)}
                          className="w-full py-3 text-gray-500 hover:text-white text-sm font-medium transition-colors"
                      >
                          Close
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  const renderLanding = () => (
    <div className="w-full max-w-sm flex flex-col items-center relative z-10">
        {!isConfigured && (
            <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-lg text-center animate-pulse">
                ⚠ Supabase Keys Missing<br/>
                Update supabaseClient.ts to enable login
            </div>
        )}

        {/* Mobile Logo */}
        <div className="mb-12 text-center animate-fade-in md:hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-nexus-dark to-nexus-card border border-white/10 mb-4 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                <Shield className="w-8 h-8 text-nexus-cyan" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                NEXUS <span className="text-nexus-cyan">PLAY</span>
            </h1>
            <p className="text-nexus-nav text-sm">Your Digital Identity</p>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block mb-12 text-center animate-fade-in">
             <h2 className="text-4xl font-bold text-white mb-3">Welcome Back</h2>
             <p className="text-nexus-nav text-sm">Login to access your library and wallet.</p>
        </div>

        <div className="w-full space-y-4 mb-8">
            <button
                onClick={startGoogleFlow}
                className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95 hover:bg-gray-100"
            >
                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white">
                        <Chrome className="w-5 h-5 text-gray-800" />
                </div>
                <span>Continue with Google</span>
            </button>

            <button
                onClick={() => setStep('EMAIL_ENTRY')}
                className="w-full bg-nexus-card border border-white/10 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-colors hover:border-nexus-cyan/50 hover:bg-white/5 active:scale-95"
            >
                <Mail className="w-5 h-5 text-nexus-cyan" />
                <span>Email / Password</span>
            </button>
        </div>

        <div className="w-full flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span className="text-xs text-nexus-nav uppercase font-bold">OR</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>

        <button
            onClick={handleGuestLogin}
            className="text-nexus-nav hover:text-white text-sm font-medium transition-colors flex items-center gap-2 group p-2"
        >
            Continue as Guest
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
    </div>
  );

  const renderEmailEntry = () => (
      <div className="w-full max-w-sm relative z-10">
        <button onClick={() => setStep('LANDING')} className="text-nexus-nav hover:text-white mb-6 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
        
        <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs text-nexus-nav uppercase font-bold ml-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-nexus-card border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-nexus-cyan transition-colors"
                        placeholder="name@example.com"
                    />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs text-nexus-nav uppercase font-bold ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-nexus-card border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-nexus-cyan transition-colors"
                        placeholder="••••••••"
                    />
                </div>
            </div>
        </div>

        <button 
            onClick={handleEmailSubmit}
            disabled={loading}
            className="w-full mt-8 bg-nexus-cyan text-black font-bold py-3.5 rounded-xl active:scale-95 transition-all hover:bg-[#80FFFF]"
        >
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Log In')}
        </button>

        <div className="mt-6 text-center">
            <p className="text-sm text-nexus-nav">
                {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-nexus-cyan font-bold hover:underline"
                >
                    {isRegistering ? 'Log In' : 'Sign Up'}
                </button>
            </p>
        </div>
      </div>
  );

  const renderProfileSetup = () => (
    <div className="w-full max-w-sm relative z-10">
         <div className="mb-6 text-center">
            <div className="w-16 h-16 bg-nexus-cyan/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-nexus-cyan" />
            </div>
            <h2 className="text-2xl font-bold text-white">Complete Profile</h2>
            <p className="text-nexus-nav text-sm">One last step to set up your personal account.</p>
        </div>

        <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs text-nexus-nav uppercase font-bold ml-1">Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-nexus-card border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-nexus-cyan transition-colors"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-nexus-nav uppercase font-bold ml-1">Surname</label>
                    <input 
                        type="text" 
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="w-full bg-nexus-card border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-nexus-cyan transition-colors"
                    />
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-xs text-nexus-nav uppercase font-bold ml-1">Date of Birth</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    <input 
                        type="date" 
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-nexus-card border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-nexus-cyan transition-colors"
                    />
                </div>
             </div>
        </div>

        <button 
            onClick={handleProfileSave}
            disabled={loading}
            className="w-full mt-8 bg-nexus-cyan text-black font-bold py-3.5 rounded-xl active:scale-95 transition-all hover:bg-[#80FFFF]"
        >
            {loading ? 'Saving Profile...' : 'Save & Continue'}
        </button>
    </div>
  );

  return (
    <div className="w-full h-full flex bg-nexus-dark relative overflow-hidden z-30">
        {/* Desktop Left Side - Branding */}
        <div className="hidden md:flex w-1/2 bg-black/50 relative items-center justify-center overflow-hidden border-r border-white/5">
             {/* Background Gradients */}
             <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-nexus-cyan/5 rounded-full blur-[150px] animate-pulse-glow" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
             
             {/* Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

             <div className="relative z-10 text-center p-12 transform hover:scale-105 transition-transform duration-700">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-nexus-dark to-nexus-card border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                     <Shield className="w-12 h-12 text-nexus-cyan" />
                </div>
                <h1 className="text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
                    NEXUS <span className="text-nexus-cyan">PLAY</span>
                </h1>
                <p className="text-gray-400 text-lg font-mono tracking-widest uppercase">The Next Gen Digital Store</p>
             </div>
        </div>

        {/* Right Side / Mobile Full - Form Container */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
            {/* Mobile Background Effects */}
            <div className="absolute md:hidden top-[-10%] right-[-30%] w-[400px] h-[400px] bg-nexus-cyan/5 rounded-full blur-[120px]" />
            <div className="absolute md:hidden bottom-[-10%] left-[-30%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />

            {loading && (
                <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-nexus-cyan animate-spin" />
                </div>
            )}

            {/* Error Modal Overlay */}
            {renderErrorModal()}
            
            <div className="w-full max-w-sm relative z-10">
                {step === 'LANDING' && renderLanding()}
                {step === 'EMAIL_ENTRY' && renderEmailEntry()}
                {step === 'PROFILE_SETUP' && renderProfileSetup()}
            </div>
        </div>
    </div>
  );
};