import { Component, Input } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent {
  @Input()
  contact: Contact;

  @Input()
  createHandler: (newContact: Contact) => void;
  @Input()
  updateHandler: (updatedContact: Contact) => void;
  @Input()
  deleteHandler: (deletedContactId: string) => void;

  constructor(private contactService: ContactService) { }

  createContact(contact: Contact) {
    this.contactService.createContact(contact).then((newContact: Contact) => {
      this.createHandler(newContact);
    });
  }

  updateContact(contact: Contact): void {
    this.contactService.updateContact(contact).then((updatedContact: Contact) => {
      this.updateHandler(updatedContact);
    });
  }

  deleteContact(contactId: string): void {
    this.contactService.deleteContact(contactId).then((deletedContactId: string) => {
      this.deleteHandler(deletedContactId);
    });
  }
}
