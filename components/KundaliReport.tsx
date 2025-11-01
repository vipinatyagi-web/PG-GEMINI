type Props = { data:any };

const SectionCard = ({ title, children }: any) => (
  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
    <div className="text-lg font-bold">{title}</div>
    <div className="mt-2">{children}</div>
  </div>
);

export default function KundaliReport({ data }: Props){
  const d = data||{};
  const s = d.sections||{};
  const line = (k:string,v:any)=>(
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="text-brand-gray">{k}</div>
      <div className="font-semibold">{v||'—'}</div>
    </div>
  );

  return (
    <div className="space-y-4">
      <SectionCard title="Overview">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            {line("Naam", d?.meta?.name)}
            {line("DOB", d?.meta?.dob)}
            {line("TOB", d?.meta?.tob)}
            {line("Sthan", d?.meta?.location)}
            {line("Lat/Lon", `${d?.meta?.lat}, ${d?.meta?.lon}`)}
            {line("TZ (mins)", d?.meta?.tz_offset_minutes)}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            {line("Gender", d?.meta?.gender)}
            {line("Rel. Status", d?.meta?.relationshipStatus)}
            {line("Career Goal", d?.meta?.careerGoal)}
            {line("Concern", d?.meta?.topConcern)}
            {line("Question", d?.meta?.primary_question)}
          </div>
        </div>
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="inline-block rounded-full px-3 py-1 border border-brand-indigo text-xs bg-black/20">Seedhi Baat</div>
          <div className="mt-2">{d?.summary?.tone} — {d?.summary?.core_focus}</div>
          {d?.summary?.personalized_note && <p className="mt-2 text-brand-gray">{d.summary.personalized_note}</p>}
        </div>
      </SectionCard>

      <SectionCard title="Grah Prabhav (Overall)">
        <ul className="list-disc list-inside space-y-1 text-sm">
          {Object.entries(d.grah_prabhav||{}).map(([k,v]:any)=> <li key={k}><b className="capitalize">{k.replace('_','/')}:</b> {v}</li>)}
        </ul>
      </SectionCard>

      {/* Major Life Areas */}
      {["career","money","love","health","family","education","travel","spiritual"].map((key:string)=> {
        const sec:any = s[key]||{};
        return (
          <SectionCard key={key} title={sec.headline || key.toUpperCase()}>
            {sec.indicators?.length>0 && (
              <div className="mb-2 text-sm text-brand-gray">
                {sec.indicators.map((it:string,i:number)=><div key={i}>• {it}</div>)}
              </div>
            )}
            {sec.forensic && <p className="mt-1">{sec.forensic}</p>}
            {sec.pinpoint?.length>0 && (
              <div className="mt-2">
                <div className="text-brand-gray text-sm mb-1">Exact Windows</div>
                <ul className="list-disc list-inside">
                  {sec.pinpoint.map((p:string,i:number)=><li key={i}>{p}</li>)}
                </ul>
              </div>
            )}
            {sec.actions && (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div className="rounded-lg border border-white/10 bg-white/5 p-2"><b>Aaj:</b> {sec.actions.today||'—'}</div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-2"><b>7 din:</b> {sec.actions.seven_days||'—'}</div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-2"><b>90 din:</b> {sec.actions.ninety_days||'—'}</div>
              </div>
            )}
            {sec.confidence && <div className="text-xs mt-1 text-brand-gray">Confidence: {sec.confidence}</div>}
          </SectionCard>
        );
      })}

      <SectionCard title="Timeline (Next 90 days)">
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          {Array.isArray(d.timeline) && d.timeline.map((w:any,i:number)=>(
            <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-2">
              <div className="font-semibold">{w.label}</div>
              <div className="text-brand-gray">{w.from} → {w.to}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-3">
        <SectionCard title="Upaay">
          <ul className="list-disc list-inside">
            {(d.remedies||[]).map((r:any,i:number)=><li key={i}><b>{r.name}:</b> {r.reason} — <i>{r.when}</i></li>)}
          </ul>
        </SectionCard>
        <SectionCard title="Lucky & Do/Don't">
          <div className="text-sm">
            <div><b>Lucky Number:</b> {(d.lucky?.number||[]).join(', ')||'—'}</div>
            <div><b>Lucky Color:</b> {(d.lucky?.color||[]).join(', ')||'—'}</div>
            <div><b>Lucky Day:</b> {(d.lucky?.day||[]).join(', ')||'—'}</div>
            <div className="mt-2"><b>Do:</b> {(d.do_dont?.do||[]).join('; ')||'—'}</div>
            <div><b>Don't:</b> {(d.do_dont?.dont||[]).join('; ')||'—'}</div>
            <div className="text-xs text-brand-gray mt-1">{d.lucky?.stone_note}</div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Action Plan">
        <div className="grid md:grid-cols-3 gap-2 text-sm">
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
            <div className="font-semibold">Aaj</div>
            <ul className="list-disc list-inside">{(d.action_plan?.today||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
            <div className="font-semibold">7 Din</div>
            <ul className="list-disc list-inside">{(d.action_plan?.seven_days||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
            <div className="font-semibold">90 Din</div>
            <ul className="list-disc list-inside">{(d.action_plan?.ninety_days||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
