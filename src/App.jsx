import { useState, useEffect, useCallback, useRef } from 'react';
// Import motion from framer-motion for animations
import { motion, AnimatePresence } from 'framer-motion';

// --- NEW: ICONS FOR THEME TOGGLE ---
const SunIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m4.93 19.07 1.41-1.41"></path><path d="m17.66 6.34 1.41-1.41"></path></svg>
);
const MoonIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
);


// This pure function can live outside the component.
const generatePassword = (length, numbers, symbols) => {
  let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (numbers) charset += '0123456789';
  if (symbols) charset += '!@#$%^&*()_+[]{}|;:,.<>?/';
  let newPassword = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    newPassword += charset.charAt(randomIndex);
  }
  return newPassword;
};

function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [numbersAllowed, setNumbersAllowed] = useState(false);
  const [symbolsAllowed, setSymbolsAllowed] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  
  // --- NEW: State for theme management ---
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'

  const passwordRef = useRef(null);
  const cardRef = useRef(null); 

  // --- NEW: Effect to toggle .dark class on <html> ---
  useEffect(() => {
    // On mount or theme change, update the class on the <html> element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark'); // Remove previous theme
    root.classList.add(theme); // Add current theme
  }, [theme]);

  // --- NEW: Function to toggle the theme ---
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // --- MOUSE GLOW EFFECT ---
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };
    card.addEventListener('mousemove', handleMouseMove);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const passwordGenerator = useCallback(() => {
    const newPassword = generatePassword(length, numbersAllowed, symbolsAllowed);
    setPassword(newPassword);
  }, [length, numbersAllowed, symbolsAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    navigator.clipboard.writeText(password).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 500);
    });
  }, [password]);
  
  const handleReset = () => {
    setLength(12);
    setNumbersAllowed(true);
    setSymbolsAllowed(false);
    setCopyButtonText('Copy');
    passwordGenerator();
  };

  useEffect(() => {
    passwordGenerator();
  }, [length, numbersAllowed, symbolsAllowed, passwordGenerator]);

  // --- ANIMATION VARIANTS (No changes here) ---
  const cardVariants = { /* ... same as before */ };
  const itemVariants = { /* ... same as before */ };

  return (
    // UPDATED: Added theme classes and transition
    <div className="w-full min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-gray-100 flex flex-col items-center justify-center p-4 font-mono overflow-hidden transition-colors duration-300">
      
      {/* --- NEW: Theme Toggle Button --- */}
      <div className="absolute top-5 right-5">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <motion.div
        ref={cardRef}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        // UPDATED: Added theme classes
        className="glow-card w-full max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 border border-slate-200 dark:border-slate-000 relative"
      >
        <motion.div variants={itemVariants} className="text-center">
            {/* UPDATED: Added theme classes */}
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Password Generator</h1>
            <p className="text-slate-500 dark:text-slate-400">Create a strong and secure password.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center shadow-md rounded-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.input
              key={password}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              type="text"
              value={password}
              // UPDATED: Added theme classes
              className="w-full p-3 bg-slate-200 dark:bg-slate-900 text-teal-600 dark:text-teal-400 text-lg font-bold outline-none"
              placeholder="Your password..."
              readOnly
              ref={passwordRef}
            />
          </AnimatePresence>
          <motion.button
            onClick={copyPasswordToClipboard}
            // UPDATED: Replaced inline style hover with Tailwind classes for consistency
            whileTap={{ scale: 0.95 }}
            className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors"
          >
            {copyButtonText}
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* UPDATED: Added theme classes */}
            <label htmlFor="length" className="font-medium text-slate-600 dark:text-slate-300">Password Length: <span className="font-bold text-teal-600 dark:text-teal-400">{length}</span></label>
            <input id="length" type="range" min={8} max={32} value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              // UPDATED: Added theme classes
              className="w-full sm:w-1/2 h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>
          
          <div className="flex items-center gap-x-4">
             <div className="flex items-center gap-x-2">
              <input type="checkbox" id="numbers" checked={numbersAllowed} onChange={() => setNumbersAllowed((p) => !p)}
                // UPDATED: Added theme classes
                className="w-4 h-4 bg-slate-100 border-slate-300 dark:bg-gray-700 dark:border-gray-600 rounded cursor-pointer accent-teal-600 focus:ring-2 focus:ring-teal-500"
              />
              {/* UPDATED: Added theme classes */}
              <label htmlFor="numbers" className="font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none">Include Numbers</label>
            </div>
            
            <div className="flex items-center gap-x-2">
              <input type="checkbox" id="symbols" checked={symbolsAllowed} onChange={() => setSymbolsAllowed((p) => !p)}
                 // UPDATED: Added theme classes
                className="w-4 h-4 bg-slate-100 border-slate-300 dark:bg-gray-700 dark:border-gray-600 rounded cursor-pointer accent-teal-600 focus:ring-2 focus:ring-teal-500"
              />
              {/* UPDATED: Added theme classes */}
              <label htmlFor="symbols" className="font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none">Include Symbols</label>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-4 border-t border-slate-200 dark:border-slate-700">
             <motion.button
                onClick={handleReset}
                // UPDATED: Replaced inline style hover with Tailwind classes
                whileTap={{ scale: 0.98 }}
                className='w-full bg-red-700 hover:bg-red-800 transition-colors text-white p-3 rounded-lg font-bold'
              >
                Reset
              </motion.button>
        </motion.div>
      </motion.div>

      <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 text-center text-slate-500 dark:text-slate-500">
        <p>© {new Date().getFullYear()} Password Generator App. All Rights Reserved.</p>
      </motion.footer>
    </div>
  );
}

export default App;