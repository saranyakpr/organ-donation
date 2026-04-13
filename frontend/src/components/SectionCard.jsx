const SectionCard = ({ title, eyebrow, action, children, className = '' }) => (
  <section className={`glass-panel rounded-[2rem] p-6 sm:p-7 ${className}`}>
    <div className='mb-5 flex flex-wrap items-start justify-between gap-3'>
      <div>
        {eyebrow ? (
          <p className='mb-2 text-xs font-bold uppercase tracking-[0.3em] text-stone-500'>{eyebrow}</p>
        ) : null}
        <h2 className='section-title text-2xl font-extrabold text-stone-900'>{title}</h2>
      </div>
      {action}
    </div>
    {children}
  </section>
)

export default SectionCard
