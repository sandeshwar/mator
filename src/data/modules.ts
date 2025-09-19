import { LearningModule } from '../types';

export const learningModules: LearningModule[] = [
  {
    id: 'probability-forest',
    name: 'Probability Forest',
    theme: 'gradient-to-r from-aurora to-emerald-400',
    trackFocus: ['college', 'professional'],
    checkpointLabel: 'Probability Forest',
    summary:
      'Navigate uncertain paths, simulate random events, and learn how probability guides smart choices in exams and investments.',
    mentorTip:
      'Focus on identifying mutually exclusive events first. They unlock shortcuts when time is limited.',
    background:
      'linear-gradient(135deg, rgba(0,212,255,0.25) 0%, rgba(46,212,122,0.15) 100%)',
    miniGame: {
      id: 'probability-simulator',
      title: 'Risk Radar',
      type: 'visual',
      description:
        'Estimate the odds of each scenario to maximize your reward multiplier. Adjust sliders to balance speed and accuracy.',
      durationMinutes: 8,
      reward: {
        points: 150,
        badge: 'Risk Whisperer',
      },
      payload: {
        sliderTargets: [
          {
            id: 'exam-luck',
            label: 'Guess the probability of 3 tricky questions appearing',
            optimal: 0.35,
          },
          {
            id: 'portfolio-dip',
            label: 'Estimate chance of a 5% market drop',
            optimal: 0.22,
          },
          {
            id: 'gaming-break',
            label: 'Predict odds of a teammate missing the raid',
            optimal: 0.48,
          },
        ],
      },
    },
  },
  {
    id: 'algebra-mountain',
    name: 'Algebra Mountain',
    theme: 'gradient-to-r from-purple-500 to-aurora',
    trackFocus: ['college'],
    checkpointLabel: 'Algebra Summit',
    summary:
      'Solve expressive algebra puzzles and unlock shortcuts to high-score exam problems using symbolic manipulation.',
    mentorTip:
      'Group similar terms visually before solving. Pattern spotting is faster than raw computation.',
    background:
      'linear-gradient(135deg, rgba(255, 111, 97, 0.2) 0%, rgba(0, 212, 255, 0.2) 100%)',
    miniGame: {
      id: 'equation-balance',
      title: 'Equation Architect',
      type: 'drag-drop',
      description:
        'Drag number tiles to balance each side of the equation before the tower collapses. Combos grant bonus time.',
      durationMinutes: 10,
      reward: {
        points: 200,
        badge: 'Algebra Ace',
      },
      payload: {
        targetEquation: 'x + y = 14',
        solutions: [
          { left: 5, right: 9 },
          { left: 6, right: 8 },
          { left: 4, right: 10 },
        ],
        tiles: [3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
  },
  {
    id: 'geometry-cove',
    name: 'Geometry Cove',
    theme: 'gradient-to-r from-blue-500 to-moss',
    trackFocus: ['college', 'professional'],
    checkpointLabel: 'Vector Lagoon',
    summary:
      'Tackle spatial reasoning quests by rotating shapes, approximating areas, and planning resource layouts.',
    mentorTip:
      'Use symmetry to simplify. Half the work, double the style points.',
    background:
      'linear-gradient(135deg, rgba(0, 117, 255, 0.25) 0%, rgba(46, 212, 122, 0.2) 100%)',
    miniGame: {
      id: 'shape-shift',
      title: 'Holo-Layout',
      type: 'visual',
      description:
        'Rearrange shapes to cover as much territory as possible. Efficiency boosts your engineering instincts.',
      durationMinutes: 7,
      reward: {
        points: 120,
        badge: 'Spatial Strategist',
      },
      payload: {
        boardSize: 5,
        shapes: [
          { id: 'triangle', cells: [[0, 0], [1, 0], [0, 1]] },
          { id: 'l-shape', cells: [[0, 0], [0, 1], [1, 1]] },
          { id: 'line', cells: [[0, 0], [1, 0], [2, 0]] },
        ],
        goalCoverage: 8,
      },
    },
  },
  {
    id: 'financial-district',
    name: 'Financial District',
    theme: 'gradient-to-r from-amber-400 to-rose-500',
    trackFocus: ['professional'],
    checkpointLabel: 'Portfolio Plaza',
    summary:
      'Simulate investment decisions, hedge risks, and optimize returns like a portfolio analyst.',
    mentorTip:
      'Diversify across volatility bands to stabilize your reward rate. Balance is the new flex.',
    background:
      'linear-gradient(135deg, rgba(255, 209, 102, 0.25) 0%, rgba(255, 111, 97, 0.2) 100%)',
    miniGame: {
      id: 'boss-battle',
      title: 'Market Boss Battle',
      type: 'boss',
      description:
        'Face the Quant Titan in a timed duel. Solve three trick questions before the market closes.',
      durationMinutes: 12,
      reward: {
        points: 260,
        badge: 'Portfolio Prodigy',
      },
      payload: {
        questions: [
          {
            id: 'variance',
            prompt: 'A portfolio has expected return 8% with variance 0.0025. What is the standard deviation?',
            options: ['5%', '4%', '3.5%', '6%'],
            answer: '5%',
            explanation: 'Standard deviation is sqrt(0.0025) = 0.05 = 5%.',
          },
          {
            id: 'compound',
            prompt: 'If you invest $5k at 6% compounded monthly, what is the value after 1 year?',
            options: ['$5,300', '$5,377', '$5,425', '$5,500'],
            answer: '$5,377',
            explanation: 'FV = 5000(1 + 0.06/12)^{12} ≈ $5,377.',
          },
          {
            id: 'allocation',
            prompt: 'To minimize risk, which allocation is best when two assets are negatively correlated?',
            options: ['All-in on Asset A', 'All-in on Asset B', '50/50 Split', 'Shift weekly'],
            answer: '50/50 Split',
            explanation: 'Negative correlation means blending smooths volatility effectively.',
          },
        ],
        timeLimitSeconds: 150,
      },
    },
  },
];
