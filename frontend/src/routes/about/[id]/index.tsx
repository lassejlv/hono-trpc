import { useParams } from 'react-router-dom';

export default function AboutId() {
  const params = useParams<{ id: string }>();

  return <div>ABOUT ID - {params.id}</div>;
}
