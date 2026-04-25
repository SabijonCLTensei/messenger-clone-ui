import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import styles from './NewMessageModal.module.css'; // Import CSS module

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (contactId: string) => void; // Function to start a new chat
}

const DUMMY_CONTACTS = [
  { id: '1', name: 'Alice', avatar: 'https://via.placeholder.com/40' },
  { id: '2', name: 'Bob', avatar: 'https://via.placeholder.com/40' },
  { id: '3', name: 'Charlie', avatar: 'https://via.placeholder.com/40' },
  { id: '4', name: 'David', avatar: 'https://via.placeholder.com/40' },
  { id: '5', name: 'Eve', avatar: 'https://via.placeholder.com/40' },
  { id: '6', name: 'Frank', avatar: 'https://via.placeholder.com/40' },
];

const NewMessageModal: React.FC<NewMessageModalProps> = ({ isOpen, onClose, onStartChat }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) {
    return null;
  }

  const filteredContacts = DUMMY_CONTACTS.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>New Message</h2>
          <X className={styles.closeButton} onClick={onClose} />
        </div>

        {/* Search Input */}
        <div className={styles.searchInputContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search contacts"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Contact List */}
        <div className={styles.contactList}>
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={styles.contactItem}
                onClick={() => onStartChat(contact.id)}
              >
                <img src={contact.avatar} alt={contact.name} className={styles.contactAvatar} />
                <span className={styles.contactName}>{contact.name}</span>
              </div>
            ))
          ) : (
            <p className={styles.noContactsMessage}>No contacts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;
