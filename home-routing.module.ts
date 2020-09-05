import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'portfolio',
        children: [
          {
            path: '',
            loadChildren: () => import('./portfolio/portfolio.module').then( m => m.PortfolioPageModule)
          }
        ]
      },
      {
        path: 'trade-calls',
        children: [
          {
            path: '',
            loadChildren: () => import('./trade-calls/trade-calls.module').then( m => m.TradeCallsPageModule),
            //canLoad: [AuthGuard],
            canActivate: [AuthGuard],
            data : { roles: ["Premium", "Admin"]}
          }
        ]
      },
      {
        path: 'historic-data',
        children: [
          {
            path: '',
            loadChildren: () => import('./historic-data/historic-data.module').then( m => m.HistoricDataPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home/portfolio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/portfolio',
    pathMatch: 'full'
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then( m => m.AboutUsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
