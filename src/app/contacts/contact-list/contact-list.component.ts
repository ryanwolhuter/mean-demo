import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
  providers: [ContactService]
})
export class ContactListComponent implements OnInit {
  contacts: Contact[];
  selectedContact: Contact;

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.contactService
      .getContacts()
      .then((contacts: Contact[]) => {
        this.contacts = contacts.map(contact => {
          if (!contact.phone) {
            contact.phone = {
              mobile: '',
              work: ''
            };
          }
          return contact;
        });
      });
  }


  selectContact(contact: Contact) {
    this.selectedContact = contact;
  }

  createNewContact() {
    const contact: Contact = {
      name: '',
      email: '',
      phone: {
        work: '',
        mobile: ''
      }
    };

    // A newly created contact is selected by default.
    this.selectContact(contact);
  }

  deleteContact(contactId: string) {
    const idx = this.getIndexOfContact(contactId);
    if (idx !== -1) {
      this.contacts.splice(idx, 1);
      this.selectContact(null);
    }
    return this.contacts;
  }

  addContact(contact: Contact) {
    this.contacts.push(contact);
    this.selectContact(contact);
    return this.contacts;
  }

  updateContact(contact: Contact) {
    const idx = this.getIndexOfContact(contact._id);
    if (idx !== -1) {
      this.contacts[idx] = contact;
      this.selectContact(contact);
    }
    return this.contacts;
  }

  private getIndexOfContact(contactId: string) {
    return this.contacts.findIndex(contact => {
      return contact._id === contactId;
    });
  }
}
