import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./not-found/not-found.component";
import {HomeComponent} from "./home/home.component";
import {ComingSoonComponent} from "./coming-soon/coming-soon.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: '404', component: NotFoundComponent},
  {path: 'coming-soon', component: ComingSoonComponent},

  // otherwise redirect to home
  {path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
