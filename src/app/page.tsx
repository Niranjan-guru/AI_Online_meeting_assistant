'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import MeetingManager from '@/components/minutes/MeetingManager';
import TranscriptionInput from '@/components/minutes/TranscriptionInput';
import MeetingOutput from '@/components/minutes/MeetingOutput';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { MeetingGroup, StoredMoM, MoMOutput } from '@/lib/types';
import { generateMoMAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { toast } = useToast();
  const [meetingGroups, setMeetingGroups] = useLocalStorage<MeetingGroup[]>(
    'minute-ai-groups',
    []
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [transcription, setTranscription] = useState('');
  const [currentOutput, setCurrentOutput] = useState<MoMOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedGroup = useMemo(
    () => meetingGroups.find((g) => g.id === selectedGroupId),
    [meetingGroups, selectedGroupId]
  );

  const handleAddGroup = (name: string) => {
    if (name) {
      const newGroup: MeetingGroup = {
        id: uuidv4(),
        name,
        createdAt: new Date().toISOString(),
        moms: [],
      };
      const updatedGroups = [...meetingGroups, newGroup];
      setMeetingGroups(updatedGroups);
      setSelectedGroupId(newGroup.id);
      toast({
        title: 'Meeting group created',
        description: `Successfully created "${name}".`,
      });
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    setMeetingGroups(meetingGroups.filter((g) => g.id !== groupId));
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
      setCurrentOutput(null);
      setTranscription('');
    }
    toast({
      title: 'Meeting group deleted',
      description: 'The meeting group and all its minutes have been removed.',
      variant: 'destructive',
    });
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    const group = meetingGroups.find((g) => g.id === groupId);
    if (group && group.moms.length > 0) {
      const latestMoM = group.moms[group.moms.length - 1];
      setCurrentOutput({
        summary: latestMoM.summary,
        minutesOfMeeting: latestMoM.minutesOfMeeting,
        actionItems: latestMoM.actionItems,
      });
      setTranscription(latestMoM.transcription);
    } else {
      setCurrentOutput(null);
      setTranscription('');
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setTranscription(text);
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateMoM = async () => {
    if (!transcription.trim()) {
      toast({
        title: 'Empty Transcription',
        description: 'Please provide a transcription to generate minutes.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedGroup) {
      toast({
        title: 'No Meeting Group Selected',
        description: 'Please select or create a meeting group first.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setCurrentOutput(null);

    const previousMom =
      selectedGroup.moms.length > 0
        ? JSON.stringify(selectedGroup.moms[selectedGroup.moms.length - 1])
        : undefined;

    const result = await generateMoMAction({ transcription, previousMom });

    if (result && 'minutesOfMeeting' in result) {
      setCurrentOutput(result);
      toast({
        title: 'Generation Complete',
        description: 'Minutes of Meeting have been successfully generated.',
      });
    } else {
      toast({
        title: 'Generation Failed',
        description:
          result.error || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleSaveMoM = () => {
    if (!currentOutput || !selectedGroupId) return;

    const newMoM: StoredMoM = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      transcription,
      ...currentOutput,
    };

    setMeetingGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === selectedGroupId
          ? { ...group, moms: [...group.moms, newMoM] }
          : group
      )
    );
    toast({
      title: 'Minutes Saved',
      description: 'The current Minutes of Meeting have been saved to the group.',
    });
  };

  const handleDownloadMoM = () => {
    if (!currentOutput) return;
    const content = `
# Summary
${currentOutput.summary}

---

# Minutes of Meeting
${currentOutput.minutesOfMeeting}

---

# Action Items
${currentOutput.actionItems}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MoM-${selectedGroup?.name.replace(
      /\s/g,
      '_'
    )}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
        <div className="mx-auto grid max-w-screen-2xl items-start gap-6 md:grid-cols-2 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-6">
            <MeetingManager
              groups={meetingGroups}
              selectedGroupId={selectedGroupId}
              onAddGroup={handleAddGroup}
              onDeleteGroup={handleDeleteGroup}
              onSelectGroup={handleSelectGroup}
            />
            <TranscriptionInput
              transcription={transcription}
              onTranscriptionChange={setTranscription}
              onFileChange={handleFileChange}
              onGenerate={handleGenerateMoM}
              isLoading={isLoading}
              disabled={!selectedGroupId}
            />
          </div>
          <div className="flex flex-col gap-6">
            {isLoading && (
              <div className="flex h-[500px] items-center justify-center rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">
                    Generating your minutes...
                  </p>
                </div>
              </div>
            )}
            {currentOutput && !isLoading && (
              <MeetingOutput
                output={currentOutput}
                onOutputChange={setCurrentOutput}
                onSave={handleSaveMoM}
                onDownload={handleDownloadMoM}
              />
            )}
            {!currentOutput && !isLoading && (
              <div className="flex h-[500px] items-center justify-center rounded-lg border border-dashed bg-card/50 p-6 shadow-sm">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    Minutes of Meeting
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedGroupId
                      ? 'Enter a transcription and click "Generate MoM" to begin.'
                      : 'Select or create a meeting group to get started.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
