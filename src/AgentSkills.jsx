import { useState, useEffect, useRef } from "react";

const SLIDES = [
  {
    id: "title",
    type: "title",
    title: "Agent Skills",
    subtitle: "in GitHub Copilot",
    detail: "Teaching your AI coding agent new capabilities",
  },
  {
    id: "what",
    type: "concept",
    title: "What Are Agent Skills?",
    points: [
      "Folders of instructions, scripts & resources",
      "Copilot loads them automatically when relevant",
      "Work across VS Code, Copilot CLI & coding agent",
      "Unlike instructions, skills enable specialized workflows",
    ],
    icon: "🧠",
    note: "Think of them as reusable runbooks for your AI assistant",
  },
  {
    id: "enable",
    type: "step",
    stepNum: 1,
    title: "Enable Agent Skills",
    description: "Open VS Code Settings and search for the skills toggle",
    code: `// VS Code Settings (Ctrl + ,)
// Search: "chat.useAgentSkills"
// ✅ Check the box to enable

{
  "chat.useAgentSkills": true
}`,
    tip: "This tells VS Code to look for skill definitions in your workspace",
  },
  {
    id: "structure",
    type: "folder",
    stepNum: 2,
    title: "Create the Folder Structure",
    description: "Skills live in a specific directory hierarchy",
    tree: [
      { name: "my-project/", indent: 0, type: "root" },
      { name: ".github/", indent: 1, type: "folder" },
      { name: "skills/", indent: 2, type: "folder" },
      { name: "react-testing/", indent: 3, type: "skill" },
      { name: "SKILL.md", indent: 4, type: "file" },
      { name: "test-template.jsx", indent: 4, type: "resource" },
      { name: "api-patterns/", indent: 3, type: "skill" },
      { name: "SKILL.md", indent: 4, type: "file" },
      { name: "example-service.ts", indent: 4, type: "resource" },
    ],
    tip: "VS Code also recognizes .claude/skills/ for backwards compatibility",
  },
  {
    id: "skillmd",
    type: "code",
    stepNum: 3,
    title: "Write the SKILL.md File",
    description: "Each skill needs a SKILL.md with YAML frontmatter + instructions",
    code: `---
name: react-testing
description: >
  Guide for testing React components
  with React Testing Library. Use when
  asked to create or debug component tests.
---

# React Component Testing

## When to use this skill
- Creating new component tests
- Debugging failing test suites
- Setting up test infrastructure

## Testing Guidelines
1. Use \`@testing-library/react\`
2. Test behavior, not implementation
3. Use \`screen\` queries over container
4. Prefer \`userEvent\` over \`fireEvent\`

## Template
See [test template](./test-template.jsx)
for the standard test structure.`,
    highlights: [
      { label: "name", desc: "Must match folder name, lowercase with hyphens" },
      { label: "description", desc: "Helps Copilot decide when to load this skill" },
      { label: "body", desc: "The actual instructions Copilot follows" },
    ],
  },
  {
    id: "loading",
    type: "flow",
    title: "How Copilot Uses Skills",
    subtitle: "Progressive three-stage loading keeps context efficient",
    stages: [
      {
        num: 1,
        label: "Discovery",
        desc: "Copilot reads the skill name & description from frontmatter",
        icon: "🔍",
        detail: 'You ask: "help me test the LoginForm component"',
      },
      {
        num: 2,
        label: "Instructions",
        desc: "Copilot loads the SKILL.md body into its context",
        icon: "📖",
        detail: "It now knows your testing guidelines and patterns",
      },
      {
        num: 3,
        label: "Resources",
        desc: "Copilot accesses referenced files only when needed",
        icon: "📦",
        detail: "It reads test-template.jsx to scaffold your new test",
      },
    ],
    note: "You can install many skills without bloating context — only relevant ones load",
  },
  {
    id: "invoke",
    type: "demo",
    stepNum: 4,
    title: "Using Skills in Chat",
    description: "Skills can be triggered automatically or manually",
    methods: [
      {
        label: "Auto-detection",
        example: '"Write tests for the UserProfile component"',
        result: "Copilot matches to react-testing skill automatically",
      },
      {
        label: "Slash command",
        example: "/react-testing for the LoginForm page",
        result: "Directly invokes the skill with extra context",
      },
      {
        label: "/skills menu",
        example: "Type /skills in chat input",
        result: "Opens Configure Skills menu to browse & toggle",
      },
    ],
  },
  {
    id: "createskill",
    type: "step",
    stepNum: 5,
    title: "Quick Create with /create-skill",
    description: "Let Copilot generate a skill for you from a description",
    code: `// In Copilot Chat, type:

/create-skill a skill for running
and debugging integration tests

// Copilot will:
// → Ask clarifying questions
// → Generate the folder structure
// → Create SKILL.md with frontmatter
// → Add template files

// You can also extract from a session:
"Create a skill from how we just
 debugged that authentication issue"`,
    tip: "This is the fastest way to capture a repeatable workflow",
  },
  {
    id: "locations",
    type: "concept",
    title: "Where Skills Can Live",
    points: [
      "📁 .github/skills/ — shared with your team via the repo",
      "📁 .claude/skills/ — backwards compatible with Claude Code",
      "📁 ~/.copilot/skills/ — personal, available across all projects",
      "📦 VS Code extensions — bundled in agent plugins",
    ],
    icon: "📍",
    note: "Organization & enterprise-level skill sharing is coming soon",
  },
  {
    id: "community",
    type: "concept",
    title: "Community Skills & Resources",
    points: [
      "github/awesome-copilot — community agents, skills & instructions",
      "anthropics/skills — reference skills from Anthropic",
      "agentskills.io — the open Agent Skills standard",
      "Skills are portable across any skills-compatible agent",
    ],
    icon: "🌍",
    note: "Always review shared skills before using them in your projects",
  },
  {
    id: "end",
    type: "title",
    title: "Start Building Skills",
    subtitle: "Your AI agent, your workflows",
    detail: "Enable chat.useAgentSkills → Create .github/skills/ → Write SKILL.md → Ship it",
  },
];

