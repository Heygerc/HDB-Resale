import React, { useState, useMemo } from 'react';
import { ApplicantProfile, TabType } from '../types';
import { calculateAffordability, calculateGrants } from '../utils/financialCalculations';

interface FinancialToolsViewProps {
  onNavigateToSearch?: (filters?: { minBudget?: number; maxBudget?: number }) => void;
  onTabChange?: (tab: TabType) => void;
}

export const FinancialToolsView: React.FC<FinancialToolsViewProps> = ({
  onNavigateToSearch,
  onTabChange,
}) => {
  // Calculator inputs
  const [income, setIncome] = useState<number>(8500);
  const [cpfOA, setCpfOA] = useState<number>(120000);
  const [profile, setProfile] = useState<ApplicantProfile>('first-timer-family');
  const [proximityOption, setProximityOption] = useState<'none' | 'near-4km' | 'with-parents'>('none');
  const [interestRate, setInterestRate] = useState<number>(2.6); // 2.6% HDB Concessionary
  const [tenureYears, setTenureYears] = useState<number>(25);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [showAmortizationModal, setShowAmortizationModal] = useState<boolean>(false);
  const [isCalculatedAnim, setIsCalculatedAnim] = useState<boolean>(false);

  // Dynamic calculations
  const affordability = useMemo(() => {
    return calculateAffordability(
      Number(income) || 0,
      Number(cpfOA) || 0,
      profile,
      tenureYears,
      interestRate,
      proximityOption
    );
  }, [income, cpfOA, profile, tenureYears, interestRate, proximityOption]);

  const grantDetails = useMemo(() => {
    return calculateGrants(
      Number(income) || 0,
      profile,
      '4-Room',
      proximityOption
    );
  }, [income, profile, proximityOption]);

  const handleReset = () => {
    setIncome(8500);
    setCpfOA(120000);
    setProfile('first-timer-family');
    setProximityOption('none');
    setInterestRate(2.6);
    setTenureYears(25);
  };

  const handleCalculateClick = () => {
    setIsCalculatedAnim(true);
    setTimeout(() => setIsCalculatedAnim(false), 800);
  };

  // Format currency helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(val).replace('SGD', '$').trim();
  };

  // Traditional agency fee calculation based on buying power
  const traditionalFee = affordability.agencyFeeTraditional;
  const propTrustFee = affordability.propTrustConsultantFee;
  const savings = affordability.transactionSavings;
  const propTrustPercentWidth = Math.max(8, Math.min(100, Math.round((propTrustFee / (traditionalFee || 1)) * 100)));

  return (
    <div className="flex flex-col w-full max-w-[1280px] mx-auto gap-8 pb-16">
      {/* Header Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between pt-4">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2 tracking-tight">
            Financial Tools
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Calculate your buying power, estimate HDB grants, and compare transaction costs with official data sources.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-primary-container/10 border border-primary-container/20 px-3.5 py-1.5 rounded-full shadow-xs">
            <span
              className="material-symbols-outlined text-primary text-sm mr-2"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
              Bank-grade Security
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calculators */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Affordability Calculator Card */}
          <section
            id="personalised-affordability-card"
            className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-variant p-8 transition-transform hover:-translate-y-0.5 hover:shadow-md duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                </div>
                <h2 className="font-headline-lg text-title-md text-on-surface font-semibold">
                  Personalised Affordability
                </h2>
              </div>
              <button
                id="reset-affordability-btn"
                onClick={handleReset}
                className="text-primary hover:bg-surface-container-low px-4 py-2 rounded-lg font-label-sm text-label-sm transition-colors"
              >
                Reset Form
              </button>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Input your household income and CPF details to determine your maximum eligible HDB loan and estimated property budget.
            </p>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); handleCalculateClick(); }}>
              {/* Combined Monthly Income */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Combined Monthly Income
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md">
                    $
                  </span>
                  <input
                    id="input-combined-income"
                    type="number"
                    value={income || ''}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant rounded-t-md px-4 py-3 pl-8 font-body-md text-on-surface focus:outline-none focus:border-primary focus:bg-surface-container transition-colors"
                    placeholder="0"
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              {/* Available CPF OA */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Available CPF OA
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md">
                    $
                  </span>
                  <input
                    id="input-cpf-oa"
                    type="number"
                    value={cpfOA || ''}
                    onChange={(e) => setCpfOA(Number(e.target.value))}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant rounded-t-md px-4 py-3 pl-8 font-body-md text-on-surface focus:outline-none focus:border-primary focus:bg-surface-container transition-colors"
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              {/* Applicant Profile */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Applicant Profile
                </label>
                <select
                  id="select-applicant-profile"
                  value={profile}
                  onChange={(e) => setProfile(e.target.value as ApplicantProfile)}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant rounded-t-md px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:bg-surface-container transition-colors cursor-pointer"
                >
                  <option value="first-timer-family">First-Timer Family (SC/SC)</option>
                  <option value="first-timer-singles">First-Timer Singles</option>
                  <option value="second-timer-family">Second-Timer Family</option>
                </select>
              </div>

              {/* Proximity Option Selector for Live Grants Adjustments */}
              <div className="md:col-span-2 pt-2">
                <div className="flex flex-wrap items-center justify-between text-xs text-on-surface-variant mb-2">
                  <span className="font-label-sm text-label-sm uppercase">Proximity Grant Preference</span>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="text-primary hover:underline font-label-sm text-xs"
                  >
                    {showAdvancedOptions ? 'Hide Loan Parameters' : 'Adjust Interest & Tenure'}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProximityOption('none')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left flex items-center justify-between ${
                      proximityOption === 'none'
                        ? 'bg-primary/10 border-primary text-primary font-semibold'
                        : 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span>General Location</span>
                    {proximityOption === 'none' && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProximityOption('near-4km')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left flex items-center justify-between ${
                      proximityOption === 'near-4km'
                        ? 'bg-primary/10 border-primary text-primary font-semibold'
                        : 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span>Within 4km of Parents (+$20k)</span>
                    {proximityOption === 'near-4km' && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProximityOption('with-parents')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left flex items-center justify-between ${
                      proximityOption === 'with-parents'
                        ? 'bg-primary/10 border-primary text-primary font-semibold'
                        : 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span>Living With Parents (+$30k)</span>
                    {proximityOption === 'with-parents' && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                </div>
              </div>

              {/* Optional Advanced Loan parameters */}
              {showAdvancedOptions && (
                <div className="md:col-span-2 p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="font-label-sm text-xs text-on-surface-variant uppercase mb-1 block">
                      Loan Interest Rate (% p.a.)
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setInterestRate(2.6)}
                        className={`flex-1 py-1.5 px-3 rounded text-xs font-medium border ${
                          interestRate === 2.6
                            ? 'bg-primary text-white border-primary'
                            : 'bg-surface border-outline-variant/40 text-on-surface'
                        }`}
                      >
                        HDB 2.6%
                      </button>
                      <button
                        type="button"
                        onClick={() => setInterestRate(3.1)}
                        className={`flex-1 py-1.5 px-3 rounded text-xs font-medium border ${
                          interestRate === 3.1
                            ? 'bg-primary text-white border-primary'
                            : 'bg-surface border-outline-variant/40 text-on-surface'
                        }`}
                      >
                        Bank 3.1%
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-label-sm text-xs text-on-surface-variant uppercase mb-1 block">
                      Loan Tenure: {tenureYears} Years
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="30"
                      step="1"
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="md:col-span-2 pt-2 flex justify-end">
                <button
                  id="calculate-budget-btn"
                  type="button"
                  onClick={handleCalculateClick}
                  className={`bg-primary text-on-primary font-title-md text-body-md px-8 py-3 rounded-lg shadow-sm hover:bg-primary/90 transition-all duration-200 cursor-pointer ${
                    isCalculatedAnim ? 'scale-95 ring-2 ring-primary/50' : ''
                  }`}
                >
                  Calculate Budget
                </button>
              </div>
            </form>
          </section>

          {/* HDB Grants Estimator Card */}
          <section
            id="cpf-housing-grants-card"
            className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-variant p-8 relative overflow-hidden"
          >
            {/* Decorative ambient blur background */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[22px]">payments</span>
                </div>
                <h2 className="font-headline-lg text-title-md text-on-surface font-semibold">
                  CPF Housing Grants Estimator
                </h2>
              </div>
              <span className="text-label-sm font-label-sm text-secondary font-medium">
                Official Tier Scheme 2026
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {/* Family Grant */}
              <div className="p-4 bg-surface-container-low rounded-lg border border-surface-variant">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">
                  Family Grant
                </p>
                <p className="font-headline-lg text-headline-lg text-primary font-bold">
                  {grantDetails.familyGrantEligible ? formatCurrency(grantDetails.familyGrant) : '$0'}
                </p>
                <p className="font-body-md text-label-sm text-on-surface-variant mt-2 flex items-center gap-1">
                  {grantDetails.familyGrantEligible ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] text-green-600">
                        check_circle
                      </span>
                      <span>Eligible</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px] text-outline">
                        cancel
                      </span>
                      <span>Not applicable</span>
                    </>
                  )}
                </p>
              </div>

              {/* EHG Grant */}
              <div className="p-4 bg-surface-container-low rounded-lg border border-surface-variant">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">
                  EHG
                </p>
                <p className="font-headline-lg text-headline-lg text-primary font-bold">
                  {formatCurrency(grantDetails.ehg)}
                </p>
                <p className="font-body-md text-label-sm text-on-surface-variant mt-2 flex items-center gap-1">
                  {grantDetails.ehg > 0 ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] text-green-600">
                        check_circle
                      </span>
                      <span>Based on Income</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px] text-outline">
                        info
                      </span>
                      <span>Exceeds $9k Income Cap</span>
                    </>
                  )}
                </p>
              </div>

              {/* Proximity Grant */}
              <div
                className={`p-4 bg-surface-container-low rounded-lg border border-surface-variant transition-opacity ${
                  grantDetails.phgEligible ? 'opacity-100 border-primary/40' : 'opacity-80'
                }`}
              >
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">
                  Proximity Grant
                </p>
                <p
                  className={`font-headline-lg ${
                    grantDetails.phgEligible
                      ? 'text-headline-lg text-primary font-bold'
                      : 'text-title-md text-on-surface-variant mt-1 font-semibold'
                  }`}
                >
                  {grantDetails.phgEligible ? formatCurrency(grantDetails.phg) : 'Pending Location'}
                </p>
                <p className="font-body-md text-label-sm text-on-surface-variant mt-2 flex items-center gap-1">
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      grantDetails.phgEligible ? 'text-green-600' : 'text-on-surface-variant'
                    }`}
                  >
                    {grantDetails.phgEligible ? 'check_circle' : 'info'}
                  </span>
                  <span>{grantDetails.phgEligible ? 'Applied to Budget' : 'Up to $30k'}</span>
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Results & Visualization */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Results Summary Card */}
          <div
            id="estimated-buying-power-card"
            className="bg-primary-container text-on-primary-container rounded-xl shadow-lg p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <p className="font-label-sm text-label-sm text-on-primary-container/80 uppercase tracking-widest mb-2 relative z-10">
              Estimated Buying Power
            </p>

            <h3 className="font-display-lg text-display-lg font-bold mb-6 relative z-10 tracking-tight text-white">
              {formatCurrency(affordability.estimatedBuyingPower)}
            </h3>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center border-b border-on-primary-container/20 pb-2">
                <span className="font-body-md text-body-md text-white/90">Max Loan Amount</span>
                <span className="font-label-sm text-body-md font-medium text-white">
                  {formatCurrency(affordability.maxLoanAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-on-primary-container/20 pb-2">
                <span className="font-body-md text-body-md text-white/90">CPF Usage</span>
                <span className="font-label-sm text-body-md font-medium text-white">
                  {formatCurrency(affordability.cpfUsage)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2">
                <span className="font-body-md text-body-md text-white/90">Est. Grants</span>
                <span className="font-label-sm text-body-md font-medium text-secondary-container">
                  +{formatCurrency(affordability.grants)}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-on-primary-container/20 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-label-sm mb-2 opacity-80 text-white/80">
                    Monthly Installment (Est.)
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="font-headline-lg text-headline-lg text-white font-bold">
                      {formatCurrency(affordability.monthlyInstallment)}
                    </span>
                    <span className="font-body-md text-sm mb-1 opacity-80 text-white/80">
                      / month
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAmortizationModal(true)}
                  className="bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-1.5 rounded-lg border border-white/20 transition-colors"
                  title="View schedule"
                >
                  Schedule
                </button>
              </div>
            </div>

            {/* Quick search button */}
            <div className="mt-6 pt-2 relative z-10">
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToSearch) {
                    onNavigateToSearch({ maxBudget: affordability.estimatedBuyingPower });
                  } else if (onTabChange) {
                    onTabChange('market-search');
                  }
                }}
                className="w-full bg-secondary text-white font-title-md text-sm py-2.5 px-4 rounded-lg shadow-sm hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
              >
                <span>Find HDB Flats Within Budget</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Transaction Costs Comparison Card */}
          <div
            id="transaction-costs-card"
            className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-variant p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[22px]">trending_down</span>
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                Lower Transaction Costs
              </h3>
            </div>

            <p className="font-body-md text-sm text-on-surface-variant mb-6">
              Comparison of fees using PropTrust vs Traditional Agency for a {formatCurrency(affordability.estimatedBuyingPower)} property.
            </p>

            {/* CSS Bar Chart */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-body-md font-medium text-on-surface">Traditional Agency (2%)</span>
                  <span className="font-label-sm text-on-surface-variant">
                    {formatCurrency(traditionalFee)}
                  </span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-2.5">
                  <div className="bg-outline-variant h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-body-md font-medium text-primary">PropTrust Consultant</span>
                  <span className="font-label-sm text-primary font-bold">
                    {formatCurrency(propTrustFee)}
                  </span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-secondary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${propTrustPercentWidth}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Savings Callout */}
            <div className="mt-6 p-3.5 bg-secondary-container/15 rounded-lg border border-secondary-container/30">
              <p className="font-body-md text-sm text-on-surface flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">
                  lightbulb
                </span>
                <span>
                  You save approximately{' '}
                  <strong className="text-secondary font-bold">
                    {formatCurrency(savings)}
                  </strong>{' '}
                  in transaction fees.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization / Loan Schedule Modal */}
      {showAmortizationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="text-title-md font-title-md text-on-surface font-semibold">
                Estimated Loan Repayment Breakdown
              </h3>
              <button
                onClick={() => setShowAmortizationModal(false)}
                className="p-1 rounded-md text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">Eligible Loan Principal</span>
                <span className="font-semibold">{formatCurrency(affordability.maxLoanAmount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">Loan Tenure</span>
                <span className="font-semibold">{tenureYears} Years ({tenureYears * 12} instalments)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">Interest Rate</span>
                <span className="font-semibold">{interestRate}% p.a. (HDB Concessionary)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">MSR (30% Income Cap)</span>
                <span className="font-semibold">{formatCurrency(affordability.msrCap)} / month</span>
              </div>
              <div className="flex justify-between py-1 bg-surface-container-low p-2 rounded">
                <span className="text-primary font-medium">Monthly Installment</span>
                <span className="text-primary font-bold">{formatCurrency(affordability.monthlyInstallment)} / month</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowAmortizationModal(false)}
                className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
