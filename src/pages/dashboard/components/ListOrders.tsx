import { useEffect, useMemo, useState } from 'react';
import { Grid, Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { IListOrders, OrdersService, } from '../../../shared/services/api/orders/OrdersService';
import { Environment } from '../../../shared/environment';
import { useDebounce } from '../../../shared/hooks';


export const ListOrdersDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListOrders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);


  const search = useMemo(() => {
    return searchParams.get('search') || '';
  }, [searchParams]);

  const page = useMemo(() => {
    return Number(searchParams.get('page') || '1');
  }, [searchParams]);


  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      OrdersService.getAll(page, search)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            setTotalCount(result.totalCount);
            setRows(result.data);

            if (rows.filter((row) => row.status = true)) {
              console.log('Aberta');
            }

          }
        });
    });
  }, [search, page]);

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      OrdersService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.id !== id),
            ]);
            alert('Registro apagado com sucesso!');
          }
        });
    }
  };


  return (
    <>
      <Grid container item xs={12} marginTop={2} component={Paper} variant="outlined" >
        <Grid item xs={4} marginLeft={2}>
          {!isLoading && (
            <h4>Ordens: {totalCount}</h4>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} marginTop={2}>
        <TableContainer component={Paper} variant="outlined" sx={{ width: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={100}>Ações</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Defeito</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                
                <TableRow key={row.id}>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleDelete(row.id)}>
                      <Icon>delete</Icon>
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/orders/detail/${row.id}`)}>
                      <Icon>edit</Icon>
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.defect}</TableCell>
                  <TableCell>{row.status == true ? 'Fechada':'Aberta'}</TableCell>
                </TableRow>
              )
              )}
            </TableBody>

            {totalCount === 0 && !isLoading && (
              <caption>{Environment.EMPTY_LISTING}</caption>
            )}

            <TableFooter>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <LinearProgress variant='indeterminate' />
                  </TableCell>
                </TableRow>
              )}
              {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Pagination
                      page={page}
                      count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                      onChange={(_, newPage) => setSearchParams({ search, page: newPage.toString() }, { replace: true })}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};
