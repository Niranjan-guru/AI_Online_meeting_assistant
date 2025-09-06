'use client';

import { useRef, type ChangeEvent } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface TranscriptionInputProps {
  transcription: string;
  onTranscriptionChange: (value: string) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function TranscriptionInput({
  transcription,
  onTranscriptionChange,
  onFileChange,
  onGenerate,
  isLoading,
  disabled,
}: TranscriptionInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className='grid gap-1'>
          <CardTitle>Transcription</CardTitle>
          <CardDescription>
            Paste your meeting transcript below or upload a .txt file.
          </CardDescription>
          </div>
           <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            className="hidden"
            accept=".txt"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="gap-1"
          >
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={transcription}
          onChange={(e) => onTranscriptionChange(e.target.value)}
          placeholder={
            disabled
              ? 'Select a meeting group to enable transcription input.'
              : 'Paste your meeting transcription here...'
          }
          className="h-48 min-h-48"
          disabled={disabled}
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={onGenerate}
          disabled={isLoading || !transcription.trim() || disabled}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isLoading ? 'Generating...' : 'Generate MoM'}
        </Button>
      </CardFooter>
    </Card>
  );
}
