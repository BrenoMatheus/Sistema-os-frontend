import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,
  DetailEquipments,
  ListEquipments,
  ListTechnicians,
  DetailTechnicians,
  DetailItems,
  ListItems,
  ListOrders,
  DetailOrders,
} from '../pages';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/pagina-inicial',
        label: 'Página inicial',
      },
      {
        icon: 'agriculture',
        path: '/equipments',
        label: 'Equipamentos',
      },
      {
        icon: 'manage_accounts',
        path: '/technicians',
        label: 'Técnicos',
      },
      {
        icon: 'handyman',
        path: '/items',
        label: 'Almoxarifado',
      },
      {
        icon: 'content_paste',
        path: '/orders',
        label: 'Ordem de Serviço',
      },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />

      <Route path="/equipments" element={<ListEquipments />} />
      <Route path="/equipments/detail/:id" element={<DetailEquipments />} />

      <Route path="/technicians" element={<ListTechnicians />} />
      <Route path="/technicians/detail/:id" element={<DetailTechnicians />} />

      <Route path="/items" element={<ListItems />} />
      <Route path="/items/detail/:id" element={<DetailItems />} />

      <Route path="/orders" element={<ListOrders />} />
      <Route path="/orders/detail/:id" element={<DetailOrders />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};
