function SocialIcon({ platform, size = 24, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {platform === "instagram" && <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
      </>}
      {platform === "facebook" && (
        <path fill="currentColor" stroke="none" d="M14 22v-9h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.5c-.7-.1-1.9-.3-3-.3-3 0-5 1.8-5 5V9H7v4h3v9z" />
      )}
      {platform === "youtube" && <>
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="m10 9 6 3-6 3z" fill="currentColor" stroke="none" />
      </>}
    </svg>
  );
}

export default SocialIcon;
