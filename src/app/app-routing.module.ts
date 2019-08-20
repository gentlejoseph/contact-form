import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { routeParts } from './constants';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
    {path: '', redirectTo: `${routeParts.contact}/1`, pathMatch: 'full' },
    {path: `${routeParts.contact}/:${routeParts.idParam}`, component: ContactComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
