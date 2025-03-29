export type SampleNetworkFileCardProps = {
  name: string;
  featuredAttacks: string[];
};

export type UploadDialogProps = {
  isOpen: boolean;
  uploadedBytesProgress: number;
  totalBytes: number;
};

export type UploadErrorDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
};