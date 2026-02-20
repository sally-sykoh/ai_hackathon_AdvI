/**
 * AiCompanion — AdvI's geometric AI character
 *
 * Flat shapes only. No gradients, no pupils, no realism.
 * Expressiveness comes from shape-switching + squish/jiggle animations.
 *
 * state : 'idle' | 'thinking' | 'typing'
 * size  : 'sm' (32px) | 'md' (40px) | 'lg' (56px)
 *
 * Idle    →  ● ● + smile   — body gently squishes/breathes, eyes blink
 * Thinking → ✕ ✕ + little O  — body bobs, spinning dashed ring + orbiting dots
 * Typing   →  — — + speak   — body jiggles left-right, eyes squint, mouth bounces
 */

const SIZES = { sm: 32, md: 40, lg: 56 };

export default function AiCompanion({ state = "idle", size = "md", className = "" }) {
  const px    = SIZES[size] ?? SIZES.md;
  const idle  = state === "idle";
  const think = state === "thinking";
  const type  = state === "typing";

  const wrapAnim = idle  ? "companion-squish 3.2s ease-in-out infinite"
                 : think ? "companion-think-bob 0.85s ease-in-out infinite"
                 : "companion-type-jiggle 0.35s ease-in-out infinite";

  const glowAnim = think ? "companion-glow-think 0.7s ease-in-out infinite"
                 : type  ? "companion-glow-type 0.45s ease-in-out infinite"
                 : "companion-glow-idle 3.2s ease-in-out infinite";

  return (
    <div
      className={`companion-root inline-block flex-shrink-0 ${className}`}
      style={{ width: px, height: px, animation: wrapAnim }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 60 60"
        width={px}
        height={px}
        overflow="visible"
        style={{ display: "block" }}
      >
        {/* ── Outer glow ring ─────────────────────────────────────────── */}
        <circle
          cx="30" cy="30" r="29.5"
          fill="none" stroke="#ffcb05" strokeWidth="1.8"
          style={{ animation: glowAnim }}
        />

        {/* ── Face — flat circle, no gradient ─────────────────────────── */}
        <circle cx="30" cy="30" r="26" fill="#003f87" />

        {/* ── THINKING: spinning dashed orbit ring ────────────────────── */}
        {think && (
          <circle
            cx="30" cy="30" r="29.5"
            fill="none" stroke="#ffcb05"
            strokeWidth="2.4" strokeDasharray="10 6"
            strokeLinecap="round" opacity="0.85"
          >
            <animateTransform
              attributeName="transform" type="rotate"
              from="0 30 30" to="360 30 30"
              dur="1.8s" repeatCount="indefinite"
            />
          </circle>
        )}

        {/* ── THINKING: three orbiting dots ───────────────────────────── */}
        {think && [
          { deg: 0,   r: 3.2, op: 0.95 },
          { deg: 120, r: 2.2, op: 0.55 },
          { deg: 240, r: 1.5, op: 0.28 },
        ].map(({ deg, r, op }) => (
          <circle key={deg} cx="30" cy="-1" r={r} fill="#ffcb05" opacity={op}>
            <animateTransform
              attributeName="transform" type="rotate"
              from={`${deg} 30 30`} to={`${deg + 360} 30 30`}
              dur="1.55s" repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* ══ EYES ════════════════════════════════════════════════════════ */}

        {/* IDLE — big round dots, blink */}
        {idle && (
          <>
            <ellipse cx="19" cy="27" rx="5" ry="5" fill="#ffcb05">
              <animate
                attributeName="ry"
                values="5;5;0.5;5;5"
                keyTimes="0;0.83;0.88;0.93;1"
                dur="5.5s" begin="1.4s" repeatCount="indefinite"
              />
            </ellipse>
            <ellipse cx="41" cy="27" rx="5" ry="5" fill="#ffcb05">
              <animate
                attributeName="ry"
                values="5;5;0.5;5;5"
                keyTimes="0;0.83;0.88;0.93;1"
                dur="5.5s" begin="1.45s" repeatCount="indefinite"
              />
            </ellipse>
          </>
        )}

        {/* THINKING — ✕ ✕  (goofy/processing look) */}
        {think && (
          <>
            {/* Left X */}
            <line x1="14" y1="22" x2="24" y2="32" stroke="#ffcb05" strokeWidth="3" strokeLinecap="round" />
            <line x1="24" y1="22" x2="14" y2="32" stroke="#ffcb05" strokeWidth="3" strokeLinecap="round" />
            {/* Right X */}
            <line x1="36" y1="22" x2="46" y2="32" stroke="#ffcb05" strokeWidth="3" strokeLinecap="round" />
            <line x1="46" y1="22" x2="36" y2="32" stroke="#ffcb05" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {/* TYPING — squinted dash eyes */}
        {type && (
          <>
            <ellipse cx="19" cy="27" rx="5" fill="#ffcb05">
              <animate
                attributeName="ry"
                values="5;1.5;5"
                keyTimes="0;0.5;1"
                dur="0.55s" repeatCount="indefinite"
              />
            </ellipse>
            <ellipse cx="41" cy="27" rx="5" fill="#ffcb05">
              <animate
                attributeName="ry"
                values="5;1.5;5"
                keyTimes="0;0.5;1"
                dur="0.55s" begin="0.05s" repeatCount="indefinite"
              />
            </ellipse>
          </>
        )}

        {/* ══ MOUTH ═══════════════════════════════════════════════════════ */}

        {/* IDLE — wide smile */}
        {idle && (
          <path
            d="M 19 39 Q 30 47 41 39"
            fill="none" stroke="#ffcb05" strokeWidth="3" strokeLinecap="round"
          />
        )}

        {/* THINKING — small surprised O */}
        {think && (
          <ellipse cx="30" cy="40" rx="4.5" ry="3.5" fill="#ffcb05" opacity="0.9" />
        )}

        {/* TYPING — mouth bounces open ↔ nearly-closed */}
        {type && (
          <path fill="none" stroke="#ffcb05" strokeWidth="3" strokeLinecap="round">
            <animate
              attributeName="d"
              values="M 21 39 Q 30 46 39 39; M 21 39 Q 30 41.5 39 39; M 21 39 Q 30 46 39 39"
              dur="0.38s"
              repeatCount="indefinite"
            />
          </path>
        )}
      </svg>
    </div>
  );
}
