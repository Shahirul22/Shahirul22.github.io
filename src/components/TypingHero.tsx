import { useEffect, useState } from 'react';

const PHRASES = [
  'Laravel backend developer',
  'Builder of scalable APIs',
  'Database query whisperer',
  'AI-assisted dev workflows',
  'Penang, Malaysia 🇲🇾',
];

export default function TypingHero() {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIdx];
    const atFull = !deleting && text === current;
    const atEmpty = deleting && text === '';

    let delay = deleting ? 35 : 75;
    if (atFull) delay = 1400;
    if (atEmpty) delay = 250;

    const t = setTimeout(() => {
      if (atFull) {
        setDeleting(true);
        return;
      }
      if (atEmpty) {
        setDeleting(false);
        setPhraseIdx((i) => (i + 1) % PHRASES.length);
        return;
      }
      const next = deleting
        ? current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1);
      setText(next);
    }, delay);

    return () => clearTimeout(t);
  }, [text, phraseIdx, deleting]);

  return (
    <span className="font-mono text-accent cursor">{text || ' '}</span>
  );
}
