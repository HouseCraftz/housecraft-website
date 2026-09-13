"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SOCIAL_TASKS, type SocialTaskId } from "@/config/social";
import { isValidWallet, isValidXUsername, normalizeXUsername } from "@/lib/validation";
import { ACCESS_PROGRESS_KEY, COMPLETED_HOME_KEY } from "@/lib/session";
import { BrandMark } from "./BrandMark";
import { BuildProgress } from "./BuildProgress";
import { PixelButton } from "./PixelButton";
import { PixelInput } from "./PixelInput";
import { TaskRow } from "./TaskRow";

type Step = 1 | 2 | 3 | 4;
type TaskState = Record<SocialTaskId, boolean>;

const initialTasks: TaskState = { follow: false, like: false, repost: false, comment: false };
export function AccessFlow() {
  const [step, setStep] = useState<Step>(1);
  const [username, setUsername] = useState("");
  const [confirmedUsername, setConfirmedUsername] = useState("");
  const [wallet, setWallet] = useState("");
  const [tasks, setTasks] = useState<TaskState>(initialTasks);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [completedHome, setCompletedHome] = useState(false);

  const completedCount = useMemo(() => Object.values(tasks).filter(Boolean).length, [tasks]);

  useEffect(() => {
    try {
      setCompletedHome(window.sessionStorage.getItem(COMPLETED_HOME_KEY) === "true");
      const saved = window.sessionStorage.getItem(ACCESS_PROGRESS_KEY);
      if (saved) {
        const progress = JSON.parse(saved) as Partial<{
          step: Step;
          username: string;
          confirmedUsername: string;
          wallet: string;
          tasks: TaskState;
          demoMode: boolean;
        }>;
        if ([1, 2, 3, 4].includes(progress.step ?? 0)) setStep(progress.step as Step);
        if (typeof progress.username === "string") setUsername(progress.username);
        if (typeof progress.confirmedUsername === "string") setConfirmedUsername(progress.confirmedUsername);
        if (typeof progress.wallet === "string") setWallet(progress.wallet);
        if (progress.tasks && Object.keys(initialTasks).every((key) => typeof progress.tasks?.[key as SocialTaskId] === "boolean")) {
          setTasks(progress.tasks);
        }
        if (typeof progress.demoMode === "boolean") setDemoMode(progress.demoMode);
      }
    } catch {
      window.sessionStorage.removeItem(ACCESS_PROGRESS_KEY);
    } finally {
      setSessionReady(true);
    }
  }, []);

  useEffect(() => {
    if (!sessionReady) return;
    window.sessionStorage.setItem(ACCESS_PROGRESS_KEY, JSON.stringify({ step, username, confirmedUsername, wallet, tasks, demoMode }));
  }, [step, username, confirmedUsername, wallet, tasks, demoMode, sessionReady]);

  function confirmUsername(event: FormEvent) {
    event.preventDefault();
    const normalized = normalizeXUsername(username);
    if (!isValidXUsername(normalized)) {
      setError("ENTER A VALID X USERNAME");
      return;
    }
    setConfirmedUsername(normalized);
    setUsername(normalized);
    setError("");
    setStep(2);
  }

  async function submitWallet(event: FormEvent) {
    event.preventDefault();
    if (!isValidWallet(wallet)) {
      setError("ENTER A VALID 0x EVM ADDRESS");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x_username: confirmedUsername,
          evm_wallet: wallet,
          follow_completed: tasks.follow,
          like_completed: tasks.like,
          repost_completed: tasks.repost,
          comment_completed: tasks.comment,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "SUBMISSION FAILED");
      window.sessionStorage.removeItem(COMPLETED_HOME_KEY);
      setCompletedHome(false);
      setDemoMode(Boolean(result.demo));
      setStep(4);
      window.sessionStorage.setItem(ACCESS_PROGRESS_KEY, JSON.stringify({
        step: 4,
        username,
        confirmedUsername,
        wallet,
        tasks,
        demoMode: Boolean(result.demo),
      }));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message.toUpperCase() : "SUBMISSION FAILED");
    } finally {
      setSubmitting(false);
    }
  }

  if (!sessionReady) {
    return (
      <main className="site-shell">
        <div className="background-gif" />
        <section className="access-panel session-loading" aria-label="Loading HouseCraft access">
          <header className="panel-header"><BrandMark /></header>
        </section>
      </main>
    );
  }

  if (completedHome) {
    return (
      <main className="site-shell">
        <div className="background-gif" />
        <section className="access-panel completed-home">
          <header className="panel-header"><BrandMark /><p>CONSTRUCTION COMPLETE</p></header>
          <div className="panel-body completion-home-body">
            <div className="success-build" aria-hidden="true"><span /><i /><b /></div>
            <p className="eyebrow">HOUSECRAFT ACCESS</p>
            <h1>YOU COMPLETED<br /><span>ALL THE TASKS.</span></h1>
          </div>
        </section>
        <footer><span>BUILT PIXEL BY PIXEL</span><span>HOUSECRAFT © 2026</span></footer>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <div className="background-gif" />
      <section className={`access-panel step-${step}`}>
        <header className="panel-header">
          <BrandMark />
          <div className="step-meter" aria-label={`Step ${step} of 4`}>
            {[1, 2, 3, 4].map((item) => <i key={item} className={item <= step ? "active" : ""} />)}
          </div>
          <p>{step === 4 ? "CONSTRUCTION COMPLETE" : `STEP 0${step} / 04`}</p>
        </header>

        {step === 1 && (
          <div className="panel-body intro-step">
            <p className="eyebrow">HOUSECRAFT ACCESS</p>
            <h1>BUILD YOUR<br /><span>ACCESS</span></h1>
            <p className="lede">BUILD YOUR ACCESS, ONE STEP AT A TIME.</p>
            <form onSubmit={confirmUsername}>
              <label htmlFor="x-username">X ACCOUNT</label>
              <PixelInput id="x-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@username" autoComplete="off" autoFocus />
              {error && <p className="form-error" role="alert">{error}</p>}
              <PixelButton type="submit">CONFIRM <span>→</span></PixelButton>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="panel-body social-step">
            <button className="inline-back" type="button" onClick={() => setStep(1)}>← BACK TO X ACCOUNT</button>
            <div className="section-heading">
              <div><p className="eyebrow">SOCIAL TASKS</p><h1>BUILD THE FRAME</h1></div>
              <span className="account-chip">@{confirmedUsername}</span>
            </div>
            <div className="task-list">
              {SOCIAL_TASKS.map((task) => (
                <TaskRow key={task.id} {...task} complete={tasks[task.id]} onComplete={() => setTasks((current) => ({ ...current, [task.id]: true }))} />
              ))}
            </div>
            <BuildProgress complete={completedCount} />
            <PixelButton disabled={completedCount !== 4} onClick={() => setStep(3)}>CONFIRM <span>→</span></PixelButton>
            <p className="fine-print">TASKS ARE SELF-CONFIRMED IN THIS VERSION.</p>
            <aside className="build-alert" role="note">
              <strong>BUILD IT RIGHT.</strong>
              <span>Complete every task properly. Entries may be reviewed before consideration. Fake or incomplete submissions will be disqualified.</span>
            </aside>
          </div>
        )}

        {step === 3 && (
          <div className="panel-body wallet-step">
            <button className="inline-back" type="button" onClick={() => setStep(2)}>← BACK TO SOCIAL TASKS</button>
            <p className="eyebrow">FINAL BUILD STEP</p>
            <h1>EVM WALLET</h1>
            <p className="lede">ADD THE ADDRESS FOR YOUR HOUSECRAFT ACCESS.</p>
            <div className="wood-sign">
              <i className="sign-nail sign-nail--left" /><i className="sign-nail sign-nail--right" />
              <span>@{confirmedUsername}</span>
            </div>
            <form onSubmit={submitWallet}>
              <label htmlFor="wallet">WALLET ADDRESS</label>
              <PixelInput id="wallet" value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="0x..." autoComplete="off" spellCheck={false} />
              {error && <p className="form-error" role="alert">{error}</p>}
              <PixelButton type="submit" disabled={submitting}>{submitting ? "BUILDING..." : "SUBMIT"} <span>→</span></PixelButton>
            </form>
            <p className="fine-print">NO WALLET CONNECTION REQUIRED.</p>
          </div>
        )}

        {step === 4 && (
          <div className="panel-body success-step">
            <button className="inline-back" type="button" onClick={() => setStep(3)}>← BACK TO WALLET</button>
            <div className="success-build" aria-hidden="true"><span /><i /><b /></div>
            <p className="eyebrow">CONSTRUCTION CONFIRMED</p>
            <h1>REGISTRATION <span>COMPLETE</span></h1>
            <p className="success-copy">YOUR HOUSECRAFT ACCESS REQUEST<br />HAS BEEN RECORDED SUCCESSFULLY.</p>
            <div className="warning-board">REGISTRATION DOES NOT GUARANTEE A MINT SPOT. ACCESS REMAINS SUBJECT TO AVAILABILITY AND PROJECT TERMS.</div>
            {demoMode && <p className="demo-note">LOCAL DEMO MODE — CONFIGURE SUPABASE BEFORE LAUNCH.</p>}
            <Link className="pixel-button" href="/collection">ENTER HOUSECRAFT <span>→</span></Link>
          </div>
        )}
      </section>
      <footer><span>BUILT PIXEL BY PIXEL</span><span>HOUSECRAFT © 2026</span></footer>
    </main>
  );
}
