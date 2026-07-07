'use client';

import { ModalContainer, ModalHeader, ModalContent, ModalFooter } from '@/components/modals';
import type { DialogModalProps } from '@/types/dialogModal';

export default function DialogModal({
  open,
  onClose,
  title,
  children,
  footer,
}: DialogModalProps) {
  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalHeader title={title} onClose={onClose} />

      <ModalContent>
        {children}
      </ModalContent>

      {footer && <ModalFooter>{footer}</ModalFooter>}
    </ModalContainer>
  );
}
