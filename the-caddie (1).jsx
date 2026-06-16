import { useState, useEffect, useRef } from "react";

const colors = {
  dune: "#c4a882",
  fescue: "#4a5940",
  sky: "#7a9baa",
  fog: "#d6d0c4",
  dark: "#1e1f1a",
  parchment: "#f0ebe0",
  accent: "#8b6f47",
};

const reframes = [
  { neg: "I can't swing like this on a real course. I'm going to embarrass myself.",
    pos: "The swing I've built in practice lives in my body right now. Pressure doesn't erase muscle memory — it tests my ability to trust it." },
  { neg: "Everyone is watching me. What if I top it?",
    pos: "Outcome focus is the thief. I can only control my process. One breath, one target, one swing. That's the entire job." },
  { neg: "I should be better than this. I was striping it yesterday.",
    pos: "Golf is played in the present tense. Yesterday is data, not pressure. What does this shot need? That's all that matters." },
  { neg: "The conditions are throwing me off. I can't control anything out here.",
    pos: "The conditions are the same for everyone. Learning to adapt is the whole game. This is information, not an obstacle." },
  { neg: "If I miss this shot, I'll ruin my round.",
    pos: "One shot does not define a round. Great players hit bad shots and walk to the next one." },
  { neg: "I'm too in my head. I can't stop thinking about mechanics.",
    pos: "Pick one external target and stare at it. Your body was trained. The swing knows. My only job is to get out of its way." },
  { neg: "I hit it great on the range but now I've lost it completely.",
    pos: "The range and the course aren't different swings. They're different attention states. Return to the process: read, breathe, commit, swing." },
  { neg: "I've worked so hard on my game — why isn't it showing up when it counts?",
    pos: "Hard work earns the swing, not the score. Trust the process you've built. Every round is a chance to let it out, not prove something." },
];

const cues = [
  { category: "Tempo", word: "Smooth", desc: "Not slow — smooth. Think of the transition as pouring honey, not striking a match." },
  { category: "Contact", word: "Thump", desc: "Focus entirely on the sound and feel of compression. Let everything else follow contact." },
  { category: "Full Swing", word: "Finish", desc: "Commit to a full, balanced finish. Your body can't swing anxiously and finish fully." },
  { category: "Takeaway", word: "Wide", desc: "A wide, low takeaway arrests tension before it starts. Width creates a free downswing." },
  { category: "Tension Release", word: "Exhale", desc: "Breathe out as you start the backswing. Oxygen leaving = grip pressure falling." },
  { category: "Attention", word: "Target", desc: "Return your gaze to the target and stay there mentally. Body follows attention." },
];

const routineSteps = [
  { title: "Read from behind", desc: "Stand 3–4 steps behind the ball. See the full shape of the shot — not just the target, the entire flight. This anchors you in the visual, not the mechanical." },
  { title: "One breath — slow exhale", desc: "Exhale fully before taking your practice swing. This resets your nervous system and signals the transition from thinking mode to athletic mode." },
  { title: "Feel the swing, don't think it", desc: "One loose practice swing focused purely on tempo and feel — not mechanics. All that range work lives in your body now. Trust it and let the swing be free." },
  { title: "Commit to the target", desc: "Pick a precise intermediate target 2–3 feet ahead of the ball. Everything else disappears. One shot, one target, one intention." },
  { title: "Waggle, waggle, exhale, go", desc: "Two slow deliberate waggles along the target line — feel the weight of the clubhead, keep the grip soft. On the last waggle, exhale fully. Then go immediately, don't pause. Let the waggle flow straight into the takeaway. You can't waggle and be stiff at the same time." },
];

const warmupSections = [
  {
    label: "Stack Speed Warm-Up",
    color: colors.sky,
    steps: [
      { title: "Open Stack Speed app", desc: "Launch the Stack system and select the Speed Warm-Up protocol. This comes first — prime the engine before anything else." },
      { title: "Complete the warm-up swings", desc: "Follow the Stack-prescribed warm-up sequence. Focus on freedom and speed, not ball striking. Let it rip." },
      { title: "Note your warm-up speed", desc: "Check your baseline speed for the day. Don't judge it — just note it. This is your starting point for the round." },
    ]
  },
  {
    label: "Stack Wedge — 10 min",
    color: colors.dune,
    steps: [
      { title: "Open Stack Wedge app", desc: "Launch Stack Wedge and select the pre-round session. Keep it to 10 minutes — this is activation, not a full practice session." },
      { title: "PW & GW feel shots", desc: "4–6 shots each with your PW (138 yds) and GW (118 yds). Focus on feel and contact, not precision. Let the swing happen." },
      { title: "SW & LW distance check", desc: "3–4 shots each with your SW (96 yds) and LW (75 yds max). Confirm your feel for the short ones — these win holes." },
      { title: "Complete the session", desc: "Finish the Stack Wedge protocol. Note if a distance feels off today. Now you know your wedge numbers for the round." },
    ]
  },
  {
    label: "Speed Priming",
    color: "#9ab890",
    steps: [
      { title: "Open Stack Radar", desc: "Launch Stack Radar and select the pre-round speed activation. This primes your fast-twitch system before the first tee." },
      { title: "Complete the speed sequence", desc: "Follow the Stack protocol. These are fast, loose, intentional swings — not range warm-up swings. Speed is the goal." },
      { title: "Lock in your cue word", desc: "Before you walk to the first tee, go to the Focus Cue tab and pick your word for the round. Carry it with you." },
    ]
  },
];

