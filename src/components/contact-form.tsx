"use client";
import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema } from "@/lib/contact-schema";

// Contact layout adapted from Tailark Mist Contact One (MIT).
export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    setFieldErrors({});
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues)
        errors[String(issue.path[0])] ??= issue.message;
      setFieldErrors(errors);
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(errors)[0]}"]`)
        ?.focus();
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        setError(
          result.error ||
            "Your message couldn’t be sent. Please email contact@ayyan.tech directly.",
        );
        if (result.fields) setFieldErrors(result.fields);
        return;
      }
      setSent(true);
      formRef.current?.reset();
    } catch {
      setError(
        "We couldn’t confirm delivery. Please email contact@ayyan.tech directly rather than sending the form again.",
      );
    } finally {
      setPending(false);
    }
  }

  if (sent)
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={38} />
        <h3>Your enquiry is on its way.</h3>
        <p>
          Thanks for sharing the details. A copy of your enquiry has been sent
          to my inbox.
        </p>
        <Button type="button" variant="outline" onClick={() => setSent(false)}>
          Send another enquiry
        </Button>
      </div>
    );

  return (
    <>
      <noscript>
        <style>{`.contact-form { display: none !important; }`}</style>
        <p>
          Please email{" "}
          <a href="mailto:contact@ayyan.tech">contact@ayyan.tech</a> to discuss
          your enquiry. The interactive form needs JavaScript.
        </p>
      </noscript>
      <form
        ref={formRef}
        onSubmit={submit}
        method="post"
        action="/api/contact"
        noValidate
        className="contact-form"
        aria-label="Send an enquiry"
      >
        <div className="form-topline">
          <span className="mono">A LITTLE ABOUT YOUR PROJECT</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </div>
        <div className="form-pair">
          <div className="field">
            <Label htmlFor="name">
              Your name <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              required
              maxLength={100}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
            />
            {fieldErrors.name && (
              <p id="name-error" className="field-error">
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div className="field">
            <Label htmlFor="email">
              Email address <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              maxLength={254}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className="field-error">
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>
        <div className="field">
          <Label htmlFor="enquiry">
            What brings you here? <span className="optional">Optional</span>
          </Label>
          <select id="enquiry" name="enquiry" defaultValue="">
            <option value="">Choose an enquiry type</option>
            <option>Client project</option>
            <option>Job opportunity</option>
            <option>Collaboration</option>
          </select>
        </div>
        <div className="field">
          <Label htmlFor="message">
            What do you have in mind? <span aria-hidden="true">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Tell me about the project, the problem, or the opportunity."
            required
            maxLength={5000}
            aria-invalid={!!fieldErrors.message}
            aria-describedby={
              fieldErrors.message ? "message-error" : "message-help"
            }
          />
          <p id="message-help" className="field-help">
            A few details are enough to start a conversation.
          </p>
          {fieldErrors.message && (
            <p id="message-error" className="field-error">
              {fieldErrors.message}
            </p>
          )}
        </div>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="form-submit">
          <Button type="submit" disabled={pending} className="button-primary">
            {pending ? (
              <>
                <LoaderCircle className="spin" size={18} />
                Sending…
              </>
            ) : (
              <>
                Send enquiry
                <ArrowUpRight size={18} />
              </>
            )}
          </Button>
          <p>Your details are used to reply to this enquiry.</p>
        </div>
      </form>
    </>
  );
}
