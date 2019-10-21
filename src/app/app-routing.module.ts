import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './auth/page/login/login.module#LoginPageModule'
  },
  {
    path: '',
    loadChildren: './tabs/tabs.module#TabsPageModule'
    // loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'example-modal', loadChildren: './example-modal/example-modal.module#ExampleModalPageModule' },
  { path: 'time-table-modal', loadChildren: './tabs/modals/time-table-modal/time-table-modal.module#TimeTableModalPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
