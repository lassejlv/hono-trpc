import { Loader } from 'lucide-react';

export default function Spinner({ size = 18 }: { size?: number }) {
  return <Loader size={size} className="animate-spin" />;
}