const COLORS = {
  bg: "#0d1117",
  surface: "#161b22",
  surfaceLight: "#1c2129",
  border: "#30363d",
  borderLight: "#484f58",
  accent: "#58a6ff",
  accentGlow: "rgba(88, 166, 255, 0.15)",
  green: "#3fb950",
  greenGlow: "rgba(63, 185, 80, 0.12)",
  orange: "#d29922",
  purple: "#bc8cff",
  red: "#f85149",
  text: "#e6edf3",
  textMuted: "#8b949e",
  textDim: "#484f58",
  folderYellow: "#d29922",
  fileBlue: "#58a6ff",
  skillGreen: "#3fb950",
};

function ProgressBar({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 4, padding: "0 32px", justifyContent: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 3,
            width: i === current ? 32 : 16,
            borderRadius: 2,
            background: i === current ? COLORS.accent : i < current ? COLORS.green : COLORS.border,
            transition: "all 0.5s ease",
          }}
        />
      ))}
    </div>
  );
}

function TypeWriter({ text, speed = 30, delay = 0, style = {} }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setStarted(false);
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [text, delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, started, text, speed]);

  return <span style={style}>{displayed}<span style={{ opacity: displayed.length < text.length ? 1 : 0, transition: "opacity 0.3s" }}>▊</span></span>;
}

