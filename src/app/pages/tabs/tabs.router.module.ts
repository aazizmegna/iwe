import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: '../home-tab/home.module#HomePageModule',
          },
        ],
      },
      {
        path: 'search-services',
        children: [
          {
            path: '',
            loadChildren: '../search-services-tab/search-services.module#SearchServicesModule',
          },
        ],
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: '../account/account.module#AccountPageModule',
          },
        ],
      },
      {
        path: 'new-post',
        children: [
          {
            path: '',
            loadChildren: '../new-post/new-post-tab.module#NewPostTabModule',
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
