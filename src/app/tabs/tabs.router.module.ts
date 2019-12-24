import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: '../auth/page/login/login.module#LoginPageModule'
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'schedule',
        children: [
          {
            path: '',
            loadChildren: './schedule-list/schedule-list.module#ScheduleListPageModule',
            canLoad: [AuthGuard]
          }
        ]
      },
      {
        path: 'time-table',
        children: [
          {
            path: '',
            loadChildren: './time-table/time-table.module#TimeTablePageModule',
            canLoad: [AuthGuard]
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: './profile/profile.module#ProfilePageModule',
            canLoad: [AuthGuard]
          }
        ]
      },
      {
        path: 'balance',
        children: [
          {
            path: '',
            loadChildren: './balance/balance.module#BalancePageModule',
            canLoad: [AuthGuard]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/time-table',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
