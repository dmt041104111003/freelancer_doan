"use client";

import Icon from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JobApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  coverLetter: string;
  onCoverLetterChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function JobApplyDialog({
  open,
  onOpenChange,
  jobTitle,
  coverLetter,
  onCoverLetterChange,
  onSubmit,
  isLoading,
}: JobApplyDialogProps) {
  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent showCloseButton={!isLoading} className="max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Ứng tuyển công việc</DialogTitle>
          <DialogDescription className="min-w-0">
            <span className="block truncate">Gửi đơn ứng tuyển cho công việc &quot;{jobTitle}&quot;</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 min-w-0 min-h-0 flex-1 overflow-y-auto">
          <div>
            <Label htmlFor="coverLetter" className="text-sm text-gray-700">
              Thư giới thiệu (không bắt buộc)
            </Label>
            <Textarea
              id="coverLetter"
              placeholder="Giới thiệu bản thân, kinh nghiệm liên quan và lý do bạn phù hợp với công việc này..."
              value={coverLetter}
              onChange={(e) => onCoverLetterChange(e.target.value)}
              disabled={isLoading}
              className="mt-2 min-h-[120px] max-h-[40vh] resize-y w-full break-words overflow-x-hidden"
            />
          </div>
        </div>

        <DialogFooter className="shrink-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={onSubmit} disabled={isLoading} className="bg-[#04A0EF] hover:bg-[#0380BF]">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Icon name="send" size={16} />
                Gửi ứng tuyển
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