const phases = [
  { label: "Inhale", duration: 4, scale: 1.3 },
  { label: "Hold",   duration: 4, scale: 1.3 },
  { label: "Exhale", duration: 4, scale: 1.0 },
  { label: "Hold",   duration: 4, scale: 1.0 },
];

// ── Google Fonts inline ──────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap";
document.head.appendChild(fontLink);

const css = `
  @keyframes flagSway { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(3deg)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.1)} }
  .fade-up-1{animation:fadeUp 0.8s ease 0.1s both}
  .fade-up-2{animation:fadeUp 0.8s ease 0.3s both}
  .fade-up-3{animation:fadeUp 0.8s ease 0.5s both}
  .fade-up-4{animation:fadeUp 0.8s ease 0.7s both}
  .fade-up-5{animation:fadeUp 0.8s ease 0.9s both}
  .flag-sway{animation:flagSway 6s ease-in-out infinite}
  .pulse-ring{animation:pulse 3s ease-in-out infinite}
`;
const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ── Sub-components ───────────────────────────────────────────────

function WarmupPanel() {
  const totalSteps = warmupSections.reduce((acc, s) => acc + s.steps.length, 0);
  const [done, setDone] = useState(Array(totalSteps).fill(false));

  let globalIdx = 0;
  const reset = () => setDone(Array(totalSteps).fill(false));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
      <p style={{
        fontSize:"1rem", fontWeight:300, color:colors.fog, lineHeight:1.75,
        fontStyle:"italic", borderLeft:`2px solid rgba(196,168,130,0.3)`, paddingLeft:18,
      }}>
        Run through this before every round. Stack Speed first, wedge feel second, speed activation last. Then go play.
      </p>

      {warmupSections.map((section, si) => {
        const sectionStart = globalIdx;
        globalIdx += section.steps.length;
        return (
          <div key={si}>
            {/* Section header */}
            <div style={{
              display:"flex", alignItems:"center", gap:12, marginBottom:12,
            }}>
              <div style={{ height:1, flex:1, background:`rgba(196,168,130,0.12)` }} />
              <div style={{
                fontSize:"0.65rem", letterSpacing:"0.25em", textTransform:"uppercase",
                color: section.color, fontFamily:"'Crimson Pro',serif", fontWeight:400,
              }}>{section.label}</div>
              <div style={{ height:1, flex:1, background:`rgba(196,168,130,0.12)` }} />
            </div>

            {/* Steps */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {section.steps.map((step, i) => {
                const idx = sectionStart + i;
                return (
                  <div key={i} onClick={() => setDone(d => d.map((v,j) => j===idx ? !v : v))} style={{
                    border:`1px solid rgba(196,168,130,${done[idx]?0.45:0.13})`,
                    borderRadius:4, padding:"16px 20px", display:"flex", alignItems:"flex-start", gap:16,
                    background: done[idx] ? "rgba(196,168,130,0.05)" : "rgba(255,255,255,0.02)",
                    cursor:"pointer", transition:"all 0.3s",
                  }}>
                    <div style={{
                      width:30, height:30, borderRadius:"50%", flexShrink:0,
                      border:`1px solid ${done[idx] ? section.color : "rgba(196,168,130,0.35)"}`,
                      background: done[idx] ? section.color : "transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"0.8rem", fontFamily:"'Playfair Display',serif",
                      color: done[idx] ? colors.dark : colors.dune,
                      transition:"all 0.3s",
                    }}>
                      {done[idx] ? "✓" : idx + 1}
                    </div>
                    <div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", color:colors.parchment, marginBottom:5 }}>{step.title}</div>
                      <div style={{ fontSize:"0.88rem", color:colors.fog, lineHeight:1.6, fontWeight:300 }}>{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <button onClick={reset} style={{
        background:"transparent", border:"none", color:"rgba(196,168,130,0.35)",
        fontFamily:"'Crimson Pro',serif", fontSize:"0.8rem", letterSpacing:"0.15em",
        textTransform:"uppercase", cursor:"pointer", alignSelf:"flex-start", padding:"8px 0",
      }}>↺ Reset</button>
    </div>
  );
}

function BreathePanel() {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(4);
  const timerRef = useRef(null);
  const stateRef = useRef({ running: false, phaseIdx: 0, count: 4 });

  const stop = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    setPhaseIdx(0);
    setCount(4);
    stateRef.current = { running: false, phaseIdx: 0, count: 4 };
  };

  const start = () => {
    stateRef.current = { running: true, phaseIdx: 0, count: phases[0].duration };
    setRunning(true);
    setPhaseIdx(0);
    setCount(phases[0].duration);
    timerRef.current = setInterval(() => {
      const s = stateRef.current;
      let newCount = s.count - 1;
      let newPhase = s.phaseIdx;
      if (newCount <= 0) {
        newPhase = (s.phaseIdx + 1) % 4;
        newCount = phases[newPhase].duration;
      }
      stateRef.current = { ...s, phaseIdx: newPhase, count: newCount };
      setPhaseIdx(newPhase);
      setCount(newCount);
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const phase = phases[phaseIdx];
  const scale = running ? phase.scale : 1;

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:32 }}>
      <p style={{ textAlign:"center", fontSize:"1.1rem", fontWeight:300, color:colors.fog, lineHeight:1.7, maxWidth:460 }}>
        Box breathing activates the parasympathetic nervous system within 60 seconds.
        Use this before any shot that carries weight. The ocean doesn't rush.
      </p>

      <div style={{ display:"flex", gap:28, textAlign:"center" }}>
        {["Inhale","Hold","Exhale","Hold"].map((l,i) => (
          <div key={i} style={{ color:colors.fog, fontSize:"0.9rem" }}>
            <div style={{ fontSize:"1.4rem", color:colors.sky, fontFamily:"'Playfair Display',serif" }}>4s</div>
            {l}
          </div>
        ))}
      </div>

      {/* Circle */}
      <div onClick={running ? stop : start} style={{ position:"relative", width:200, height:200, cursor:"pointer", userSelect:"none" }}>
        {/* outer ring */}
        <div style={{
          position:"absolute", inset:0, borderRadius:"50%",
          border:`1px solid rgba(196,168,130,${running?0.5:0.2})`,
          transition:"transform 4s ease, opacity 0.5s",
          transform:`scale(${running ? (phase.scale > 1 ? 1.2 : 1) : 1})`,
        }} />
        {/* mid ring */}
        <div style={{
          position:"absolute", inset:16, borderRadius:"50%",
          border:`1px solid rgba(122,155,170,${running?0.4:0.15})`,
          transition:"transform 4s ease",
          transform:`scale(${running ? (phase.scale > 1 ? 1.15 : 1) : 1})`,
        }} />
        {/* core */}
        <div style={{
          position:"absolute", inset:32, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(74,89,64,0.6) 0%, rgba(30,31,26,0.5) 100%)",
          border:`1px solid rgba(196,168,130,0.4)`,
          display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
          transition:"transform 4s ease",
          transform:`scale(${scale})`,
        }}>
          <div style={{ fontSize:"1.8rem", fontFamily:"'Crimson Pro',serif", fontWeight:300, color:colors.parchment, lineHeight:1 }}>
            {running ? count : "—"}
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"0.85rem", color:colors.dune, marginTop:4 }}>
            {running ? phase.label : "tap to begin"}
          </div>
        </div>
      </div>

      <button onClick={running ? stop : start} style={{
        fontFamily:"'Crimson Pro',serif", fontSize:"0.8rem", letterSpacing:"0.2em", textTransform:"uppercase",
        background:"transparent", border:`1px solid rgba(196,168,130,0.5)`, color:colors.dune,
        padding:"11px 34px", cursor:"pointer", borderRadius:2,
      }}>
        {running ? "Stop" : "Begin"}
      </button>
    </div>
  );
}

function RoutinePanel() {
  const [done, setDone] = useState([false,false,false,false,false]);
  const toggle = i => setDone(d => d.map((v,j) => j===i ? !v : v));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {routineSteps.map((s,i) => (
        <div key={i} onClick={() => toggle(i)} style={{
          border:`1px solid rgba(196,168,130,${done[i]?0.45:0.15})`,
          borderRadius:4, padding:"18px 22px", display:"flex", alignItems:"flex-start", gap:18,
          background:done[i]?"rgba(196,168,130,0.05)":"rgba(255,255,255,0.02)",
          cursor:"pointer", transition:"all 0.3s",
        }}>
          <div style={{
            width:34, height:34, borderRadius:"50%", flexShrink:0,
            border:`1px solid rgba(196,168,130,0.4)`,
            background:done[i]?colors.fescue:"transparent",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"'Playfair Display',serif", fontSize:"0.85rem",
            color:done[i]?colors.parchment:colors.dune, transition:"all 0.3s",
          }}>
            {done[i] ? "✓" : i+1}
          </div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color:colors.parchment, marginBottom:6 }}>{s.title}</div>
            <div style={{ fontSize:"0.9rem", color:colors.fog, lineHeight:1.6, fontWeight:300 }}>{s.desc}</div>
          </div>
        </div>
      ))}
      <button onClick={() => setDone([false,false,false,false,false])} style={{
        background:"transparent", border:"none", color:"rgba(196,168,130,0.35)",
        fontFamily:"'Crimson Pro',serif", fontSize:"0.8rem", letterSpacing:"0.15em",
        textTransform:"uppercase", cursor:"pointer", alignSelf:"flex-start", padding:"8px 0",
      }}>↺ Reset</button>
    </div>
  );
}

function ReframePanel() {
  const [idx, setIdx] = useState(0);
  const r = reframes[idx];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{
        background:"rgba(255,255,255,0.02)", border:"1px solid rgba(160,112,96,0.25)",
        borderRadius:4, padding:"24px 26px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ fontSize:"0.65rem", letterSpacing:"0.25em", textTransform:"uppercase", color:"#a07060", marginBottom:10 }}>Anxious thought</div>
        <div style={{ fontSize:"1.05rem", fontStyle:"italic", color:colors.parchment, lineHeight:1.7, fontWeight:300 }}>{r.neg}</div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"0 8px" }}>
        <div style={{ flex:1, height:1, background:"rgba(196,168,130,0.15)" }} />
        <span style={{ color:colors.dune, fontFamily:"'Playfair Display',serif", fontSize:"1.1rem" }}>→</span>
        <div style={{ flex:1, height:1, background:"rgba(196,168,130,0.15)" }} />
      </div>

      <div style={{
        background:"rgba(255,255,255,0.02)", border:"1px solid rgba(74,89,64,0.35)",
        borderRadius:4, padding:"24px 26px",
      }}>
        <div style={{ fontSize:"0.65rem", letterSpacing:"0.25em", textTransform:"uppercase", color:colors.fescue, marginBottom:10, opacity:0.9 }}>Reframe</div>
        <div style={{ fontSize:"1.05rem", fontStyle:"italic", color:colors.parchment, lineHeight:1.7, fontWeight:300 }}>{r.pos}</div>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={() => setIdx((idx-1+reframes.length)%reframes.length)} style={navBtnStyle}>← Prev</button>
        <span style={{ fontSize:"0.85rem", color:colors.fog, fontWeight:300 }}>{idx+1} / {reframes.length}</span>
        <button onClick={() => setIdx((idx+1)%reframes.length)} style={navBtnStyle}>Next →</button>
      </div>
    </div>
  );
}

