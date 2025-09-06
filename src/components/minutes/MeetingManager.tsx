'use client';

import { useState } from 'react';
import { PlusCircle, Trash2, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { MeetingGroup } from '@/lib/types';

interface MeetingManagerProps {
  groups: MeetingGroup[];
  selectedGroupId: string | null;
  onAddGroup: (name: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onSelectGroup: (groupId: string) => void;
}

export default function MeetingManager({
  groups,
  selectedGroupId,
  onAddGroup,
  onDeleteGroup,
  onSelectGroup,
}: MeetingManagerProps) {
  const [newGroupName, setNewGroupName] = useState('');

  const handleAdd = () => {
    onAddGroup(newGroupName);
    setNewGroupName('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <CardTitle>Meeting Groups</CardTitle>
            <CardDescription>
              Select a group to continue or create a new one.
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                New Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Meeting Group</DialogTitle>
                <DialogDescription>
                  Enter a name for your new meeting series (e.g., "Project
                  Phoenix Standup").
                </DialogDescription>
              </DialogHeader>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Meeting group name..."
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    onClick={handleAdd}
                    disabled={!newGroupName.trim()}
                  >
                    Create
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {groups.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">
                No meeting groups yet. Create one to get started!
              </p>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  className={cn(
                    'flex items-center justify-between rounded-md border p-3 transition-colors',
                    selectedGroupId === group.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/50'
                  )}
                >
                  <button
                    className="flex-1 text-left"
                    onClick={() => onSelectGroup(group.id)}
                  >
                    <div className="flex items-center gap-3">
                      {selectedGroupId === group.id ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {group.moms.length} minute(s)
                        </p>
                      </div>
                    </div>
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete
                          the "{group.name}" meeting group and all its associated
                          minutes.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteGroup(group.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
