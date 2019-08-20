import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ContactService } from './contact.service';
import { Contact } from './contact';
import { routeParts } from '../constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  styleUrls: ['./contact.component.scss'],
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnDestroy, OnInit {

  private readonly unsubscribe = new Subject<never>();
  contactForm: FormGroup;
  contact: Contact;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map(p => p[routeParts.idParam]),
        map(id => Number(id)),
        filter(id => !isNaN(id)),
        switchMap(id => this.contactService.getById(id)),
        takeUntil(this.unsubscribe)
      )
      .subscribe((c: Contact) => this.onContactLoaded(c));
    this.InitForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  InitForm(): void {
    this.contactForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required, Validators.minLength(10)]],
      streetAddress: [null, Validators.required],
      suburb: [null, Validators.required],
      postCode: [null, Validators.required]
    });
  }


  private onContactLoaded(contact: Contact): void {
    this.contact = contact;
    this.contactForm.patchValue({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      streetAddress: contact.streetAddress,
      suburb: contact.suburb,
      postCode: contact.postCode
    });
  }

  get formAltaControls(): any {
    return this.contactForm['controls'];
 }

  onFormSubmit(formData: Contact): void {
    formData.id = this.contact.id;
    this.contactService.updateContact(formData).pipe(
      takeUntil(this.unsubscribe)
    )
    .subscribe(
      result => {
        console.log(result);
        // this.router.navigate(['list']); // Redirect to listing page (if there is any)
        // we can use toaster/alert/modal to display the user the success message
      },
      err => {
        console.log(err);
        // we can use toaster/alert/modal to display the user the error message
      }
    );
  }

  cancelForm() {
    this.InitForm();
  }
}
