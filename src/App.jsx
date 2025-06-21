import { useState, useEffect, useCallback, useRef } from 'react';

// A pure function, so it can live outside the component.
// This prevents it from being redeclared on every render.
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
  // --- State Management ---
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [numbersAllowed, setNumbersAllowed] = useState(true);
  const [symbolsAllowed, setSymbolsAllowed] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  
  // useRef hook to get a reference to the password input element
  const passwordRef = useRef(null);

  // --- Functions ---
  
  // useCallback memoizes this function so it's not recreated on every render
  // unless its dependencies change.
  const passwordGenerator = useCallback(() => {
    const newPassword = generatePassword(length, numbersAllowed, symbolsAllowed);
    setPassword(newPassword);
  }, [length, numbersAllowed, symbolsAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    // Select the text in the input field for user feedback
    passwordRef.current?.select();
    
    // Copy password to clipboard using the modern Clipboard API
    navigator.clipboard.writeText(password).then(() => {
      setCopyButtonText('Copied!');
      // Reset button text after 2 seconds
      setTimeout(() => {
        setCopyButtonText('Copy');
      }, 2000);
    });
  }, [password]);
  
  const handleReset = () => {
    setLength(12);
    setNumbersAllowed(false);
    setSymbolsAllowed(false);
    setCopyButtonText('Copy');
    passwordGenerator(); // Regenerate password with default settings
    // The useEffect below will automatically generate a new password
  };

  // useEffect hook to re-generate the password whenever the criteria change.
  useEffect(() => {
    passwordGenerator();
  }, [length, numbersAllowed, symbolsAllowed, passwordGenerator]);

  return (
    <div className="w-full min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center justify-center p-4 font-mono">
      
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 border border-slate-700">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Password Generator</h1>
            <p className="text-slate-400">Create a strong and secure password.</p>
        </div>

        {/* Password Display and Copy Button */}
        <div className="flex items-center shadow-md rounded-lg overflow-hidden">
          <input
            type="text"
            value={password}
            className="w-full p-3 bg-slate-900 text-teal-400 text-lg font-bold outline-none"
            placeholder="Your password will appear here"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className="px-5 py-3 bg-teal-600 text-white font-semibold hover:bg-teal-700 active:bg-teal-800 transition-colors duration-200"
          >
            {copyButtonText}
          </button>
        </div>

        {/* Controls Section */}
        <div className="space-y-4">
          {/* Length Slider */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label htmlFor="length" className="font-medium text-slate-300">Password Length: <span className="font-bold text-teal-400">{length}</span></label>
            <input
              id="length"
              type="range"
              min={8}
              max={32}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full sm:w-1/2 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>
          
          {/* Checkboxes */}
          <div className="flex items-center gap-x-4">
             <div className="flex items-center gap-x-2">
              <input
                type="checkbox"
                id="numbers"
                checked={numbersAllowed}
                onChange={() => setNumbersAllowed((prev) => !prev)}
                className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-600 rounded focus:ring-teal-500 cursor-pointer accent-teal-600"
              />
              <label htmlFor="numbers" className="font-medium text-slate-300 cursor-pointer">Include Numbers</label>
            </div>
            
            <div className="flex items-center gap-x-2">
              <input
                type="checkbox"
                id="symbols"
                checked={symbolsAllowed}
                onChange={() => setSymbolsAllowed((prev) => !prev)}
                className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-600 rounded focus:ring-teal-500 cursor-pointer accent-teal-600"
              />
              <label htmlFor="symbols" className="font-medium text-slate-300 cursor-pointer">Include Symbols</label>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t border-slate-700">
             <button
                onClick={handleReset}
                className='w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition-colors duration-200'
              >
                Reset
              </button>
        </div>
      </div>

      <footer className="mt-8 text-center text-slate-500">
        <p>© {new Date().getFullYear()} Password Generator App. All Rights Reserved.</p>
      </footer>

    </div>
  );
}

export default App;