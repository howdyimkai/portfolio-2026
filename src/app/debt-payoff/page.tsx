'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minPayment: number;
}

interface PayoffResult {
  strategy: string;
  totalInterest: number;
  monthsToPayoff: number;
  totalPaid: number;
  schedule: MonthlyPayment[];
}

interface MonthlyPayment {
  month: number;
  debtName: string;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export default function DebtPayoffPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [results, setResults] = useState<{avalanche: PayoffResult | null, snowball: PayoffResult | null}>({
    avalanche: null,
    snowball: null
  });

  // Form state for adding new debt
  const [newDebt, setNewDebt] = useState({
    name: '',
    balance: '',
    interestRate: '',
    minPayment: ''
  });

  const addDebt = () => {
    if (newDebt.name && newDebt.balance && newDebt.interestRate && newDebt.minPayment) {
      const debt: Debt = {
        id: Date.now().toString(),
        name: newDebt.name,
        balance: parseFloat(newDebt.balance),
        interestRate: parseFloat(newDebt.interestRate),
        minPayment: parseFloat(newDebt.minPayment)
      };
      setDebts([...debts, debt]);
      setNewDebt({ name: '', balance: '', interestRate: '', minPayment: '' });
    }
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const calculatePayoff = (strategy: 'avalanche' | 'snowball'): PayoffResult => {
    // Deep copy debts to avoid mutation
    let remainingDebts = debts.map(d => ({ ...d }));
    const schedule: MonthlyPayment[] = [];
    let month = 0;
    let totalInterest = 0;
    let totalPaid = 0;

    const totalMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0);
    const totalMonthlyPayment = totalMinPayments + extraPayment;

    while (remainingDebts.length > 0 && month < 600) { // 50 year max
      month++;

      // Sort debts based on strategy
      if (strategy === 'avalanche') {
        remainingDebts.sort((a, b) => b.interestRate - a.interestRate);
      } else {
        remainingDebts.sort((a, b) => a.balance - b.balance);
      }

      let remainingPayment = totalMonthlyPayment;

      for (let i = 0; i < remainingDebts.length; i++) {
        const debt = remainingDebts[i];
        const monthlyRate = debt.interestRate / 100 / 12;
        const interestCharge = debt.balance * monthlyRate;

        let payment: number;
        if (i === 0) {
          // Target debt gets extra payment
          payment = Math.min(remainingPayment, debt.balance + interestCharge);
        } else {
          // Other debts get minimum payment
          payment = Math.min(debt.minPayment, debt.balance + interestCharge);
        }

        const principal = payment - interestCharge;
        debt.balance -= principal;

        totalInterest += interestCharge;
        totalPaid += payment;
        remainingPayment -= payment;

        schedule.push({
          month,
          debtName: debt.name,
          payment,
          principal,
          interest: interestCharge,
          remainingBalance: Math.max(0, debt.balance)
        });

        if (debt.balance <= 0) {
          debt.balance = 0;
        }
      }

      // Remove paid off debts
      remainingDebts = remainingDebts.filter(d => d.balance > 0);
    }

    return {
      strategy,
      totalInterest,
      monthsToPayoff: month,
      totalPaid,
      schedule
    };
  };