function FocusPanel() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
      <p style={{
        fontSize:"1rem", fontWeight:300, color:colors.fog, lineHeight:1.75,
        fontStyle:"italic", borderLeft:`2px solid rgba(196,168,130,0.3)`, paddingLeft:18,
      }}>
        Your brain on the range is quiet — no scorecard, no consequence, no pressure.
        A single process cue collapses the gap between practice and play. Choose what resonates.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {cues.map((c,i) => (
          <div key={i} onClick={() => setSelected(i)} style={{
            background:"rgba(255,255,255,0.02)",
            border:`1px solid rgba(196,168,130,${selected===i?0.5:0.12})`,
            borderRadius:4, padding:18, cursor:"pointer", transition:"all 0.3s",
            background: selected===i ? "rgba(196,168,130,0.06)" : "rgba(255,255,255,0.02)",
            position:"relative",
          }}>
            {selected===i && <span style={{ position:"absolute", top:12, right:14, color:colors.fescue, fontSize:"0.85rem" }}>✓</span>}
            <div style={{ fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", color:colors.sky, marginBottom:7 }}>{c.category}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color:colors.parchment, marginBottom:5 }}>{c.word}</div>
            <div style={{ fontSize:"0.82rem", color:colors.fog, lineHeight:1.5, fontWeight:300 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ height:1, background:"rgba(196,168,130,0.15)" }} />

      <div style={{
        background:"rgba(74,89,64,0.1)", border:"1px solid rgba(74,89,64,0.3)",
        borderRadius:4, padding:"18px 22px",
      }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"0.95rem", color:colors.dune, marginBottom:10 }}>
          Your cue word for this round
        </div>
        <div style={{
          fontSize:"2.5rem", fontFamily:"'Playfair Display',serif", color:colors.parchment,
          textAlign:"center", padding:"8px 0",
          opacity: selected !== null ? 1 : 0.25,
          transition:"opacity 0.4s ease",
        }}>
          {selected !== null ? cues[selected].word : "—"}
        </div>
      </div>
    </div>
  );
}

const navBtnStyle = {
  fontFamily:"'Crimson Pro',serif", fontSize:"0.8rem", letterSpacing:"0.15em", textTransform:"uppercase",
  background:"transparent", border:"1px solid rgba(196,168,130,0.3)", color:colors.dune,
  padding:"9px 22px", cursor:"pointer", borderRadius:2,
};

const tabs = ["Stack Warm-Up","Breathe","Pre-Shot","Reframe","Focus Cue"];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{
      fontFamily:"'Crimson Pro',Georgia,serif",
      background:colors.dark, color:colors.parchment,
      minHeight:"100vh", overflowX:"hidden", position:"relative",
    }}>
      {/* Sky gradient */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none",
        background:`
          radial-gradient(ellipse 80% 50% at 50% 0%, #2a3a45 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 80% 20%, #3d4a35 0%, transparent 50%),
          linear-gradient(180deg, #161a1d 0%, #1e2118 40%, #1e1f1a 100%)
        `,
      }} />

      {/* Bottom silhouette */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, height:180, pointerEvents:"none",
        background:`
          radial-gradient(ellipse 120% 60% at 20% 100%, #2a3020 0%, transparent 60%),
          radial-gradient(ellipse 80% 80% at 80% 110%, #1a2010 0%, transparent 50%)
        `,
      }} />

      {/* Flag */}
      <div className="flag-sway" style={{ position:"fixed", top:60, right:"12%", opacity:0.12, pointerEvents:"none", zIndex:1 }}>
        <svg width="50" viewBox="0 0 60 120" fill="none">
          <line x1="30" y1="0" x2="30" y2="120" stroke="rgba(196,168,130,0.7)" strokeWidth="2"/>
          <path d="M30 8 L58 22 L30 36 Z" fill="rgba(196,168,130,0.5)"/>
        </svg>
      </div>

      {/* Main content */}
      <div style={{
        position:"relative", zIndex:2,
        display:"flex", flexDirection:"column", alignItems:"center",
        padding:"60px 20px 80px", minHeight:"100vh",
      }}>

        {/* Logo */}
        <div className="fade-up-1" style={{ textAlign:"center", marginBottom:44 }}>
          <div style={{ fontWeight:300, letterSpacing:"0.3em", fontSize:"0.7rem", color:colors.dune, textTransform:"uppercase", marginBottom:10 }}>
            Mental Game · Performance Coach
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(3rem,10vw,5.5rem)", fontWeight:400, lineHeight:0.95, color:colors.parchment }}>
            The <em style={{ fontStyle:"italic", color:colors.dune }}>Caddie</em>
          </div>
          <div style={{ fontSize:"1rem", fontWeight:300, color:colors.fog, marginTop:14, letterSpacing:"0.04em" }}>
            Your season-long mental game companion
          </div>
        </div>

        {/* Tabs */}
        <div className="fade-up-2" style={{
          display:"flex", gap:2, background:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(196,168,130,0.2)", borderRadius:4,
          padding:4, marginBottom:40, flexWrap:"wrap", justifyContent:"center",
        }}>
          {tabs.map((t,i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              fontFamily:"'Crimson Pro',serif", fontSize:"0.8rem", letterSpacing:"0.12em", textTransform:"uppercase",
              background: activeTab===i ? colors.accent : "transparent",
              border:"none", color: activeTab===i ? colors.parchment : colors.fog,
              padding:"9px 18px", cursor:"pointer", borderRadius:2, transition:"all 0.25s",
            }}>{t}</button>
          ))}
        </div>

        {/* Panel */}
        <div className="fade-up-3" style={{ width:"100%", maxWidth:700 }}>
          {activeTab === 0 && <WarmupPanel />}
          {activeTab === 1 && <BreathePanel />}
          {activeTab === 2 && <RoutinePanel />}
          {activeTab === 3 && <ReframePanel />}
          {activeTab === 4 && <FocusPanel />}
        </div>
      </div>
    </div>
  );
}
