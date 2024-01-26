import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

import { EquipmentsService } from '../../shared/services/api/equipments/EquipmentsService';
import { TechniciansService } from '../../shared/services/api/technicians/TechniciansService';
import { ItemsService } from '../../shared/services/api/items/ItemsService';
import { ToolsListing } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { ListOrdersDashboard } from './components/ListOrders';


export const Dashboard = () => {
  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(true);
  const [totalCountTechnicians, setTotalCountTechnicians] = useState(0);
  const [isLoadingEquipments, setIsLoadingEquipments] = useState(true);
  const [totalCountEquipments, setTotalCountEquipments] = useState(0);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [totalCountItems, setTotalCountItems] = useState(0);

  useEffect(() => {
    setIsLoadingTechnicians(true);
    setIsLoadingEquipments(true);

    TechniciansService.getAll(1)
      .then((result) => {
        setIsLoadingTechnicians(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCountTechnicians(result.totalCount);
        }
      });
    EquipmentsService.getAll(1)
      .then((result) => {
        setIsLoadingEquipments(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCountEquipments(result.totalCount);
        }
      });
    ItemsService.getAll(1)
      .then((result) => {
        setIsLoadingItems(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCountItems(result.totalCount);
        }
      });
  }, []);


  return (
    <LayoutBaseDePagina
      titulo='Página inicial'
      barraDeFerramentas={<ToolsListing mostrarBotaoNovo={false} />}
    >
      <Box width='100%' display='flex'>
        <Grid container margin={2}>
          <Grid item container spacing={2}>

            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>

              <Card>
                <CardContent>
                  <Typography variant='h6' align='left'>
                    Tecnicos:
                  </Typography>

                  <Box padding={1} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingTechnicians && (
                      <Typography variant='h4'>
                        {totalCountTechnicians}
                      </Typography>
                    )}
                    {isLoadingTechnicians && (
                      <Typography variant='h6'>
                        Carregando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>

              <Card>
                <CardContent>
                  <Typography variant='h6' align='left'>
                    Equipamentos:
                  </Typography>

                  <Box padding={1} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingEquipments && (
                      <Typography variant='h4'>
                        {totalCountEquipments}
                      </Typography>
                    )}
                    {isLoadingEquipments && (
                      <Typography variant='h6'>
                        Carregando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>

              <Card>
                <CardContent>
                  <Typography variant='h6' align='left'>
                    Serviço/Produtos:
                  </Typography>

                  <Box padding={1} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingItems && (
                      <Typography variant='h4'>
                        {totalCountItems}
                      </Typography>
                    )}
                    {isLoadingItems && (
                      <Typography variant='h6'>
                        Carregando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

            </Grid>

          </Grid>

          <ListOrdersDashboard />


        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};
