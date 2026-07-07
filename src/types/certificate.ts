export interface Certificate {
  id: string;
  title: string;
  participantName: string;
  hours: number;
  imageUrl?: string;
  issueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditCertificateFormData {
  title: string;
  participantName: string;
  hours: number;
}

