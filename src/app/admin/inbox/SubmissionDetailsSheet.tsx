
"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { ContactSubmission } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import React from "react";

type SubmissionDetailsSheetProps = {
  submission: ContactSubmission;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const replyTemplates = [
    { id: 'thanks', title: 'Thank you for your inquiry', content: "Hi [Name],\n\nThanks for reaching out! We've received your message and will get back to you within 24 hours.\n\nBest,\nThe Vincent Designs Studio Team" },
    { id: 'call', title: 'Schedule a call', content: "Hi [Name],\n\nThanks for your interest. Are you available for a brief call next week to discuss your project? Please let us know what time works best for you.\n\nBest,\nThe Vincent Designs Studio Team" },
    { id: 'quote', title: 'Regarding your quote', content: "Hi [Name],\n\nWe're working on your project quote and will have it ready for you shortly. We'll be in touch soon with the details.\n\nBest,\nThe Vincent Designs Studio Team" },
];

export default function SubmissionDetailsSheet({ submission, isOpen, onOpenChange }: SubmissionDetailsSheetProps) {
    const [replyContent, setReplyContent] = React.useState("");

    const handleTemplateChange = (templateId: string) => {
        const template = replyTemplates.find(t => t.id === templateId);
        if (template) {
            setReplyContent(template.content.replace('[Name]', submission.name.split(' ')[0]));
        }
    }
    
    React.useEffect(() => {
        // Reset reply content when a new submission is viewed
        if(isOpen) {
            setReplyContent("");
        }
    }, [isOpen, submission]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] flex flex-col">
        <SheetHeader>
          <SheetTitle>Message Details</SheetTitle>
          <SheetDescription>
            From: {submission.name} ({submission.email})
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto pr-6 -mr-6 space-y-6">
            <div className="text-sm p-4 rounded-md bg-muted/50">
                <p><strong>Service of Interest:</strong> {submission.service}</p>
                <p><strong>Received:</strong> {submission.createdAt ? format(submission.createdAt, 'PPp') : 'N/A'}</p>
                <Separator className="my-3" />
                <p className="whitespace-pre-wrap">{submission.message}</p>
            </div>

            <Separator />

            <div>
                <h4 className="font-semibold mb-4">Quick Reply</h4>
                <div className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="template-select">Reply Template</Label>
                         <Select onValueChange={handleTemplateChange}>
                            <SelectTrigger id="template-select">
                                <SelectValue placeholder="Choose a template..." />
                            </SelectTrigger>
                            <SelectContent>
                                {replyTemplates.map(template => (
                                    <SelectItem key={template.id} value={template.id}>{template.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reply-content">Reply Message</Label>
                        <Textarea 
                            id="reply-content"
                            placeholder="Compose your reply..." 
                            className="min-h-48"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>

        <SheetFooter className="mt-auto pt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button>Send Reply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
