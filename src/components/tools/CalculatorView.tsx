import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Percent,
  Calendar,
  DollarSign,
  Heart,
  Scale,
  RotateCcw,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { Tool } from '../../types';
import {
  evaluateMath,
  calculatePercentage,
  calculateDiscount,
  calculateTax,
  calculateGst,
  calculateTip,
  calculateAge,
  calculateSimpleInterest,
  calculateCompoundInterest,
  calculateBmi,
  numberToWords,
} from '../../utils/calculators';

interface CalculatorViewProps {
  tool: Tool;
  onToast: (msg: string) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({ tool, onToast }) => {
  // Scientific / Basic Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcEquation, setCalcEquation] = useState('');

  // Percentage tool states
  const [pctVal1, setPctVal1] = useState(15);
  const [pctVal2, setPctVal2] = useState(200);

  // Discount states
  const [discOriginal, setDiscOriginal] = useState(120);
  const [discPercent, setDiscPercent] = useState(25);

  // Tax & GST states
  const [taxAmount, setTaxAmount] = useState(500);
  const [taxRate, setTaxRate] = useState(18);
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  // Tip & Split states
  const [tipBill, setTipBill] = useState(85);
  const [tipPct, setTipPct] = useState(15);
  const [tipPeople, setTipPeople] = useState(3);

  // Age states
  const [birthDate, setBirthDate] = useState('2000-01-01');

  // Simple & Compound Interest
  const [principal, setPrincipal] = useState(10000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [timeYears, setTimeYears] = useState(3);

  // BMI states
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);

  // Number to words
  const [numToWordInput, setNumToWordInput] = useState(1234567);

  // Unit Converter States
  const [unitCategory, setUnitCategory] = useState<'length' | 'weight' | 'temp' | 'storage'>('length');
  const [unitInputVal, setUnitInputVal] = useState(1);
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');

  // Random Number
  const [randMin, setRandMin] = useState(1);
  const [randMax, setRandMax] = useState(100);
  const [randResult, setRandResult] = useState<number | null>(null);

  const [copied, setCopied] = useState(false);

  // Calculator button click
  const handleCalcButton = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
      setCalcEquation('');
    } else if (val === '=') {
      try {
        const res = evaluateMath(calcEquation + calcDisplay);
        setCalcDisplay(String(res));
        setCalcEquation('');
      } catch {
        setCalcDisplay('Error');
      }
    } else if (['+', '-', '×', '÷'].includes(val)) {
      setCalcEquation((prev) => prev + calcDisplay + ' ' + val + ' ');
      setCalcDisplay('0');
    } else if (val === 'π') {
      setCalcDisplay(String(Math.PI));
    } else if (val === 'e') {
      setCalcDisplay(String(Math.E));
    } else if (val === 'sqrt') {
      try {
        const res = Math.sqrt(parseFloat(calcDisplay));
        setCalcDisplay(String(res));
      } catch {
        setCalcDisplay('Error');
      }
    } else if (val === 'sin') {
      setCalcDisplay(String(Math.sin((parseFloat(calcDisplay) * Math.PI) / 180)));
    } else if (val === 'cos') {
      setCalcDisplay(String(Math.cos((parseFloat(calcDisplay) * Math.PI) / 180)));
    } else if (val === 'tan') {
      setCalcDisplay(String(Math.tan((parseFloat(calcDisplay) * Math.PI) / 180)));
    } else if (val === '.') {
      setCalcDisplay((prev) => {
        if (!prev || prev === '0' || prev === 'Error') return '0.';
        if (prev.includes('.')) return prev;
        return prev + '.';
      });
    } else if (val === '⌫') {
      setCalcDisplay((prev) => (prev.length > 1 && prev !== 'Error' ? prev.slice(0, -1) : '0'));
    } else {
      setCalcDisplay((prev) => (prev === '0' || prev === 'Error' ? val : prev + val));
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert Units
  const convertedUnitValue = useMemo(() => {
    const val = unitInputVal;
    if (unitCategory === 'length') {
      // Base: meters
      let meters = val;
      if (fromUnit === 'kilometers') meters = val * 1000;
      if (fromUnit === 'centimeters') meters = val / 100;
      if (fromUnit === 'millimeters') meters = val / 1000;
      if (fromUnit === 'miles') meters = val * 1609.34;
      if (fromUnit === 'feet') meters = val * 0.3048;
      if (fromUnit === 'inches') meters = val * 0.0254;

      if (toUnit === 'meters') return meters;
      if (toUnit === 'kilometers') return meters / 1000;
      if (toUnit === 'centimeters') return meters * 100;
      if (toUnit === 'millimeters') return meters * 1000;
      if (toUnit === 'miles') return meters / 1609.34;
      if (toUnit === 'feet') return meters / 0.3048;
      if (toUnit === 'inches') return meters / 0.0254;
    } else if (unitCategory === 'weight') {
      // Base: kg
      let kg = val;
      if (fromUnit === 'grams') kg = val / 1000;
      if (fromUnit === 'pounds') kg = val * 0.453592;
      if (fromUnit === 'ounces') kg = val * 0.0283495;

      if (toUnit === 'kg') return kg;
      if (toUnit === 'grams') return kg * 100;
      if (toUnit === 'pounds') return kg / 0.453592;
      if (toUnit === 'ounces') return kg / 0.0283495;
    } else if (unitCategory === 'temp') {
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') return (val * 9) / 5 + 32;
      if (fromUnit === 'fahrenheit' && toUnit === 'celsius') return ((val - 32) * 5) / 9;
      if (fromUnit === 'celsius' && toUnit === 'kelvin') return val + 273.15;
      if (fromUnit === 'kelvin' && toUnit === 'celsius') return val - 273.15;
      return val;
    } else if (unitCategory === 'storage') {
      // Base: Megabytes (MB)
      let mb = val;
      if (fromUnit === 'KB') mb = val / 1024;
      if (fromUnit === 'GB') mb = val * 1024;
      if (fromUnit === 'TB') mb = val * 1024 * 1024;

      if (toUnit === 'KB') return mb * 1024;
      if (toUnit === 'MB') return mb;
      if (toUnit === 'GB') return mb / 1024;
      if (toUnit === 'TB') return mb / (1024 * 1024);
    }
    return val;
  }, [unitCategory, unitInputVal, fromUnit, toUnit]);

  // Basic / Scientific Calculator view
  if (tool.id.includes('scientific') || tool.id === 'basic-calculator' || tool.id.includes('calculator-app')) {
    const isSci = tool.id.includes('scientific');
    const buttons = isSci
      ? [
          ['C', '(', ')', '÷'],
          ['sin', 'cos', 'tan', '×'],
          ['sqrt', 'π', 'e', '-'],
          ['7', '8', '9', '+'],
          ['4', '5', '6', '='],
          ['1', '2', '3', '⌫'],
          ['0', '.', '%', '00'],
        ]
      : [
          ['C', '(', ')', '÷'],
          ['7', '8', '9', '×'],
          ['4', '5', '6', '-'],
          ['1', '2', '3', '+'],
          ['0', '.', '=', '%'],
        ];

    return (
      <div className="max-w-sm mx-auto rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-lg">
        {/* Screen Display */}
        <div className="mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-950 p-4 text-right">
          <div className="h-5 text-xs font-mono text-neutral-400 truncate">{calcEquation}</div>
          <div className="text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white truncate">
            {calcDisplay}
          </div>
        </div>

        {/* Buttons Pad */}
        <div className="space-y-2">
          {buttons.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-4 gap-2">
              {row.map((btn) => {
                const isOp = ['+', '-', '×', '÷'].includes(btn);
                const isEq = btn === '=';
                const isClear = btn === 'C';
                return (
                  <button
                    key={btn}
                    onClick={() => handleCalcButton(btn)}
                    className={`h-12 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center ${
                      isEq
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-700'
                        : isOp
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
                        : isClear
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Percentage Calculator
  if (tool.id.includes('percentage')) {
    const pct = calculatePercentage(pctVal1, pctVal2);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Value A:</label>
            <input
              type="number"
              value={pctVal1}
              onChange={(e) => setPctVal1(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-base font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Value B:</label>
            <input
              type="number"
              value={pctVal2}
              onChange={(e) => setPctVal2(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-base font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-center">
            <span className="text-xs text-neutral-500 font-medium">{pctVal1}% of {pctVal2} is</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{pct.partOfTotal}</div>
          </div>
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-center">
            <span className="text-xs text-neutral-500 font-medium">{pctVal1} is what % of {pctVal2}?</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{pct.percentage}%</div>
          </div>
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-center">
            <span className="text-xs text-neutral-500 font-medium">% Change from {pctVal1} to {pctVal2}</span>
            <div className={`text-2xl font-black mt-1 ${pct.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {pct.change >= 0 ? `+${pct.change}%` : `${pct.change}%`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Discount & Sale Calculator
  if (tool.id.includes('discount')) {
    const disc = calculateDiscount(discOriginal, discPercent);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Original Price ($):</label>
            <input
              type="number"
              min="0"
              value={discOriginal}
              onChange={(e) => setDiscOriginal(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-base font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Discount (%):</label>
            <input
              type="number"
              min="0"
              max="100"
              value={discPercent}
              onChange={(e) => setDiscPercent(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-base font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30">
          <div>
            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase">You Pay (Sale Price):</span>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">${disc.salePrice}</div>
          </div>
          <div>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase">You Save:</span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">${disc.savings}</div>
          </div>
        </div>
      </div>
    );
  }

  // GST & Tax Calculator
  if (tool.id.includes('tax') || tool.id.includes('gst')) {
    const gst = calculateGst(taxAmount, taxRate, gstType);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Amount:</label>
            <input
              type="number"
              value={taxAmount}
              onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tax / GST Rate (%):</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Calculation Type:</label>
            <select
              value={gstType}
              onChange={(e) => setGstType(e.target.value as 'exclusive' | 'inclusive')}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-xs"
            >
              <option value="exclusive">GST Exclusive (Add GST)</option>
              <option value="inclusive">GST Inclusive (Extract GST)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-850">
            <span className="text-[11px] text-neutral-500">Net Amount:</span>
            <div className="text-lg font-bold">${gst.netAmount}</div>
          </div>
          <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-850">
            <span className="text-[11px] text-neutral-500">Total GST:</span>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${gst.gstAmount}</div>
          </div>
          <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-850">
            <span className="text-[11px] text-neutral-500">CGST / SGST:</span>
            <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300">CGST: ${gst.cgst} | SGST: ${gst.sgst}</div>
          </div>
          <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-850">
            <span className="text-[11px] text-neutral-500">Gross (Total):</span>
            <div className="text-lg font-bold text-emerald-600">${gst.grossAmount}</div>
          </div>
        </div>
      </div>
    );
  }

  // Tip & Bill Split
  if (tool.id.includes('tip')) {
    const tip = calculateTip(tipBill, tipPct, tipPeople);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Bill Amount ($):</label>
            <input
              type="number"
              value={tipBill}
              onChange={(e) => setTipBill(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tip Percentage (%):</label>
            <input
              type="number"
              value={tipPct}
              onChange={(e) => setTipPct(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Split with (People):</label>
            <input
              type="number"
              min="1"
              value={tipPeople}
              onChange={(e) => setTipPeople(parseInt(e.target.value) || 1)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl border bg-neutral-50 dark:bg-neutral-850">
            <span className="text-[11px] text-neutral-500">Tip Amount</span>
            <div className="text-xl font-black text-indigo-600">${tip.tipAmount}</div>
          </div>
          <div className="p-3.5 rounded-xl border bg-neutral-50 dark:bg-neutral-850">
            <span className="text-[11px] text-neutral-500">Total Bill</span>
            <div className="text-xl font-black">${tip.totalBill}</div>
          </div>
          <div className="p-3.5 rounded-xl border bg-neutral-50 dark:bg-neutral-850">
            <span className="text-[11px] text-neutral-500">Per Person Pay</span>
            <div className="text-xl font-black text-emerald-600">${tip.perPerson}</div>
          </div>
          <div className="p-3.5 rounded-xl border bg-neutral-50 dark:bg-neutral-850">
            <span className="text-[11px] text-neutral-500">Tip Per Person</span>
            <div className="text-xl font-black text-neutral-600 dark:text-neutral-300">${tip.tipPerPerson}</div>
          </div>
        </div>
      </div>
    );
  }

  // Age Calculator
  if (tool.id.includes('age')) {
    let ageInfo = null;
    try {
      ageInfo = calculateAge(birthDate);
    } catch {
      ageInfo = null;
    }

    return (
      <div className="space-y-6">
        <div className="max-w-xs">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Select Date of Birth:
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-sm font-semibold"
          />
        </div>

        {ageInfo && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-center">
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase">Exact Age:</span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-900 dark:text-indigo-200 mt-1">
                {ageInfo.years} Years, {ageInfo.months} Months, {ageInfo.days} Days
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-850">
                <span className="text-[11px] text-neutral-500">Total Days Lived</span>
                <div className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">{ageInfo.totalDays.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-850">
                <span className="text-[11px] text-neutral-500">Total Hours</span>
                <div className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">{ageInfo.totalHours.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-850">
                <span className="text-[11px] text-neutral-500">Total Minutes</span>
                <div className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">{ageInfo.totalMinutes.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-850">
                <span className="text-[11px] text-neutral-500">Next Birthday In</span>
                <div className="text-lg font-bold text-amber-600 mt-0.5">{ageInfo.nextBirthdayDays} Days</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // BMI Calculator
  if (tool.id.includes('bmi')) {
    const bmiResult = calculateBmi(weightKg, heightCm);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Weight (kg):</label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Height (cm):</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm font-bold"
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-center">
          <span className="text-xs text-neutral-500 uppercase font-semibold">Your Body Mass Index (BMI):</span>
          <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{bmiResult.bmi}</div>
          <div className={`text-base font-bold mt-1 ${bmiResult.color}`}>{bmiResult.category}</div>
          <p className="text-xs text-neutral-500 mt-2">WHO Healthy Weight Range for your height: {bmiResult.healthyRange}</p>
        </div>
      </div>
    );
  }

  // Number to Words
  if (tool.id.includes('number-to-words')) {
    const words = numberToWords(numToWordInput);
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Enter Number:
          </label>
          <input
            type="number"
            value={numToWordInput}
            onChange={(e) => setNumToWordInput(parseInt(e.target.value) || 0)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-base font-bold text-neutral-900 dark:text-white"
          />
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Words:</span>
            <button
              onClick={() => handleCopy(words)}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="text-lg font-bold text-neutral-900 dark:text-white capitalize leading-relaxed">
            {words}
          </div>
        </div>
      </div>
    );
  }

  // Unit Converter
  if (tool.id.includes('unit-converter')) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          {(['length', 'weight', 'temp', 'storage'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setUnitCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                unitCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Value:</label>
            <input
              type="number"
              value={unitInputVal}
              onChange={(e) => setUnitInputVal(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">From:</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-xs"
            >
              {unitCategory === 'length' && (
                <>
                  <option value="meters">Meters (m)</option>
                  <option value="kilometers">Kilometers (km)</option>
                  <option value="centimeters">Centimeters (cm)</option>
                  <option value="feet">Feet (ft)</option>
                  <option value="inches">Inches (in)</option>
                  <option value="miles">Miles (mi)</option>
                </>
              )}
              {unitCategory === 'weight' && (
                <>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="grams">Grams (g)</option>
                  <option value="pounds">Pounds (lbs)</option>
                  <option value="ounces">Ounces (oz)</option>
                </>
              )}
              {unitCategory === 'temp' && (
                <>
                  <option value="celsius">Celsius (°C)</option>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                  <option value="kelvin">Kelvin (K)</option>
                </>
              )}
              {unitCategory === 'storage' && (
                <>
                  <option value="KB">Kilobytes (KB)</option>
                  <option value="MB">Megabytes (MB)</option>
                  <option value="GB">Gigabytes (GB)</option>
                  <option value="TB">Terabytes (TB)</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">To:</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-xs"
            >
              {unitCategory === 'length' && (
                <>
                  <option value="feet">Feet (ft)</option>
                  <option value="meters">Meters (m)</option>
                  <option value="kilometers">Kilometers (km)</option>
                  <option value="centimeters">Centimeters (cm)</option>
                  <option value="inches">Inches (in)</option>
                  <option value="miles">Miles (mi)</option>
                </>
              )}
              {unitCategory === 'weight' && (
                <>
                  <option value="pounds">Pounds (lbs)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="grams">Grams (g)</option>
                  <option value="ounces">Ounces (oz)</option>
                </>
              )}
              {unitCategory === 'temp' && (
                <>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                  <option value="celsius">Celsius (°C)</option>
                  <option value="kelvin">Kelvin (K)</option>
                </>
              )}
              {unitCategory === 'storage' && (
                <>
                  <option value="GB">Gigabytes (GB)</option>
                  <option value="KB">Kilobytes (KB)</option>
                  <option value="MB">Megabytes (MB)</option>
                  <option value="TB">Terabytes (TB)</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-center">
          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase">Converted Result:</span>
          <div className="text-3xl font-black text-indigo-900 dark:text-indigo-200 mt-1">
            {typeof convertedUnitValue === 'number' ? convertedUnitValue.toFixed(4).replace(/\.?0+$/, '') : convertedUnitValue} {toUnit}
          </div>
        </div>
      </div>
    );
  }

  // Random Number Generator
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Minimum:</label>
          <input
            type="number"
            value={randMin}
            onChange={(e) => setRandMin(parseInt(e.target.value) || 0)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Maximum:</label>
          <input
            type="number"
            value={randMax}
            onChange={(e) => setRandMax(parseInt(e.target.value) || 0)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm font-bold"
          />
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            const min = Math.min(randMin, randMax);
            const max = Math.max(randMin, randMax);
            const r = Math.floor(Math.random() * (max - min + 1)) + min;
            setRandResult(r);
          }}
          className="rounded-xl bg-indigo-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-indigo-700 shadow-xs"
        >
          Roll Random Number
        </button>
      </div>

      {randResult !== null && (
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-center">
          <span className="text-xs text-neutral-500 uppercase font-bold">Random Pick:</span>
          <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mt-2">{randResult}</div>
        </div>
      )}
    </div>
  );
};
