import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Contact } from './contact';
import { Injectable } from '@angular/core';
import { shareReplay, catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class ContactService {
  //   private readonly baseUrl = 'http://localhost:5000/api/contacts';
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient: HttpClient) {}

  getById(id: number): Observable<Contact> {
    // const url = `${environment.services['get-contacts']}/${id}`;
    const url = `${environment.services['get-contacts']}`;
    let params = new HttpParams();
    params = params.append('id', id.toString());
    return this.httpClient
      .get<Contact>(url, { headers: this.headers, params })
      .pipe(shareReplay(1));
  }

  updateContact(contact: Contact): Observable<Contact> {
    const url = `${environment.services['update-contact']}`;
    return this.httpClient
      .put<Contact>(url, contact, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