  const calculate = () => {
    if (debts.length === 0) {
      alert('Please add at least one debt');
      return;
    }

    const avalancheResult = calculatePayoff('avalanche');
    const snowballResult = calculatePayoff('snowball');

    setResults({
      avalanche: avalancheResult,
      snowball: snowballResult
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatMonths = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0) {
      return `${years}y ${remainingMonths}m`;
    }
    return `${remainingMonths}m`;
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Portfolio
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-2">Debt Payoff Calculator</h1>
        <p className="text-gray-400 mb-8">
          Compare Avalanche vs Snowball strategies to find the best way to pay off your debt
        </p>

        {/* Add Debt Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Add Your Debts</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="Debt Name"
              value={newDebt.name}
              onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
              className="bg-gray-700 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Balance ($)"
              value={newDebt.balance}
              onChange={(e) => setNewDebt({ ...newDebt, balance: e.target.value })}
              className="bg-gray-700 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Interest Rate (%)"
              value={newDebt.interestRate}
              onChange={(e) => setNewDebt({ ...newDebt, interestRate: e.target.value })}
              className="bg-gray-700 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
            />
            <input
              type="number"
              placeholder="Min Payment ($)"
              value={newDebt.minPayment}
              onChange={(e) => setNewDebt({ ...newDebt, minPayment: e.target.value })}
              className="bg-gray-700 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addDebt}
              className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 font-semibold transition"
            >
              Add Debt
            </button>
          </div>

          {/* Debts List */}
          {debts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Your Debts:</h3>
              <div className="space-y-2">
                {debts.map((debt) => (
                  <div key={debt.id} className="bg-gray-700 rounded p-4 flex justify-between items-center">
                    <div className="flex-grow grid grid-cols-4 gap-4">
                      <div>
                        <span className="font-semibold">{debt.name}</span>
                      </div>
                      <div>Balance: {formatCurrency(debt.balance)}</div>
                      <div>Rate: {debt.interestRate}%</div>
                      <div>Min: {formatCurrency(debt.minPayment)}</div>
                    </div>
                    <button
                      onClick={() => removeDebt(debt.id)}
                      className="ml-4 text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Extra Payment */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Extra Monthly Payment</h2>
          <div className="flex items-center gap-4">
            <input
              type="number"
              placeholder="Extra amount per month"
              value={extraPayment}
              onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
              className="bg-gray-700 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
            />
            <button
              onClick={calculate}
              className="bg-green-600 hover:bg-green-700 rounded px-8 py-2 font-semibold text-lg transition"
            >
              Calculate Strategies
            </button>
          </div>
        </div>

        {/* Results */}
        {results.avalanche && results.snowball && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avalanche Results */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">🏔️ Avalanche Method</h2>
              <p className="text-gray-300 mb-4 text-sm">
                Pays highest interest rate first (saves the most money)
              </p>
              <div className="space-y-3">
                <div className="bg-purple-950 bg-opacity-50 rounded p-3">
                  <div className="text-sm text-gray-400">Time to Payoff</div>
                  <div className="text-2xl font-bold">{formatMonths(results.avalanche.monthsToPayoff)}</div>
                </div>
                <div className="bg-purple-950 bg-opacity-50 rounded p-3">
                  <div className="text-sm text-gray-400">Total Interest Paid</div>
                  <div className="text-2xl font-bold text-red-400">{formatCurrency(results.avalanche.totalInterest)}</div>
                </div>
                <div className="bg-purple-950 bg-opacity-50 rounded p-3">
                  <div className="text-sm text-gray-400">Total Amount Paid</div>
                  <div className="text-xl font-semibold">{formatCurrency(results.avalanche.totalPaid)}</div>
                </div>
              </div>
            </div>

            {/* Snowball Results */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">⛄ Snowball Method</h2>
              <p className="text-gray-300 mb-4 text-sm">
                Pays smallest balance first (quick wins for motivation)
              </p>
              <div className="space-y-3">
                <div className="bg-blue-950 bg-opacity-50 rounded p-3">
                  <div className="text-sm text-gray-400">Time to Payoff</div>
                  <div className="text-2xl font-bold">{formatMonths(results.snowball.monthsToPayoff)}</div>
                </div>
                <div className="bg-blue-950 bg-opacity-50 rounded p-3">
                  <div className="text-sm text-gray-400">Total Interest Paid</div>
                  <div className="text-2xl font-bold text-red-400">{formatCurrency(results.snowball.totalInterest)}</div>
                </div>
                <div className="bg-blue-950 bg-opacity-50 rounded p-3">
                  <div className="text-sm text-gray-400">Total Amount Paid</div>
                  <div className="text-xl font-semibold">{formatCurrency(results.snowball.totalPaid)}</div>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="md:col-span-2 bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">📊 Comparison</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded p-4">
                  <div className="text-sm text-gray-400 mb-1">Interest Savings (Avalanche)</div>
                  <div className="text-2xl font-bold text-green-400">
                    {formatCurrency(results.snowball.totalInterest - results.avalanche.totalInterest)}
                  </div>
                </div>
                <div className="bg-gray-700 rounded p-4">
                  <div className="text-sm text-gray-400 mb-1">Time Difference</div>
                  <div className="text-2xl font-bold">
                    {Math.abs(results.snowball.monthsToPayoff - results.avalanche.monthsToPayoff)} months
                  </div>
                </div>
                <div className="bg-gray-700 rounded p-4">
                  <div className="text-sm text-gray-400 mb-1">Recommended Strategy</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {results.avalanche.totalInterest < results.snowball.totalInterest ? '🏔️ Avalanche' : '⛄ Snowball'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        {debts.length === 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">🏔️ Avalanche Method</h3>
                <p>Focus extra payments on the debt with the highest interest rate. This saves you the most money over time.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">⛄ Snowball Method</h3>
                <p>Focus extra payments on the smallest debt first. This gives you quick wins and psychological motivation.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Getting Started</h3>
                <p>Add all your debts above with their balance, interest rate, and minimum payment. Then set how much extra you can pay each month.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
