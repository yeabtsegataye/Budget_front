import { Modal, ModalHeader, ModalTitle, ModalCloseButton, ModalContent, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message, loading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm">
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>

      <ModalContent>
        <p className="text-muted-foreground">{message}</p>
      </ModalContent>

      <ModalFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="button" 
          variant="destructive" 
          onClick={onConfirm} 
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmDeleteModal;