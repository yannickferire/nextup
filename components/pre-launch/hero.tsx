"use client";

import { useId, useState, useActionState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoWindow } from "./demo";
import { joinWaitlist, getEarlySpotsRemaining } from "@/app/actions/waitlist";

export function Hero() {
  const id = useId();
  const [enhanced, setEnhanced] = useState(false);
  const [hasTransitioned, setHasTransitioned] = useState(false);
  const [spotsRemaining, setSpotsRemaining] = useState<number | null>(null);
  const [state, formAction, isPending] = useActionState(
    async (_prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await joinWaitlist(formData);
      if (result.success) {
        setSpotsRemaining((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
      }
      return result;
    },
    null
  );

  useEffect(() => {
    getEarlySpotsRemaining().then(setSpotsRemaining);
  }, []);

  const handleApply = () => {
    setHasTransitioned(true);
    setEnhanced(true);
  };

  // Only animate with delays if we're transitioning to enhanced (not on initial load)
  const shouldAnimate = hasTransitioned;

  return (
    <section className="flex-1 mx-4 md:mx-8 md:border-l md:border-r border-border flex items-center overflow-y-auto">
      <div className="w-full flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-12 py-8 lg:py-0 lg:ml-8 lg:pl-8">
        {/* Left side - Content */}
        <article className="lg:-mt-8 max-w-lg flex flex-col gap-4 md:gap-6 px-4 lg:px-0 text-center lg:text-left">
          {/* Early bird badge - only visible when enhanced */}
          {enhanced && (
          <div className="h-8 flex justify-center lg:justify-start">
            <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <span className="inline-flex items-center gap-2 text-xs md:text-sm border border-primary/30 bg-primary/5 rounded-full px-3 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>
                      <span className="font-medium">
                        {spotsRemaining !== null ? spotsRemaining : "..."} early spots left
                      </span>
                      <span className="opacity-70 hidden sm:inline">
                        {" "}
                        — get a special offer at launch
                      </span>
                    </span>
                  </span>
                </motion.div>
            </AnimatePresence>
          </div>
          )}
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl tracking-wide text-balance"
            style={{ opacity: enhanced ? 1 : 0.8 }}
            initial={false}
            animate={{ opacity: enhanced ? 1 : 0.8 }}
            transition={{ duration: 0.4, delay: shouldAnimate && enhanced ? 0.1 : 0 }}
          >
            Your next move is no longer a question. It&apos;s a priority.
          </motion.h1>

          <motion.div
            className="text-base md:text-lg tracking-wide"
            style={{ opacity: enhanced ? 0.8 : 0.5 }}
            initial={false}
            animate={{ opacity: enhanced ? 0.8 : 0.5 }}
            transition={{ duration: 0.4, delay: shouldAnimate && enhanced ? 0.2 : 0 }}
          >
            <p>
              Nextup analyzes your real growth data to forge the features your
              users are actually searching for.
            </p>
            <p className="text-sm mt-2 opacity-70 hidden sm:block">
              Get feature suggestions + prompts to vibe code in your favorite
              IDE.
            </p>
          </motion.div>

          <form action={formAction} className="w-full max-w-sm mx-auto lg:mx-0">
            <Label htmlFor={id} className="sr-only">
              Email address
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              {!state?.success && (
                <div className="flex-1">
                  <Input
                    id={id}
                    name="email"
                    type="email"
                    required
                    disabled={isPending}
                    placeholder={
                      enhanced ? "you@email.com" : "Enter your email address"
                    }
                    className={`h-12 transition-all duration-500 ${
                      enhanced
                        ? "border-white/50 text-white placeholder:text-white/70"
                        : ""
                    }`}
                    style={{
                      transitionDelay: shouldAnimate && enhanced ? "300ms" : "0ms",
                    }}
                  />
                </div>
              )}

              <motion.div
                initial={false}
                style={{
                  background: enhanced
                    ? "linear-gradient(to right, #8b2c0d, #6b2008)"
                    : "rgb(255, 255, 255)",
                }}
                animate={{
                  background: enhanced
                    ? "linear-gradient(to right, #8b2c0d, #6b2008)"
                    : "rgb(255, 255, 255)",
                }}
                transition={{ duration: 0.4, delay: shouldAnimate && enhanced ? 0.4 : 0 }}
                className="rounded-md"
              >
                <Button
                  type={state?.success ? "button" : "submit"}
                  disabled={isPending}
                  className={`h-12 px-6 ring-offset-background transition-all duration-500 text-base font-semibold ${
                    enhanced
                      ? "bg-transparent text-white hover:ring-2 hover:ring-primary/90 hover:ring-offset-2"
                      : "bg-transparent text-black hover:bg-white/90"
                  } ${state?.success ? "cursor-default" : ""}`}
                  style={{
                    transitionDelay: shouldAnimate && enhanced ? "400ms" : "0ms",
                  }}
                >
                  {enhanced && !state?.success && (
                    <motion.svg
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </motion.svg>
                  )}
                  {state?.success ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      You&apos;re in!
                    </span>
                  ) : isPending ? (
                    <span>Joining...</span>
                  ) : (
                    <motion.span
                      initial={false}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {enhanced ? "Join waitlist" : "Subscribe"}
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            </div>
            {state?.error && (
              <p className="text-red-400 text-sm mt-2">{state.error}</p>
            )}
          </form>
        </article>

        {/* Right side - Demo */}
        <div className="shrink-0 w-full lg:w-auto px-4 lg:px-0">
          <DemoWindow
            enhanced={enhanced}
            onApply={handleApply}
          />
        </div>
      </div>
    </section>
  );
}
