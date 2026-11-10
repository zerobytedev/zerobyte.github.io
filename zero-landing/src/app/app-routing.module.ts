import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./not-found/not-found.component";
import {HomeComponent} from "./home/home.component";
import {ComingSoonComponent} from "./coming-soon/coming-soon.component";
import {ContactComponent} from "./contact/contact.component";
import {IntegrationsComponent} from "./integrations/integrations.component";
import {SeoData} from "./seo.service";

const comingSoon = (path: string, title: string): SeoData => ({
  path,
  title: `${title} — ZEROBYTE`,
  description: 'This page is coming soon. ZEROBYTE builds web, mobile and cloud software in Tbilisi, Georgia.',
  noindex: true,
});

const routes: Routes = [
  {
    path: '', component: HomeComponent, data: {
      seo: {
        path: '',
        title: 'ZEROBYTE — Software Development Company in Tbilisi, Georgia',
        description: 'ZEROBYTE designs, builds and runs web, mobile and cloud software for startups and enterprises in Georgia and abroad — from Next.js storefronts to Kotlin backends on AWS, GCP and DigitalOcean.',
      } satisfies SeoData
    }
  },
  {
    path: 'integrations', component: IntegrationsComponent, data: {
      seo: {
        path: 'integrations',
        title: 'Technologies & Integrations — ZEROBYTE',
        description: 'The stack ZEROBYTE ships with: AWS, Google Cloud, DigitalOcean, Kubernetes and Terraform; React, Angular and Next.js; Kotlin, Spring and Node.js; PostgreSQL and MongoDB Atlas.',
      } satisfies SeoData
    }
  },
  {
    path: 'contact', component: ContactComponent, data: {
      seo: {
        path: 'contact',
        title: 'Contact ZEROBYTE — Start a Software Project',
        description: 'Tell ZEROBYTE about your project. Email info@zerobyte.ge and we reply within one business day with a plan to move forward.',
      } satisfies SeoData
    }
  },
  {path: 'not-found', component: NotFoundComponent, data: {seo: {...comingSoon('not-found', 'Page Not Found'), description: 'This page does not exist.'}}},
  {path: 'coming-soon', component: ComingSoonComponent, data: {seo: comingSoon('coming-soon', 'Coming Soon')}},
  {path: 'services', component: ComingSoonComponent, data: {seo: comingSoon('services', 'Services')}},
  {path: 'about', component: ComingSoonComponent, data: {seo: comingSoon('about', 'About')}},
  {path: 'blog', component: ComingSoonComponent, data: {seo: comingSoon('blog', 'Blog')}},
  {path: 'career', component: ComingSoonComponent, data: {seo: comingSoon('career', 'Careers')}},
  {path: 'cookie-policy', component: ComingSoonComponent, data: {seo: comingSoon('cookie-policy', 'Cookie Policy')}},
  {path: 'privacy-policy', component: ComingSoonComponent, data: {seo: comingSoon('privacy-policy', 'Privacy Policy')}},

  // otherwise redirect to the 404 page
  {path: '**', redirectTo: 'not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
