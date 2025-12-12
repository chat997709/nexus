
import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { StoreScreen } from './components/StoreScreen';
import { NexusWalletScreen } from './components/NexusWalletScreen';
import { LibraryScreen } from './components/LibraryScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ControlSelectScreen } from './components/ControlSelectScreen';
import { GenreSelectScreen } from './components/GenreSelectScreen';
import { SubscriptionScreen } from './components/SubscriptionScreen';
import { SplashScreen } from './components/SplashScreen';
import { Navigation } from './components/BottomTabs';
import { NotificationProvider } from './components/NotificationSystem';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { TabRoute, User, Game, Transaction } from './types';
import { MOCK_GAMES } from './constants';
import { UserManager } from './userManager';
import { auth, isConfigured } from './firebaseConfig'; 
import { Sun, Moon, Globe } from 'lucide-react';
import { App as CapacitorApp } from '@capacitor/app';

const AppContent: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabRoute>('Store');
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  
  // Game Data State (Populated by Splash Screen)
  const [allGames, setAllGames] = useState<Game[]>(MOCK_GAMES);
  
  // Theme State
  const [isDark, setIsDark] = useState(true);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

  // 0: Welcome, 1: Control Select, 2: Genre Select, 3: Subscription, 4: App Loaded
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  // Apply theme class to html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle Hardware Back Button (Android)
  useEffect(() => {
    try {
      CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          CapacitorApp.exitApp();
        } else {
          window.history.back();
        }
      });
    } catch (e) {
      // Ignore if not running in Capacitor/Android
    }
  }, []);

  // Auth Listener
  useEffect(() => {
    let mounted = true;
    const safetyTimeout = setTimeout(() => {
        if (mounted && isLoading) {
            console.warn("Auth initialization timed out, forcing UI load.");
            setIsLoading(false);
        }
    }, 5000);

    const initAuth = () => {
        if (isConfigured && auth) {
            // Firebase Listener (v8 compat style)
            const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: any) => {
                if (!mounted) return;
                
                if (firebaseUser) {
                    setFirebaseUid(firebaseUser.uid);
                    const profile = await UserManager.getUserProfile(firebaseUser.uid);
                    if (profile) {
                        setCurrentUser(profile);
                        setIsGuest(false);
                        setOnboardingStep(4);
                        setActiveTab('Profile');
                    } else {
                        // User logged in but no profile data yet
                    }
                } else {
                    setFirebaseUid(null);
                    if (!isGuest) {
                        setCurrentUser(null);
                        setOnboardingStep(0);
                    }
                }
                setIsLoading(false);
            });
            return unsubscribe;
        } else {
            // Fallback for Mock / Offline
            const mockUid = localStorage.getItem('nexus_mock_uid');
            if (mockUid) {
                setFirebaseUid(mockUid);
                UserManager.getUserProfile(mockUid).then(profile => {
                    if (profile && mounted) {
                        setCurrentUser(profile);
                        setIsGuest(false);
                        setOnboardingStep(4);
                        setActiveTab('Profile');
                    }
                });
            }
            if (mounted) setIsLoading(false);
            return () => {};
        }
    };
    
    const unsubscribe = initAuth();
    
    return () => {
        mounted = false;
        clearTimeout(safetyTimeout);
        if(typeof unsubscribe === 'function') unsubscribe();
    };
  }, [isGuest]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'ru' : 'en');

  const handleSplashComplete = (enrichedGames: Game[]) => {
      setAllGames(enrichedGames);
      setShowSplash(false);
  };

  const handleLogin = (user: User, guestMode: boolean) => {
    setCurrentUser(user);
    setIsGuest(guestMode);
    
    if (guestMode) {
      setOnboardingStep(0);
    } else {
      setOnboardingStep(4);
      setActiveTab('Profile');
    }
  };

  const handleLogout = async () => {
    if (isGuest) {
      setCurrentUser(null);
      setIsGuest(false);
      setOnboardingStep(0);
      setActiveTab('Store');
    } else {
      if (isConfigured && auth) {
          try {
            await auth.signOut();
          } catch (e) {
            console.error("Logout failed", e);
          }
      } else {
          localStorage.removeItem('nexus_mock_uid');
          setFirebaseUid(null);
          setCurrentUser(null);
          setOnboardingStep(0);
      }
    }
  };

  // --- User Updates ---
  const handleUpdateUser = (data: Partial<User>) => {
      if (!currentUser) return;
      
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      
      if (!isGuest && firebaseUid) {
          UserManager.updateUser(firebaseUid, data);
      }
  };

  const handlePurchase = (game: Game): { success: boolean; message: string; code: 'SUCCESS' | 'INSUFFICIENT_FUNDS' | 'ALREADY_OWNED' | 'ERROR' } => {
    if (!currentUser) return { success: false, message: 'User not logged in', code: 'ERROR' };

    if (currentUser.ownedGameIds && currentUser.ownedGameIds.includes(game.id)) {
        return { success: false, message: t('error_owned_msg'), code: 'ALREADY_OWNED' };
    }

    const currentOwned = currentUser.ownedGameIds || [];
    const currentTransactions = currentUser.transactions || [];
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'PURCHASE',
      amount: game.price,
      date: new Date().toISOString(),
      description: game.title
    };

    let updatedUser: User | null = null;

    if (game.isFree) {
        updatedUser = {
            ...currentUser,
            ownedGameIds: [...currentOwned, game.id],
            transactions: [newTransaction, ...currentTransactions],
            stats: { ...currentUser.stats, gamesOwned: currentUser.stats.gamesOwned + 1 }
        };
    } 
    else if (currentUser.stats.credits >= game.price) {
        const newBalance = currentUser.stats.credits - game.price;
        updatedUser = {
            ...currentUser,
            ownedGameIds: [...currentOwned, game.id],
            transactions: [newTransaction, ...currentTransactions],
            stats: { ...currentUser.stats, credits: newBalance, gamesOwned: currentUser.stats.gamesOwned + 1 }
        };
    } else {
        const missing = (game.price - currentUser.stats.credits).toFixed(2);
        return { success: false, message: `${t('error_funds_title')}. Missing $${missing}.`, code: 'INSUFFICIENT_FUNDS' };
    }

    if (updatedUser) {
        setCurrentUser(updatedUser);
        if (!isGuest && firebaseUid) {
            UserManager.updateUser(firebaseUid, {
                ownedGameIds: updatedUser.ownedGameIds,
                transactions: updatedUser.transactions,
                stats: updatedUser.stats
            });
        }
        return { success: true, message: game.isFree ? `${game.title} added!` : t('success_purchase_title'), code: 'SUCCESS' };
    }

    return { success: false, message: 'Error processing', code: 'ERROR' };
  };

  const handleTopUp = (amount: number, bonusPercent: number) => {
    if (!currentUser) return;
    const bonus = amount * (bonusPercent / 100);
    const total = amount + bonus;
    const currentTransactions = currentUser.transactions || [];
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'TOP_UP',
      amount: total,
      date: new Date().toISOString(),
      description: t('tx_topup')
    };
    const updatedUser = {
      ...currentUser,
      transactions: [newTransaction, ...currentTransactions],
      stats: { ...currentUser.stats, credits: currentUser.stats.credits + total }
    };
    setCurrentUser(updatedUser);
    if (!isGuest && firebaseUid) {
        UserManager.updateUser(firebaseUid, {
            transactions: updatedUser.transactions,
            stats: updatedUser.stats
        });
    }
  };

  const handleBonus = (amount: number) => {
      if (!currentUser) return;
      const currentTransactions = currentUser.transactions || [];
      const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'BONUS',
          amount: amount,
          date: new Date().toISOString(),
          description: t('tx_bonus')
      };
      const updatedUser = {
          ...currentUser,
          transactions: [newTransaction, ...currentTransactions],
          stats: { ...currentUser.stats, credits: currentUser.stats.credits + amount }
      };
      setCurrentUser(updatedUser);
      if (!isGuest && firebaseUid) {
          UserManager.updateUser(firebaseUid, {
              transactions: updatedUser.transactions,
              stats: updatedUser.stats
          });
      }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (isLoading && !currentUser) {
     return <div className="min-h-screen bg-nexus-dark flex items-center justify-center text-nexus-cyan font-mono animate-pulse">{t('loading')}</div>; 
  }

  return (
    <div className={`min-h-screen w-full flex font-sans antialiased selection:bg-nexus-cyan selection:text-black transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <div className="w-full h-[100dvh] relative flex flex-col md:flex-row overflow-hidden backdrop-blur-sm bg-white/60 dark:bg-black/20 transition-all duration-300">
        
        {currentUser && onboardingStep === 4 && (
             <div className="hidden md:block h-full z-50">
                 <Navigation activeTab={activeTab} onTabChange={setActiveTab} orientation="vertical" />
             </div>
        )}

        <div className="flex-1 flex flex-col relative h-full overflow-hidden">
            
            {/* Mobile Status Bar (Visual Only, real OS bar is above) */}
            <div className="h-safe-top w-full flex md:hidden items-end justify-between px-6 pb-2 text-xs font-medium select-none z-50 bg-gradient-to-b from-white/80 dark:from-black/50 to-transparent absolute top-0 left-0 right-0 text-gray-800 dark:text-white transition-colors duration-300 pointer-events-none">
              <span className="drop-shadow-md">Nexus OS</span>
              <div className="flex items-center gap-1.5 pointer-events-auto">
                 {/* Mobile Lang Toggle */}
                 <button onClick={toggleLanguage} className="mr-2 px-1.5 py-0.5 bg-black/20 dark:bg-white/20 rounded text-[9px] font-bold uppercase backdrop-blur-md">
                    {language}
                 </button>
                 <div className="flex gap-1.5 items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-800/40 dark:bg-white/20"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-800/40 dark:bg-white/20"></span>
                    <div className="w-5 h-2.5 border border-gray-800/40 dark:border-white/40 rounded-sm relative">
                        <div className="absolute inset-0.5 bg-gray-800 dark:bg-white rounded-[1px] w-[70%]"></div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Desktop Top Bar */}
            <div className="hidden md:flex h-16 w-full items-center justify-between px-8 border-b border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-md z-40">
                <div className="text-xl font-black tracking-widest text-gray-900 dark:text-white">
                    NEXUS <span className="text-nexus-cyan">PLAY</span>
                </div>
                <div className="flex items-center gap-4">
                     <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/20 text-xs font-bold uppercase">
                        <Globe className="w-4 h-4" /> {language === 'en' ? 'English' : 'Русский'}
                     </button>
                     <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/20">
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                     </button>
                     {currentUser && (
                         <div className="flex items-center gap-3 pl-4 border-l border-gray-300 dark:border-white/10">
                             <div className="text-right hidden lg:block">
                                 <div className="text-sm font-bold text-gray-900 dark:text-white">{currentUser.name}</div>
                                 <div className="text-xs text-nexus-cyan font-mono">{t('profile_lvl')} 42</div>
                             </div>
                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nexus-cyan to-blue-600 p-[2px]">
                                 <img src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}+${currentUser.surname}&background=0D8ABC&color=fff`} className="rounded-full w-full h-full object-cover" alt="Avatar" />
                             </div>
                         </div>
                     )}
                </div>
            </div>

            {/* Mobile Theme Toggle (Floating) */}
            <div className="md:hidden absolute top-12 right-4 z-50">
                 <button onClick={toggleTheme} className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg text-white">
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                 </button>
            </div>

            <NotificationProvider>
              <div className="flex-1 flex flex-col relative overflow-hidden md:p-0">
                {!currentUser ? (
                  <div className="flex-1 flex items-center justify-center">
                       <AuthScreen onLogin={handleLogin} />
                  </div>
                ) : (
                  <>
                    {onboardingStep === 0 && (
                      <WelcomeScreen onStart={() => setOnboardingStep(1)} />
                    )}
                    
                    {onboardingStep === 1 && (
                      <ControlSelectScreen onNext={(pref) => setOnboardingStep(2)} />
                    )}

                    {onboardingStep === 2 && (
                      <GenreSelectScreen onNext={(genres) => setOnboardingStep(3)} />
                    )}

                    {onboardingStep === 3 && (
                      <SubscriptionScreen onComplete={(plan) => {
                          setSubscriptionPlan(plan);
                          setOnboardingStep(4);
                          setActiveTab('Store');
                      }} />
                    )}

                    {onboardingStep === 4 && (
                      <div className="w-full h-full flex flex-col relative">
                        {activeTab === 'Store' && (
                            <StoreScreen 
                                games={allGames} 
                                userBalance={currentUser.stats.credits} 
                                ownedGameIds={currentUser.ownedGameIds || []}
                                onPurchase={handlePurchase} 
                                onNavigateWallet={() => setActiveTab('Wallet')}
                            />
                        )}
                        {activeTab === 'Library' && <LibraryScreen />}
                        {activeTab === 'Community' && <CommunityScreen user={currentUser} />}
                        {activeTab === 'Wallet' && (
                            <NexusWalletScreen 
                                userBalance={currentUser.stats.credits} 
                                transactions={currentUser.transactions || []}
                                onTopUp={handleTopUp}
                                onBonus={handleBonus} 
                            />
                        )}
                        {activeTab === 'Profile' && (
                            <ProfileScreen 
                                user={currentUser} 
                                onLogout={handleLogout} 
                                onUpdateUser={handleUpdateUser}
                                isDark={isDark}
                                toggleTheme={toggleTheme}
                                toggleLanguage={toggleLanguage}
                            />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </NotificationProvider>

            {currentUser && onboardingStep === 4 && (
                 <div className="block md:hidden z-50 pb-safe-bottom">
                    <Navigation activeTab={activeTab} onTabChange={setActiveTab} orientation="horizontal" />
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    )
}

export default App;
