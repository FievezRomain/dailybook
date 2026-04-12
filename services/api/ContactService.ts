import { createCrudService } from './factory';
import { CreateContactPayload, UpdateContactPayload } from '../../features/contacts/types';
import { Contact } from '../../models/Contact';

const _crud = createCrudService<Contact, CreateContactPayload, UpdateContactPayload>('/contacts');

export const getContacts = _crud.getAll;
export const createContact = _crud.create;
export const updateContact = _crud.update;
export const deleteContact = _crud.remove;
