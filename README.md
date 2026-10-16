# RepairWise

**Offline Android app (React Native + Expo) that gives an explainable repair, refurbish or replace verdict for broken items and tracks the money, CO2 and e-waste saved.**


---

## The problem

When something breaks, most people don't know whether to fix it or buy new. They can't judge if a repair quote is fair, how much life the item has left, or whether a home repair is safe. Repairable items get thrown away, which means wasted money and avoidable e-waste.

## The solution

RepairWise asks a few questions (item, age, new price, damage, repair quote, warranty) and returns a clear verdict with a score, a confidence level and plain-language reasons. It also warns the user when a repair is unsafe, and suggests what to do with the item afterwards.


## Key features

- **Explainable verdict:** Repair, Refurbish or Replace, with the score, confidence and the contribution of each factor
- **Safety gate:** hazards (swollen battery, burning smell, water, exposed wires) and risky appliances trigger a "see a technician" warning. These are fixed rules, not AI
- **Second-life suggestions:** keep, sell, donate or recycle
- **Impact dashboard:** money saved, CO2 avoided and e-waste kept out, counted only for items the user confirms as repaired
- **Repair outcome tracker:** records whether repairs last, with a six-month follow-up notification
- **Supporting tools:** DIY guides, repair shop list, e-waste recycling guide, reminders, PDF reports
- **Accessibility and reach:** dark mode, English, Hindi and Marathi
- **Offline first:** no account, no server, data stays on the phone

## How the decision works

The engine in [`src/engine.js`](src/engine.js) is **rule-based weighted scoring, not machine learning**. That was a deliberate choice: the logic is transparent and can be explained and checked.

Five factors are each scored 0 to 100, then combined:

| Factor | Weight | Idea |
|---|---|---|
| Repair cost vs new price | 35% | Cheaper repair relative to a new item scores higher |
| Remaining life | 25% | `1 - age / typical lifespan` |
| Ease of repair | 15% | Parts availability and severity of the fault |
| Warranty | 10% | Under warranty scores higher |
| Environmental benefit | 15% | Items with higher manufacturing emissions favour repair |

```
score = 0.35*cost + 0.25*life + 0.15*repairability + 0.10*warranty + 0.15*environment

score >= 58   -> REPAIR
40 to 57      -> REFURBISH / DONATE
score < 40    -> REPLACE
confidence    =  min(95, 55 + 0.8 * |score - 50|)
```

**Worked example:** a 3-year-old phone (new price ₹18,000, repair quote ₹3,500) scores **62**, so the verdict is **Repair**, with ₹14,500 saved.

## Tech stack

| Area | Technology |
|---|---|
| Framework | React Native with Expo (SDK 57), JavaScript |
| Navigation | React Navigation (bottom tabs + native stack) |
| Storage | AsyncStorage (on-device) |
| Device features | expo-notifications, expo-print, expo-sharing, expo-image-picker |
| Build and tools | EAS Build (APK), VS Code, Git and GitHub |

## Architecture

```
Screens (React Native)
   |
Logic layer: decision engine, safety gate, second-life, impact stats, i18n, theme
   |
Data layer: AsyncStorage + built-in datasets (categories, DIY guides, sample shops)
   |
Device services: notifications, PDF share, camera/gallery, maps links
```

## Project structure

```
App.js                 navigation, theme and language setup
src/engine.js          decision engine, safety gate, second life, impact calculations
src/store.js           saved data and settings
src/theme.js, i18n.js  colours and dark mode, Hindi/Marathi translations
src/ui.js              shared components
src/report.js          PDF reports
src/followup.js        six-month follow-up notification
src/data.js            DIY guides and sample shops
src/screens/           Home, Diagnose, Result, History, Impact, More, DIY, Shops,
                       Recycle, Reminders, About, Triage
server/worker.js       optional AI photo-triage server (not enabled)
docs/                  report, presentation, screenshots
```

## Run locally

Requires Node.js (LTS) and the Expo Go app on your phone.

```bash
git clone https://github.com/[your-username]/repairwise-app.git
cd repairwise-app
npm install
npx expo start
```

Scan the QR code with Expo Go. In the app, use **Load sample data** on the Home screen to see filled screens.

## Build the APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Or download the ready-made APK from [[Releases](../../releases).](https://expo.dev/accounts/shalaka_parhad/projects/repairwise-app/builds/2bb7b8b7-e480-4fd0-86b5-1da484f6bf20)



## Use of generative AI

- **Tool:** Claude (Anthropic), used through the chat interface
- **IDE:** Visual Studio Code
- **How it was used:** [describe the prompts and stages, for example architecture, engine, screens, report]
- **What the team did ourselves:** [your own edits, testing, debugging and decisions]

The team can explain and modify the code, including the scoring engine.

## Limitations

- Cost, lifespan and CO2 values are **approximate estimates**, not measured data
- Repair shops are **sample data**; the app opens maps to find real shops
- The optional AI photo analysis is implemented in code but **not enabled**, because it needs a paid API and a server. Guided triage works without it
- Data is stored on one device only (no sync or backup)
- Some long text (DIY steps, About) is English only

## Future work

Validate the weights with real repair-cost and outcome data, use documented CO2 and e-waste reference factors, verified technician listings, AI photo triage with fixed safety rules, and cloud backup.

## Sustainable Development Goals

SDG 12 (Responsible Consumption and Production, primary), SDG 13 (Climate Action), SDG 8 (Decent Work and Economic Growth), SDG 11 (Sustainable Cities and Communities). The app estimates impact; it does not measure official UN SDG indicators.

## License

MIT. Copyright (c) 2026 RepairWise team.
