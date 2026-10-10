"use client";
import { useState } from "react";
import {
  Check,
  RotateCcw,
  ArrowDown,
  Fingerprint,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function BuildVisual() {
  return (
    <div
      className="build-visual"
      aria-label="Illustration connecting web interfaces, backend systems, and workflows"
    >
      <div className="visual-topline mono">
        <span>SOFTWARE, CONNECTED</span>
        <span>↗</span>
      </div>
      <div className="build-orbit" aria-hidden="true">
        <div className="orbit-center">
          <span>
            a<span className="orbit-dot">.</span>
          </span>
        </div>
        <div className="orbit-ring ring-one" />
        <div className="orbit-ring ring-two" />
      </div>
      <div className="build-layer layer-web">
        <span className="mono">01 / INTERFACE</span>
        <strong>Web.</strong>
        <span className="layer-code">&lt; / &gt;</span>
      </div>
      <div className="build-layer layer-api">
        <span className="mono">02 / SYSTEM</span>
        <strong>Backend.</strong>
        <GitBranch aria-hidden="true" size={28} />
      </div>
      <div className="build-layer layer-flow">
        <span className="mono">03 / CONNECTION</span>
        <strong>Automation.</strong>
        <div className="flow-dots" aria-hidden="true">
          <i />
          <b />
          <i />
          <b />
          <i />
        </div>
      </div>
      <div className="visual-bottomline mono">
        <span>INTERFACES → SYSTEMS → WORKFLOWS</span>
        <span>↓</span>
      </div>
    </div>
  );
}

export function PromiseVisual() {
  const [creator, setCreator] = useState(false);
  const [recipient, setRecipient] = useState(false);
  const complete = creator && recipient;
  return (
    <div className="promise-visual">
      <div className="visual-topline mono">
        <span>COMMITMENT FLOW</span>
        <Fingerprint size={18} aria-hidden="true" />
      </div>
      <div className="promise-flow">
        <div className="flow-node">
          <span className="node-number mono">01</span>
          <div>
            <strong>Make a commitment</strong>
            <span>Set the terms and schedule.</span>
          </div>
        </div>
        <div className="flow-connector" aria-hidden="true" />
        <div className="flow-node">
          <span className="node-number mono">02</span>
          <div>
            <strong>Keep a shared timeline</strong>
            <span>Record progress and changes.</span>
          </div>
        </div>
        <div className="flow-connector" aria-hidden="true" />
        <div className="confirmation-node">
          <div className="confirmation-heading">
            <span className="mono">03 / CONFIRM TOGETHER</span>
            <span
              className={`status-chip ${complete ? "complete" : ""}`}
              role="status"
            >
              {complete
                ? "Completed"
                : creator || recipient
                  ? "Awaiting confirmation"
                  : "Try the flow"}
            </span>
          </div>
          <div className="confirm-buttons">
            <Button
              type="button"
              variant="outline"
              aria-pressed={creator}
              onClick={() => setCreator(!creator)}
              className={creator ? "confirmed" : ""}
            >
              {creator && <Check size={16} />}Creator
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-pressed={recipient}
              onClick={() => setRecipient(!recipient)}
              className={recipient ? "confirmed" : ""}
            >
              {recipient && <Check size={16} />}Recipient
            </Button>
          </div>
          <p>Complete only when both participants confirm.</p>
        </div>
      </div>
      <div className="visual-bottomline mono">
        <span>INTERACTIVE FLOW ILLUSTRATION</span>
        <button
          type="button"
          onClick={() => {
            setCreator(false);
            setRecipient(false);
          }}
          aria-label="Reset commitment flow"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}

export function SimulationVisual() {
  return (
    <div className="simulation-visual">
      <div className="visual-topline mono">
        <span>FROM OBSERVATIONS TO CONTACTS</span>
        <span>↗</span>
      </div>
      <svg
        className="signal-diagram"
        viewBox="0 0 480 205"
        role="img"
        aria-label="Conceptual illustration of noisy observations becoming sustained contact sessions; not experimental data"
      >
        <defs>
          <pattern
            id="signal-grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity=".15"
            />
          </pattern>
        </defs>
        <rect x="0" y="0" width="480" height="205" fill="url(#signal-grid)" />
        <g stroke="currentColor" fill="none" strokeWidth="1.3" opacity=".65">
          <path d="M8 98 24 42 40 139 56 78 72 124 88 52 104 102 120 80 136 142 152 60 168 104 184 57 200 116 216 69 232 139 248 88 264 55 280 115 296 72 312 147 328 96 344 45 360 112 376 65 392 142 408 88 424 132 440 62 456 109 472 72" />
        </g>
        <path
          d="M8 111 C36 116 38 83 70 92 S100 79 129 100 S168 65 207 96 S263 108 286 95 S340 88 365 104 S429 95 472 96"
          fill="none"
          stroke="#b8c5ff"
          strokeWidth="3"
        />
        <g fill="#b8c5ff">
          <circle cx="70" cy="92" r="4" />
          <circle cx="207" cy="96" r="4" />
          <circle cx="365" cy="104" r="4" />
        </g>
        <text
          x="9"
          y="186"
          fill="currentColor"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="10"
        >
          NOISY OBSERVATIONS
        </text>
        <text
          x="345"
          y="186"
          fill="#b8c5ff"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="10"
        >
          PROCESSED SIGNAL
        </text>
      </svg>
      <div className="signal-pipeline mono">
        <span>OBSERVE</span>
        <ArrowDown size={14} aria-hidden="true" />
        <span>RECONSTRUCT</span>
        <ArrowDown size={14} aria-hidden="true" />
        <span>EVALUATE</span>
      </div>
      <div className="session-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="visual-bottomline mono">
        <span>CONCEPTUAL SCHEMATIC · SIMULATION ONLY</span>
        <span>↓</span>
      </div>
    </div>
  );
}
