export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-seal"><img src="/biit-logo.jpg" alt="BIIT university emblem" /></span>
      <span className="brand-copy">
        <strong>Campus<span>Connect</span></strong>
        <small>BIIT · A better campus, together</small>
      </span>
    </div>
  );
}
