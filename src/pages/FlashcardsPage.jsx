import SpacedRepetition from '../features/spaced-repetition/SpacedRepetition';

export default function FlashcardsPage() {
  return (
    <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh' }}>
      <SpacedRepetition />
    </div>
  );
}
