'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Cross-browser compatibility for SpeechRecognition
const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

interface LiveTranscriptionProps {
  onTranscript: (transcript: string) => void;
  disabled: boolean;
  onGenerate: () => void;
  isLoading: boolean;
  transcription: string;
  setTranscription: (transcript: string) => void;
}

export default function LiveTranscription({
  onTranscript,
  disabled,
  onGenerate,
  isLoading,
  transcription,
  setTranscription,
}: LiveTranscriptionProps) {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(
    null
  );
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Browser Not Supported',
        description: 'Live transcription is not supported in this browser.',
      });
      setHasMicPermission(false);
      return;
    }

    const checkMicPermission = async () => {
      try {
        // Quietly check for permission without immediately starting the stream
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permissionStatus.state === 'granted') {
           setHasMicPermission(true);
        } else if (permissionStatus.state === 'prompt') {
            // Can't know for sure until we ask, but for UI purposes let's assume it's not denied yet.
            setHasMicPermission(null); 
        }
        else {
           setHasMicPermission(false);
        }
        permissionStatus.onchange = () => {
             setHasMicPermission(permissionStatus.state === 'granted');
        };
      } catch (error) {
        console.error('Error checking microphone permission:', error);
        setHasMicPermission(false);
      }
    };

    checkMicPermission();
  }, [toast]);
  
  const requestMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setHasMicPermission(true);
        return true;
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setHasMicPermission(false);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings.',
        });
        return false;
      }
  }

  const startListening = useCallback(async () => {
    if (isListening || !SpeechRecognition) return;

    let permissionGranted = hasMicPermission;
    if (permissionGranted === null) {
        permissionGranted = await requestMicPermission();
    }
    
    if (!permissionGranted) {
      if (hasMicPermission === false) { // only toast if we know it's denied
        toast({
            variant: 'destructive',
            title: 'Microphone Access Denied',
            description: 'Please enable microphone permissions in your browser settings.',
        });
      }
      return;
    }


    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Automatically restart recognition if it stops unexpectedly unless we manually stopped it
      if (recognitionRef.current) {
         recognition.start();
      }
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onTranscript(finalTranscript.trim());
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setHasMicPermission(false);
        toast({
            variant: 'destructive',
            title: 'Microphone Access Denied',
            description: 'Please enable microphone permissions to use this feature.',
        });
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [isListening, hasMicPermission, onTranscript, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null; // Important to prevent restart on 'end' event
      setIsListening(false);
    }
  }, []);

  useEffect(() => {
    // Stop listening when the component unmounts
    return () => {
      stopListening();
    };
  }, [stopListening]);


  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleClear = () => {
    setTranscription('');
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className='grid gap-1'>
              <CardTitle>Live Transcription</CardTitle>
              <CardDescription>
                Use your microphone to transcribe the meeting in real-time.
              </CardDescription>
            </div>
            <Button
                onClick={toggleListening}
                disabled={disabled || hasMicPermission === false}
                size="icon"
                variant={isListening ? 'destructive' : 'outline'}
                className='h-10 w-10'
            >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {hasMicPermission === false && (
            <Alert variant="destructive">
                <AlertTitle>Microphone Access Required</AlertTitle>
                <AlertDescription>
                Please allow microphone access in your browser to use this feature.
                </AlertDescription>
            </Alert>
        )}
         {hasMicPermission !== false && (
             <div className="h-48 min-h-[192px] rounded-md border bg-muted/20 p-3 text-sm overflow-y-auto">
                {transcription ? transcription : 
                    <p className="text-muted-foreground">
                        {disabled ? 'Select a meeting group to start.' : isListening ? 'Listening...' : 'Click the microphone to start transcribing.'}
                    </p>
                }
            </div>
         )}
        {transcription && hasMicPermission !== false && (
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
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
          {isLoading ? 'Generating...' : 'Generate MoM from Live Transcript'}
        </Button>
      </CardFooter>
    </Card>
  );
}
