'use client';

import { Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { MoMOutput } from '@/lib/types';
import { Label } from '../ui/label';

interface MeetingOutputProps {
  output: MoMOutput;
  onOutputChange: (output: MoMOutput) => void;
  onSave: () => void;
  onDownload: () => void;
}

export default function MeetingOutput({
  output,
  onOutputChange,
  onSave,
  onDownload,
}: MeetingOutputProps) {
  const handleFieldChange = (
    field: keyof MoMOutput,
    value: string
  ) => {
    onOutputChange({ ...output, [field]: value });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <CardTitle>Generated Minutes</CardTitle>
            <CardDescription>
              Review, edit, save, or download the generated content.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onDownload} className="gap-1">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button size="sm" onClick={onSave} className="gap-1 bg-accent hover:bg-accent/90">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="minutes">Minutes</TabsTrigger>
            <TabsTrigger value="actions">Action Items</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="mt-4">
            <div className="grid gap-2">
              <Label htmlFor="summary-textarea">Meeting Summary</Label>
              <Textarea
                id="summary-textarea"
                value={output.summary}
                onChange={(e) => handleFieldChange('summary', e.target.value)}
                className="h-96 min-h-96"
                placeholder="A concise summary of the meeting's key discussion points and decisions."
              />
            </div>
          </TabsContent>
          <TabsContent value="minutes" className="mt-4">
            <div className="grid gap-2">
              <Label htmlFor="minutes-textarea">Detailed Minutes</Label>
              <Textarea
                id="minutes-textarea"
                value={output.minutesOfMeeting}
                onChange={(e) =>
                  handleFieldChange('minutesOfMeeting', e.target.value)
                }
                className="h-96 min-h-96"
                placeholder="The generated Minutes of Meeting document."
              />
            </div>
          </TabsContent>
          <TabsContent value="actions" className="mt-4">
            <div className="grid gap-2">
              <Label htmlFor="actions-textarea">Action Items</Label>
              <Textarea
                id="actions-textarea"
                value={output.actionItems}
                onChange={(e) =>
                  handleFieldChange('actionItems', e.target.value)
                }
                className="h-96 min-h-96"
                placeholder="A list of identified action items with assigned owners and deadlines."
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
