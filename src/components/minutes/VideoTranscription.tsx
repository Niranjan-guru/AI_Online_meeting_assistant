'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, Video, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { transcribeVideoAction } from '@/lib/actions';

interface VideoTranscriptionProps {
  disabled: boolean;
  onTranscriptionComplete: (transcript: string) => void;
  isTranscribing: boolean;
  setIsTranscribing: (isTranscribing: boolean) => void;
}

export default function VideoTranscription({
  disabled,
  onTranscriptionComplete,
  isTranscribing,
  setIsTranscribing,
}: VideoTranscriptionProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: 'Please select a video file smaller than 20MB.',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleTranscribe = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a video file to transcribe.',
      });
      return;
    }

    setIsTranscribing(true);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      const videoDataUri = reader.result as string;
      const result = await transcribeVideoAction({ videoDataUri });

      if ('transcript' in result) {
        onTranscriptionComplete(result.transcript);
        toast({
          title: 'Transcription Complete',
          description: 'The video has been successfully transcribed.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Transcription Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
      setIsTranscribing(false);
      setSelectedFile(null);
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "There was an error reading your video file.",
        });
        setIsTranscribing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Transcription</CardTitle>
        <CardDescription>
          Upload a video file to generate a transcription. (Max 20MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="video/*"
          disabled={disabled || isTranscribing}
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isTranscribing}
          className="w-full gap-2"
        >
          <Upload className="h-4 w-4" />
          {selectedFile ? 'Change Video' : 'Select Video'}
        </Button>

        {selectedFile && (
          <div className="flex items-center gap-3 rounded-md border p-3">
            <Video className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}

        {disabled && !isTranscribing && (
           <Alert>
             <AlertTitle>Group Required</AlertTitle>
             <AlertDescription>
                Please select or create a meeting group to enable video uploads.
             </AlertDescription>
           </Alert>
        )}

        <Button
          onClick={handleTranscribe}
          disabled={disabled || !selectedFile || isTranscribing}
          className="w-full"
        >
          {isTranscribing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Transcribing...
            </>
          ) : (
            'Transcribe Video'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