function FadeIn({ children, delay = 0, direction = "up", style = {} }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const transform = direction === "up" ? "translateY(20px)" : direction === "left" ? "translateX(20px)" : "translateY(-20px)";

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0)" : transform,
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function TitleSlide({ slide }) {
  const isEnd = slide.id === "end";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
      <FadeIn delay={200}>
        <div style={{ fontSize: 13, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: COLORS.accent, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
          {isEnd ? "Ready?" : "VS Code Tutorial"}
        </div>
      </FadeIn>
      <FadeIn delay={500}>
        <h1 style={{ fontSize: 52, fontWeight: 700, color: COLORS.text, margin: 0, lineHeight: 1.1, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          {slide.title}
        </h1>
      </FadeIn>
      <FadeIn delay={800}>
        <div style={{ fontSize: 28, color: COLORS.accent, marginTop: 8, fontWeight: 300 }}>
          {slide.subtitle}
        </div>
      </FadeIn>
      <FadeIn delay={1100}>
        <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 32, maxWidth: 500, lineHeight: 1.6, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
          {slide.detail}
        </div>
      </FadeIn>
      <FadeIn delay={1400}>
        <div style={{ display: "flex", gap: 8, marginTop: 40 }}>
          {["copilot", "vscode", "agent"].map((tag) => (
            <span key={tag} style={{ padding: "4px 12px", borderRadius: 12, fontSize: 11, background: COLORS.accentGlow, color: COLORS.accent, border: `1px solid ${COLORS.border}` }}>
              #{tag}
            </span>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}

function ConceptSlide({ slide }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "40px 48px" }}>
      <FadeIn delay={200}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{slide.icon}</div>
      </FadeIn>
      <FadeIn delay={400}>
        <h2 style={{ fontSize: 32, color: COLORS.text, margin: "0 0 28px 0", fontWeight: 600 }}>{slide.title}</h2>
      </FadeIn>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {slide.points.map((point, i) => (
          <FadeIn key={i} delay={600 + i * 250}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: COLORS.accent, marginTop: 8, flexShrink: 0 }} />
              <span style={{ fontSize: 17, color: COLORS.text, lineHeight: 1.5 }}>{point}</span>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={600 + slide.points.length * 250 + 200}>
        <div style={{ marginTop: 32, padding: "12px 16px", borderRadius: 8, background: COLORS.accentGlow, border: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          💡 {slide.note}
        </div>
      </FadeIn>
    </div>
  );
}

function StepSlide({ slide }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "40px 48px" }}>
      <FadeIn delay={100}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: COLORS.bg }}>
            {slide.stepNum}
          </div>
          <h2 style={{ fontSize: 28, color: COLORS.text, margin: 0, fontWeight: 600 }}>{slide.title}</h2>
        </div>
      </FadeIn>
      <FadeIn delay={300}>
        <p style={{ fontSize: 15, color: COLORS.textMuted, margin: "0 0 20px 0", lineHeight: 1.5 }}>{slide.description}</p>
      </FadeIn>
      <FadeIn delay={500}>
        <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bg }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: COLORS.red, opacity: 0.8 }} />
            <div style={{ width: 10, height: 10, borderRadius: 5, background: COLORS.orange, opacity: 0.8 }} />
            <div style={{ width: 10, height: 10, borderRadius: 5, background: COLORS.green, opacity: 0.8 }} />
            <span style={{ marginLeft: 8, fontSize: 11, color: COLORS.textDim }}>SKILL.md</span>
          </div>
          <pre style={{ margin: 0, padding: 20, fontSize: 12.5, lineHeight: 1.7, color: COLORS.text, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", overflowX: "auto", whiteSpace: "pre-wrap" }}>
            {slide.code}
          </pre>
        </div>
      </FadeIn>
      {slide.tip && (
        <FadeIn delay={800}>
          <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 8, borderLeft: `3px solid ${COLORS.green}`, background: COLORS.greenGlow, fontSize: 13, color: COLORS.textMuted }}>
            ✅ {slide.tip}
          </div>
        </FadeIn>
      )}
    </div>
  );
}

function FolderSlide({ slide }) {
  const iconMap = { root: "📂", folder: "📁", skill: "🧩", file: "📄", resource: "📎" };
  const colorMap = { root: COLORS.text, folder: COLORS.folderYellow, skill: COLORS.skillGreen, file: COLORS.fileBlue, resource: COLORS.purple };

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "40px 48px" }}>
      <FadeIn delay={100}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: COLORS.bg }}>
            {slide.stepNum}
          </div>
          <h2 style={{ fontSize: 28, color: COLORS.text, margin: 0, fontWeight: 600 }}>{slide.title}</h2>
        </div>
      </FadeIn>
      <FadeIn delay={300}>
        <p style={{ fontSize: 15, color: COLORS.textMuted, margin: "0 0 20px 0" }}>{slide.description}</p>
      </FadeIn>
      <FadeIn delay={450}>
        <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "20px 24px" }}>
          {slide.tree.map((item, i) => (
            <FadeIn key={i} delay={550 + i * 120}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: item.indent * 22, paddingTop: 5, paddingBottom: 5 }}>
                <span style={{ fontSize: 14 }}>{iconMap[item.type]}</span>
                <span style={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace", color: colorMap[item.type], fontWeight: item.type === "file" ? 600 : 400 }}>
                  {item.name}
                </span>
                {item.type === "file" && (
                  <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: COLORS.accentGlow, color: COLORS.accent, marginLeft: 4 }}>required</span>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={550 + slide.tree.length * 120 + 100}>
        <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 8, borderLeft: `3px solid ${COLORS.green}`, background: COLORS.greenGlow, fontSize: 13, color: COLORS.textMuted }}>
          ✅ {slide.tip}
        </div>
      </FadeIn>
    </div>
  );
}

