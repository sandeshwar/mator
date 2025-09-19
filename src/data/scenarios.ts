import { Audience, ScenarioDefinition } from '../types';

export const scenarioLibrary: ScenarioDefinition[] = [
  {
    id: 'probability-forest-risk-sprint',
    title: 'Probability Forest: Risk Sprint',
    icon: '🌲',
    accent: 'from-emerald-400/90 to-aurora/70',
    moduleContext: {
      id: 'probability-forest',
      name: 'Probability Forest',
      insight:
        'Use distribution sense from the Probability Forest trail to keep your decisions balanced under pressure.',
    },
    personas: {
      college: {
        cardDescription: 'Turn exam uncertainty into a confident 48-hour action sprint.',
        narrative:
          'Your Probability Forest drills revealed which lecture branches hide the trickiest questions. You have two nights before the calculus final and need to distribute your energy wisely.',
        objective: 'Dial in a revision rhythm that keeps fatigue low while covering the riskiest units.',
        baseline: [
          { label: 'Exam weight', value: '35% of course grade', helper: 'Probability Forest warns against overcommitting to low-impact chapters.' },
          { label: 'Focus chapters', value: 'Series, Integrals, Random Walks', helper: 'Each carries a 0.3 probability of appearing as a boss-level prompt.' },
        ],
      },
      professional: {
        cardDescription: 'Map uncertainty before presenting your product-readiness score.',
        narrative:
          'The Probability Forest dashboard exposed the launch path nodes that fail most often. Leadership wants a go/no-go report in 48 hours and expects evidence you mitigated the riskiest leaf nodes.',
        objective: 'Balance deep dives with rehearsal time so the launch review feels confident and data-backed.',
        baseline: [
          { label: 'Launch risk budget', value: '25% tolerance', helper: 'Anything above that threshold triggers executive escalations.' },
          { label: 'Critical tracks', value: 'Infra, Adoption, Support', helper: 'Each branch triggered at least two red flags in the forest replay.' },
        ],
      },
    },
    parameters: [
      {
        id: 'focusAllocation',
        label: 'High-risk focus allocation',
        description: 'Percent of time dedicated to the nodes flagged as red in your Probability Forest map.',
        min: 20,
        max: 80,
        step: 1,
        unit: '%',
        defaultValue: 55,
        targetRange: [48, 60],
        insight: 'Nice! That coverage keeps the riskiest paths under control without starving other work.',
        caution: 'If you drift away from ~55% coverage, surprise nodes may slip into the review.',
      },
      {
        id: 'deepWorkHours',
        label: 'Deep work block',
        description: 'Hours reserved for uninterrupted analysis or revision before the decision point.',
        min: 2,
        max: 10,
        step: 0.5,
        unit: 'hrs',
        defaultValue: 5,
        targetRange: [4.5, 6.5],
        insight: 'Great pacing—your Probability Forest simulations show accuracy spikes at this cadence.',
        caution: 'Too little and you miss pattern recognition; too much and fatigue drags performance.',
      },
      {
        id: 'confidencePulse',
        label: 'Confidence pulse check',
        description: 'Self-reported confidence after dry runs. Keep it grounded to avoid blind spots.',
        min: 40,
        max: 100,
        step: 1,
        unit: '%',
        defaultValue: 72,
        targetRange: [68, 80],
        insight: 'Balanced confidence—evidence-led without drifting into overconfidence.',
        caution: 'Confidence outside the sweet spot suggests either anxiety spikes or unchecked optimism.',
      },
    ],
    success: {
      summary: 'Stabilise the hot zones, stay fresh, and walk into the review prepared.',
      checkpoints: [
        'Allocate at least half your sprint to red-flag content.',
        'Stack 5±1 hours of protected focus time.',
        'Keep self-reported confidence between 68% and 80%.',
      ],
    },
    reward: {
      points: 80,
      badgeId: 'probability-forest-strategist',
      celebration: 'Risk sprint aligned! Probability Forest applauds your pacing. 🌲',
    },
  },
  {
    id: 'probability-forest-safety-net',
    title: 'Probability Forest: Safety Net Planner',
    icon: '🛡️',
    accent: 'from-sky-400/90 to-violet-500/70',
    moduleContext: {
      id: 'probability-forest',
      name: 'Probability Forest',
      insight: 'Pull variance intuition from Probability Forest to cushion against unlucky branches.',
    },
    personas: {
      college: {
        cardDescription: 'Build a backup plan for project delivery week when teammates go dark.',
        narrative:
          'During the Probability Forest quest you logged how group projects implode when contributors vanish. Finals week is here and two teammates are juggling internships.',
        objective: 'Keep your project delivery timeline safe even if a teammate misses their milestone.',
        baseline: [
          { label: 'Team reliability', value: '0.6 average attendance', helper: 'Probability Forest predicted at least one missed stand-up this week.' },
          { label: 'Buffer before deadline', value: '3 days', helper: 'Use the buffer to absorb variance without rushing QA.' },
        ],
      },
      professional: {
        cardDescription: 'Design a contingency cushion for a quarterly portfolio review.',
        narrative:
          'The Probability Forest replay flagged the cash runway nodes most exposed to vendor delays. Finance needs a contingency briefing before presenting to the board.',
        objective: 'Layer safeguards so the portfolio withstands a moderate supply chain shock.',
        baseline: [
          { label: 'Portfolio volatility', value: 'σ = 4.5%', helper: 'Higher than target, meaning reserves matter more this quarter.' },
          { label: 'Vendor dependency', value: '3 critical suppliers', helper: 'Each supplier has a 0.25 chance of slippage this month.' },
        ],
      },
    },
    parameters: [
      {
        id: 'reserveRatio',
        label: 'Safety reserve ratio',
        description: 'Percent of total effort or budget set aside purely as contingency.',
        min: 5,
        max: 40,
        step: 1,
        unit: '%',
        defaultValue: 18,
        targetRange: [16, 24],
        insight: 'Solid! That reserve keeps the path resilient without stalling progress.',
        caution: 'Falling outside this range either risks burnout or locks too much in idle reserves.',
      },
      {
        id: 'communicationCadence',
        label: 'Checkpoint cadence',
        description: 'Frequency of syncs to surface blockers before they cascade.',
        min: 1,
        max: 7,
        step: 0.5,
        unit: 'days',
        defaultValue: 2.5,
        targetRange: [2, 3],
        insight: 'Rhythm locked! Momentum stays high while still intercepting risky branches.',
        caution: 'Cadence drift either overwhelms the team or leaves blind spots between check-ins.',
      },
      {
        id: 'escalationThreshold',
        label: 'Escalation threshold',
        description: 'Deviation level that triggers you to deploy the reserve plan.',
        min: 5,
        max: 30,
        step: 1,
        unit: '% variance',
        defaultValue: 15,
        targetRange: [12, 18],
        insight: 'Smart trigger—Probability Forest heuristics say escalate before 18% deviation.',
        caution: 'If you wait too long, variance compounds; escalate too early and morale dips.',
      },
    ],
    success: {
      summary: 'A resilient plan keeps timelines and financial exposure within guardrails.',
      checkpoints: [
        'Hold 16–24% of effort/budget in reserve.',
        'Sync every ~2–3 days to detect drift early.',
        'Escalate when variance crosses 12–18%.',
      ],
    },
    reward: {
      points: 95,
      badgeId: 'probability-forest-guardian',
      celebration: 'Safety net secured! Probability Forest signals a stable path forward. 🛡️',
    },
  },
];

export function scenariosForAudience(focus: Audience) {
  return scenarioLibrary.filter((scenario) => Boolean(scenario.personas[focus]));
}
