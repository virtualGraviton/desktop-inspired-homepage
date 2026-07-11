export default function TitleBar() {
  return (
    <div
      className="flex items-center shrink-0 px-5 gap-2 select-none"
      style={{ height: 44, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: 12, height: 12, background: '#ff5f57' }}
        title="Close"
      />
      <span
        className="inline-block rounded-full"
        style={{ width: 12, height: 12, background: '#febc2e' }}
        title="Minimize"
      />
      <span
        className="inline-block rounded-full"
        style={{ width: 12, height: 12, background: '#28c840' }}
        title="Maximize"
      />

      <div className="flex-1 text-center text-white/40 text-sm font-medium">
        fenglai@homepage ~
      </div>
    </div>
  )
}
