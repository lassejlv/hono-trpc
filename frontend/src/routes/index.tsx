import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { client } from '@/main';
import { toast } from 'sonner';
import Spinner from '@/components/Spinner';
import { Copy } from 'lucide-react';

function Index() {
  const newTheme = useMutation({
    mutationKey: ['newTheme'],
    mutationFn: async (prompt: string) => {
      return await client.theme.newTheme.mutate({ prompt });
    },
    onSuccess: (data) => {
      toast.success('Theme generated!');
      console.log(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prompt = formData.get('prompt') as string;
    newTheme.mutate(prompt);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="my-3">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea name="prompt" id="prompt" placeholder="dracula theme please" />
        </div>
        <Button type="submit" disabled={newTheme.isPending}>
          {newTheme.isPending ? (
            <>
              <Spinner size={15} /> Generating...
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </form>

      {newTheme.data && (
        <>
          <h2>Generated Theme</h2>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(newTheme.data);
              toast.success('Copied to clipboard!');
            }}
          >
            <Copy size={16} />
            Copy
          </Button>
          <pre>{JSON.stringify(newTheme.data, null, 2)}</pre>
        </>
      )}
    </>
  );
}

export default Index;
