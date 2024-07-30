import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioPage } from './inicio.page';

const routes: Routes = [
  {
    path: '',
    component: InicioPage,
    children: [
      {
        path: 'gastos',
        loadChildren: () =>
          import('../../pages/gastos/gastos.module').then(
            (m) => m.GastosPageModule
          ),
      },
      {
        path: 'estadisticas',
        loadChildren: () =>
          import('../../pages/estadisticas/estadisticas.module').then(
            (m) => m.EstadisticasPageModule
          ),
      },
      {
        path: 'ahorro',
        loadChildren: () =>
          import('../../pages/ahorro/ahorro.module').then(
            (m) => m.AhorroPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}
