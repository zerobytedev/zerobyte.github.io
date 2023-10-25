import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./not-found/not-found.component";
import {HomeComponent} from "./home/home.component";
import {ComingSoonComponent} from "./coming-soon/coming-soon.component";
import {ServicesComponent} from "./services/services.component";
import {IntegrationsComponent} from "./integrations/integrations.component";
import {AboutComponent} from "./about/about.component";
import {ContactComponent} from "./contact/contact.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'coming-soon', component: ComingSoonComponent},
  {path: 'services', component: ComingSoonComponent},
  {path: 'integrations', component: ComingSoonComponent},
  {path: 'about', component: ComingSoonComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'blog', component: ComingSoonComponent},
  {path: 'career', component: ComingSoonComponent},
  {path: 'cookie-policy', component: ComingSoonComponent},
  {path: 'privacy-policy', component: ComingSoonComponent},

  // otherwise redirect to home
  {path: '**', redirectTo: 'not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
