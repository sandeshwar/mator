# Scenario Authoring Guide

The scenario simulator pulls its content from the structured JSON schema in [`src/data/scenarios.ts`](../src/data/scenarios.ts). Each entry keeps the learning arc tight with the existing module lore while defining the sliders, copy, and rewards that surface inside the UI.

## File layout

```text
src/
  data/
    scenarios.ts    ← ScenarioDefinition objects live here
  components/
    ScenarioShowcase.tsx
    ScenarioSimulator.tsx
```

The showcase reads the library, renders persona-specific cards, and routes the selected entry to the simulator. The simulator renders each parameter as an interactive slider, gives live feedback, and checks whether every target range is satisfied before the learner can claim rewards.

## ScenarioDefinition schema

Each scenario exported from `scenarioLibrary` must satisfy the `ScenarioDefinition` interface in [`src/types.ts`](../src/types.ts):

```ts
interface ScenarioDefinition {
  id: string;                       // Unique key used for persistence
  title: string;                    // Display title on cards and simulator
  icon: string;                     // Emoji or glyph shown on the card
  accent: string;                   // Tailwind gradient classes for card overlay
  moduleContext: {
    id: string;                     // Module identifier (e.g. 'probability-forest')
    name: string;                   // Friendly module name
    insight: string;                // Short line linking the scenario back to the module
  };
  personas: Record<Audience, ScenarioPersonaContent>;
  parameters: ScenarioParameter[];  // Slider configuration and live feedback copy
  success: {
    summary: string;                // High-level success statement shown in the footer
    checkpoints: string[];          // Bullet list describing the objective
  };
  reward: {
    points: number;                 // Points to add to the learner profile
    badgeId?: string;               // Optional badge id that is granted on success
    celebration: string;            // Pulse message broadcast after completion
  };
}
```

### Persona-specific content

`ScenarioPersonaContent` lets you tailor card copy, baseline inputs, and objectives per audience:

```ts
interface ScenarioPersonaContent {
  cardDescription: string;                      // Card teaser text
  narrative: string;                            // Simulator intro paragraph
  objective: string;                            // Highlighted objective text
  baseline: { label: string; value: string; helper: string }[]; // Baseline metrics table
}
```

Provide entries for both `college` and `professional` so each persona receives resonant framing.

### Adjustable parameters

Each slider is defined by a `ScenarioParameter`:

```ts
interface ScenarioParameter {
  id: string;                         // Unique per scenario
  label: string;                      // Slider heading
  description: string;                // Supporting copy under the heading
  min: number;
  max: number;
  step: number;                       // Can be fractional
  unit?: string;                      // Appears next to the live value
  defaultValue: number;               // Starting value in the simulator
  targetRange: [number, number];      // Success window checked in real time
  insight: string;                    // Positive feedback when in range
  caution: string;                    // Coaching line when outside the range
}
```

Live feedback is generated automatically. When the learner drags a slider into the `targetRange`, the simulator shows `insight`; otherwise it highlights `caution` with the distance to the recommended band.

## Adding a new scenario

1. **Create the definition** in [`src/data/scenarios.ts`](../src/data/scenarios.ts).
   * Choose a unique `id` and reuse the related learning module inside `moduleContext` to keep continuity.
   * Add both `college` and `professional` persona entries even if the tone only changes slightly.
   * Define 2–4 `parameters` with realistic ranges and target windows that reflect the skills you want the learner to practice.
2. **Attach a reward**.
   * Provide `points` to award on success.
   * Optionally set `badgeId` to grant a bespoke emblem. To surface the badge in the Reward Center, add a matching entry in [`src/data/rewards.ts`](../src/data/rewards.ts).
3. **Update supporting copy** if needed.
   * Reference module lore (e.g., Probability Forest insights) so the scenario feels like a direct extension of the course path.
4. **Test the experience**.
   * Run `npm run lint` to ensure type safety.
   * Launch `npm run dev`, open the Scenario Showcase, and drag sliders to verify the success criteria, reward pulse, and badge unlock flow.

By keeping the content in `scenarios.ts`, new drops stay lightweight—add a new object, adjust optional rewards, and the simulator will automatically present the experience across both personas.