function CodeSlide({ slide }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "32px 44px" }}>
      <FadeIn delay={100}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: COLORS.bg }}>
            {slide.stepNum}
          </div>
          <h2 style={{ fontSize: 26, color: COLORS.text, margin: 0, fontWeight: 600 }}>{slide.title}</h2>
        </div>
      </FadeIn>
      <FadeIn delay={250}>
        <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "0 0 14px 0" }}>{slide.description}</p>
      </FadeIn>
      <FadeIn delay={400}>
        <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bg }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: COLORS.red, opacity: 0.8 }} />
            <div style={{ width: 10, height: 10, borderRadius: 5, background: COLORS.orange, opacity: 0.8 }} />
            <div style={{ width: 10, height: 10, borderRadius: 5, background: COLORS.green, opacity: 0.8 }} />
            <span style={{ marginLeft: 8, fontSize: 11, color: COLORS.textDim }}>SKILL.md</span>
          </div>
          <pre style={{ margin: 0, padding: 16, fontSize: 11.5, lineHeight: 1.65, color: COLORS.text, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", overflowX: "auto", whiteSpace: "pre-wrap" }}>
            {slide.code}
          </pre>
        </div>
      </FadeIn>
      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        {slide.highlights.map((h, i) => (
          <FadeIn key={i} delay={700 + i * 200}>
            <div style={{ padding: "8px 14px", borderRadius: 8, background: COLORS.surfaceLight, border: `1px solid ${COLORS.border}`, flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 12, color: COLORS.accent, fontWeight: 600, fontFamily: "monospace", marginBottom: 3 }}>{h.label}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.4 }}>{h.desc}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

function FlowSlide({ slide }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "36px 48px" }}>
      <FadeIn delay={200}>
        <h2 style={{ fontSize: 28, color: COLORS.text, margin: "0 0 6px 0", fontWeight: 600 }}>{slide.title}</h2>
        <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "0 0 28px 0" }}>{slide.subtitle}</p>
      </FadeIn>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {slide.stages.map((stage, i) => (
          <FadeIn key={i} delay={500 + i * 400}>
            <div style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: i === 0 ? COLORS.accent : i === 1 ? COLORS.green : COLORS.purple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {stage.icon}
                </div>
                {i < slide.stages.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: COLORS.border, marginTop: 4 }} />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: 8 }}>
                <div style={{ fontSize: 17, color: COLORS.text, fontWeight: 600, marginBottom: 4 }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 6 }}>{stage.desc}</div>
                <div style={{ fontSize: 12, color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", padding: "6px 10px", background: COLORS.accentGlow, borderRadius: 6, display: "inline-block" }}>
                  {stage.detail}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={500 + slide.stages.length * 400 + 200}>
        <div style={{ marginTop: 20, padding: "10px 14px", borderRadius: 8, background: COLORS.greenGlow, borderLeft: `3px solid ${COLORS.green}`, fontSize: 12, color: COLORS.textMuted }}>
          💡 {slide.note}
        </div>
      </FadeIn>
    </div>
  );
}

