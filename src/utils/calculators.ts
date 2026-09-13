// Math, scientific, financial, unit, and student calculations

export function evaluateMath(expr: string): number {
  const sanitized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\^/g, '**')
    .replace(/π/g, `${Math.PI}`)
    .replace(/e(?![a-z])/gi, `${Math.E}`)
    .replace(/[^0-9+\-*/().%*\s]/g, '');

  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`return (${sanitized});`)();
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid calculation');
    }
    return result;
  } catch {
    throw new Error('Invalid expression');
  }
}

export function calculatePercentage(part: number, total: number): { percentage: number; partOfTotal: number; change: number } {
  const percentage = total !== 0 ? (part / total) * 100 : 0;
  const partOfTotal = (part * total) / 100;
  const change = part !== 0 ? ((total - part) / part) * 100 : 0;
  return {
    percentage: +percentage.toFixed(2),
    partOfTotal: +partOfTotal.toFixed(2),
    change: +change.toFixed(2),
  };
}

export function calculateDiscount(originalPrice: number, discountPercent: number): { salePrice: number; savings: number } {
  const savings = (originalPrice * discountPercent) / 100;
  const salePrice = Math.max(0, originalPrice - savings);
  return {
    salePrice: +salePrice.toFixed(2),
    savings: +savings.toFixed(2),
  };
}

export function calculateTax(amount: number, taxRate: number): { taxAmount: number; totalAmount: number } {
  const taxAmount = (amount * taxRate) / 100;
  const totalAmount = amount + taxAmount;
  return {
    taxAmount: +taxAmount.toFixed(2),
    totalAmount: +totalAmount.toFixed(2),
  };
}

export function calculateGst(amount: number, rate: number, type: 'exclusive' | 'inclusive'): { netAmount: number; gstAmount: number; grossAmount: number; cgst: number; sgst: number } {
  if (type === 'exclusive') {
    const gstAmount = (amount * rate) / 100;
    const grossAmount = amount + gstAmount;
    return {
      netAmount: +amount.toFixed(2),
      gstAmount: +gstAmount.toFixed(2),
      grossAmount: +grossAmount.toFixed(2),
      cgst: +(gstAmount / 2).toFixed(2),
      sgst: +(gstAmount / 2).toFixed(2),
    };
  } else {
    // Inclusive: Amount includes GST
    const netAmount = amount / (1 + rate / 100);
    const gstAmount = amount - netAmount;
    return {
      netAmount: +netAmount.toFixed(2),
      gstAmount: +gstAmount.toFixed(2),
      grossAmount: +amount.toFixed(2),
      cgst: +(gstAmount / 2).toFixed(2),
      sgst: +(gstAmount / 2).toFixed(2),
    };
  }
}

export function calculateTip(billAmount: number, tipPercent: number, people: number = 1): { tipAmount: number; totalBill: number; perPerson: number; tipPerPerson: number } {
  const safePeople = Math.max(1, people);
  const tipAmount = (billAmount * tipPercent) / 100;
  const totalBill = billAmount + tipAmount;
  return {
    tipAmount: +tipAmount.toFixed(2),
    totalBill: +totalBill.toFixed(2),
    perPerson: +(totalBill / safePeople).toFixed(2),
    tipPerPerson: +(tipAmount / safePeople).toFixed(2),
  };
}

export interface AgeDetails {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthdayDays: number;
}

export function calculateAge(birthDateStr: string): AgeDetails {
  const birth = new Date(birthDateStr);
  const now = new Date();
  if (isNaN(birth.getTime()) || birth > now) {
    throw new Error('Please select a valid past date');
  }

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = now.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  // Next birthday
  const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < now) {
    nextBday.setFullYear(now.getFullYear() + 1);
  }
  const nextBirthdayDays = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    totalMinutes,
    nextBirthdayDays,
  };
}

export function calculateSimpleInterest(principal: number, ratePercent: number, timeYears: number): { interest: number; total: number } {
  const interest = (principal * ratePercent * timeYears) / 100;
  return {
    interest: +interest.toFixed(2),
    total: +(principal + interest).toFixed(2),
  };
}

export function calculateCompoundInterest(
  principal: number,
  ratePercent: number,
  timeYears: number,
  compoundsPerYear: number = 1
): { totalAmount: number; interestEarned: number } {
  const r = ratePercent / 100;
  const n = Math.max(1, compoundsPerYear);
  const t = timeYears;
  const totalAmount = principal * Math.pow(1 + r / n, n * t);
  const interestEarned = totalAmount - principal;
  return {
    totalAmount: +totalAmount.toFixed(2),
    interestEarned: +interestEarned.toFixed(2),
  };
}

export function calculateBmi(weightKg: number, heightCm: number): { bmi: number; category: string; healthyRange: string; color: string } {
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Weight and height must be greater than zero');
  }
  const heightM = heightCm / 100;
  const bmi = +(weightKg / (heightM * heightM)).toFixed(1);

  let category = 'Normal Weight';
  let color = 'text-emerald-500';
  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-amber-500';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    color = 'text-amber-500';
  } else if (bmi >= 30) {
    category = 'Obese';
    color = 'text-rose-500';
  }

  const minHealthyWeight = +(18.5 * heightM * heightM).toFixed(1);
  const maxHealthyWeight = +(24.9 * heightM * heightM).toFixed(1);

  return {
    bmi,
    category,
    healthyRange: `${minHealthyWeight} kg – ${maxHealthyWeight} kg`,
    color,
  };
}

export function numberToWords(num: number): string {
  if (isNaN(num)) return '';
  if (num === 0) return 'Zero';

  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 1000000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 1000000000) return inWords(Math.floor(n / 1000000)) + ' Million' + (n % 1000000 !== 0 ? ' ' + inWords(n % 1000000) : '');
    return inWords(Math.floor(n / 1000000000)) + ' Billion' + (n % 1000000000 !== 0 ? ' ' + inWords(n % 1000000000) : '');
  }

  const integerPart = Math.floor(Math.abs(num));
  const result = inWords(integerPart);
  return (num < 0 ? 'Minus ' : '') + result;
}

// Student Attendance Planner
export function calculateAttendance(attended: number, total: number, targetPercent: number = 75): { currentPercentage: number; classesNeeded: number; canBunk: number; status: string } {
  if (total <= 0) return { currentPercentage: 0, classesNeeded: 0, canBunk: 0, status: 'No classes yet' };
  const currentPercentage = +((attended / total) * 100).toFixed(1);
  const targetFraction = targetPercent / 100;

  if (currentPercentage >= targetPercent) {
    // How many can be safely missed: attended / (total + x) >= targetFraction => x <= (attended / targetFraction) - total
    const canBunk = Math.floor(attended / targetFraction - total);
    return {
      currentPercentage,
      classesNeeded: 0,
      canBunk: Math.max(0, canBunk),
      status: `You are above your ${targetPercent}% target! You can safely miss up to ${canBunk} classes.`,
    };
  } else {
    // How many more needed: (attended + x) / (total + x) >= targetFraction => x >= (targetFraction * total - attended) / (1 - targetFraction)
    const classesNeeded = Math.ceil((targetFraction * total - attended) / (1 - targetFraction));
    return {
      currentPercentage,
      classesNeeded: Math.max(0, classesNeeded),
      canBunk: 0,
      status: `You are below ${targetPercent}%. You need to attend the next ${classesNeeded} classes consecutively.`,
    };
  }
}
