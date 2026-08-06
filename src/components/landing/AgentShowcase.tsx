import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { agents } from '@/lib/dummyData';
import { SectionHeading } from './Features';

const statusTone: Record<string, string> = {
  Completed: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
  Executing: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',
  Thinking: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',
  Idle: 'text-slate-500 bg-slate-100 dark:bg-white/5',
};

export function AgentShowcase() {
  return (
    <section id="agents" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionHeading
        eyebrow="Agentic AI"
        title="A swarm of specialist agents, orchestrated for you"
        subtitle="Each agent has a focused mandate — together they form an autonomous clinical operations layer."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((a, i) => {
          const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[a.icon] ?? Icons.Bot;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusTone[a.status]}`}>{a.status}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">{a.name}</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">{a.type}</p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{a.description}</p>
              {a.status !== 'Idle' && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{a.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${a.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
