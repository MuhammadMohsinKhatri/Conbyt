const steps = [
  { title: "Discovery", desc: "We analyze your needs and define the best AI/ML approach." },
  { title: "Strategy", desc: "We design a roadmap from idea to MVP, tailored to your goals." },
  { title: "Development", desc: "Our engineers build, test, and iterate your solution rapidly." },
  { title: "Launch & Scale", desc: "We deploy, monitor, and help you scale your AI product." },
];

const WorkProcedure = () => (
  <section className="py-20" id="procedure">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-10 text-accent">How We Work</h2>
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="bg-surface rounded-xl shadow p-8 text-center">
            <div className="text-4xl font-bold text-accent mb-2">{i + 1}</div>
            <h3 className="text-xl font-semibold mb-2 text-text">{step.title}</h3>
            <p className="text-text">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WorkProcedure;