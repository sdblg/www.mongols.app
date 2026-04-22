"use client";

import { motion } from "framer-motion";
import { ProtectedContactEmail } from "@/components/ProtectedContactEmail";
import { SecurityContactForm } from "@/components/SecurityContactForm";
import { Icon } from "@/components/Icon";
import { Lock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export function SecurityContactSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={stagger}
      className="mt-20 border-t border-white/[0.06] pt-16 md:mt-24 md:pt-20"
      aria-labelledby="security-contact-heading"
    >
      <motion.div variants={fadeUp} className="mb-10 max-w-2xl">
        <p className="mb-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-sky-400/80">
          <Icon icon={Lock} size={12} />
          security-first contact
        </p>
        <h2
          id="security-contact-heading"
          className="font-sans text-2xl font-semibold tracking-tight text-white md:text-3xl"
        >
          Encrypted channel
        </h2>
        <p className="mt-3 font-mono text-sm leading-relaxed text-lab-muted">
          Use the form for operational inquiries. The address below is shown in a
          protected format to reduce automated harvesting.
        </p>
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:items-start xl:gap-14">
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
            Routing
          </span>
          <ProtectedContactEmail />
          <p className="max-w-xs font-mono text-[10px] leading-relaxed text-white/25">
            No phone numbers or alternate inboxes are published here.
          </p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <SecurityContactForm />
        </motion.div>
      </div>
    </motion.section>
  );
}
