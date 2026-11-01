export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFF4DD] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🥚</div>
        <div className="w-12 h-12 border-4 border-[#063D20] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[#063D20] font-bold">Loading...</p>
      </div>
    </div>
  );
}