function DemoSlide({ slide }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "40px 48px" }}>
      <FadeIn delay={100}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: COLORS.bg }}>
            {slide.stepNum}
          </div>
          <h2 style={{ fontSize: 28, color: COLORS.text, margin: 0, fontWeight: 600 }}>{slide.title}</h2>
        </div>
      </FadeIn>
      <FadeIn delay={250}>
        <p style={{ fontSize: 15, color: COLORS.textMuted, margin: "0 0 24px 0" }}>{slide.description}</p>
      </FadeIn>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {slide.methods.map((m, i) => (
          <FadeIn key={i} delay={450 + i * 350}>
            <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 18, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: i === 0 ? COLORS.accent : i === 1 ? COLORS.green : COLORS.purple, borderRadius: "10px 0 0 10px" }} />
              <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 600, marginBottom: 8, paddingLeft: 8 }}>{m.label}</div>
              <div style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: COLORS.accent, background: COLORS.bg, padding: "8px 12px", borderRadius: 6, marginBottom: 8, marginLeft: 8 }}>
                {m.example}
              </div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, paddingLeft: 8 }}>→ {m.result}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

function SlideRenderer({ slide }) {
  const key = slide.id;
  switch (slide.type) {
    case "title": return <TitleSlide key={key} slide={slide} />;
    case "concept": return <ConceptSlide key={key} slide={slide} />;
    case "step": return <StepSlide key={key} slide={slide} />;
    case "folder": return <FolderSlide key={key} slide={slide} />;
    case "code": return <CodeSlide key={key} slide={slide} />;
    case "flow": return <FlowSlide key={key} slide={slide} />;
    case "demo": return <DemoSlide key={key} slide={slide} />;
    default: return null;
  }
}

export default function AgentSkills() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const timerRef = useRef(null);

  const go = (idx) => {
    setCurrent(idx);
    setSlideKey((k) => k + 1);
  };

  const next = () => {
    setCurrent((c) => {
      if (c < SLIDES.length - 1) {
        setSlideKey((k) => k + 1);
        return c + 1;
      }
      setIsPlaying(false);
      return c;
    });
  };

  const prev = () => {
    setCurrent((c) => {
      if (c > 0) {
        setSlideKey((k) => k + 1);
        return c - 1;
      }
      return c;
    });
  };

  useEffect(() => {
    if (isPlaying) {
      const delay = current === 0 || current === SLIDES.length - 1 ? 5000 : 8000;
      timerRef.current = setTimeout(next, delay);
    }
    return () => clearTimeout(timerRef.current);
  }, [current, isPlaying]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") { e.preventDefault(); setIsPlaying((p) => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }
      `}</style>

      {/* Subtle grid background */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${COLORS.border} 1px, transparent 1px)`, backgroundSize: "32px 32px", opacity: 0.3, pointerEvents: "none" }} />

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: `1px solid ${COLORS.border}`, zIndex: 10, background: COLORS.bg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textMuted, letterSpacing: 1 }}>COPILOT SKILLS GUIDE</span>
        </div>
        <div style={{ fontSize: 12, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace" }}>
          {current + 1} / {SLIDES.length}
        </div>
      </div>

      {/* Slide content */}
      <div key={slideKey} style={{ flex: 1, overflow: "auto", position: "relative", zIndex: 5 }}>
        <SlideRenderer slide={SLIDES[current]} />
      </div>

      {/* Bottom controls */}
      <div style={{ padding: "12px 24px 16px", borderTop: `1px solid ${COLORS.border}`, zIndex: 10, background: COLORS.bg }}>
        <ProgressBar current={current} total={SLIDES.length} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 12 }}>
          <button onClick={prev} disabled={current === 0} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: current === 0 ? COLORS.textDim : COLORS.text, cursor: current === 0 ? "default" : "pointer", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
            ← Prev
          </button>
          <button onClick={() => setIsPlaying((p) => !p)} style={{ padding: "8px 24px", borderRadius: 8, border: `1px solid ${COLORS.accent}`, background: isPlaying ? COLORS.accent : "transparent", color: isPlaying ? COLORS.bg : COLORS.accent, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={next} disabled={current === SLIDES.length - 1} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: current === SLIDES.length - 1 ? COLORS.textDim : COLORS.text, cursor: current === SLIDES.length - 1 ? "default" : "pointer", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
            Next →
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace" }}>
          Arrow keys to navigate · Space to play/pause
        </div>
      </div>
    </div>
  );
}
