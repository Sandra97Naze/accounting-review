import CyclePage from '@/components/CyclePage';

export default function CycleDetailPage({ 
  params 
}: { 
  params: { cycleName: string } 
}) {
  // Décode le nom du cycle (remplace les tirets par des espaces)
  const cycleName = decodeURIComponent(params.cycleName)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return <CyclePage cycleName={cycleName} />;
}
