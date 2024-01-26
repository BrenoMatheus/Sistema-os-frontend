import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';

import {
  VTextField,
  VForm,
  useVForm,
  IVFormErrors,
} from '../../../../shared/forms';
import { DetailTool } from '../../../../shared/components';
import {
  IListItemofLine,
  ItemofLinesService,
} from '../../../../shared/services/api/itemofLines/ItemofLinesService';
import TableList from './TableList';
import { useDebounce } from '../../../../shared/hooks';
import { AutoCompleteItem } from './AutoCompleteItem';

interface IFormData {
  orderID: number;
  itemID: number;
  amount: number;
  total: number;
}
export const formValidationSchema: yup.SchemaOf<IFormData> = yup
  .object()
  .shape({
    amount: yup.number().required(),
    total: yup.number().required(),
    orderID: yup.number().integer().required(),
    itemID: yup.number().integer().required(),
  });

export const DetailItemofLines: React.FC = () => {
  const { debounce } = useDebounce();
  const { formRef, save } = useVForm();
  const { id } = useParams<'id'>();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<IListItemofLine[]>([]);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      ItemofLinesService.getAll(1, id).then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setRows(result.data);
        }
      });
    });
  }, [id]);

  const handleSubmit = (dados: IFormData) => {
    dados = { ...dados, orderID: Number(id) };
    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);
        ItemofLinesService.create(dadosValidados).then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            ReloadRows(result, dadosValidados);
          }
        });
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {};

        errors.inner.forEach((error) => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      });
  };

  const ReloadRows = (id:number, data:IFormData) => {
    setRows([...rows, {id: Number(id), ...data}]);
  };  

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      ItemofLinesService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert('Registro apagado com sucesso!');
          setRows(rows.filter(row => row.id !== Number(id))); 
        }
      });
    }
  };

  return (
    <>
      <VForm ref={formRef} onSubmit={handleSubmit}>
        <Box
          margin={1}
          display="flex"
          flexDirection="column"
          component={Paper}
          variant="outlined"
        >
          <Grid container direction="column" padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant="indeterminate" />
              </Grid>
            )}

            <Grid item>
              <Typography variant="h6">Produto/Serviço</Typography>
            </Grid>

            <Grid
              container
              item
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 3, sm: 6, md: 8 }}
            >
              <Grid item xs={3} sm={4} md={3} marginTop={2}>
                <AutoCompleteItem isExternalLoading={isLoading} itemID={0} />
              </Grid>
              <Grid item xs={2} sm={3} md={2}>
                <VTextField
                  variant="standard"
                  fullWidth
                  name="amount"
                  label="Quantidade"
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={2} sm={3} md={2}>
                <VTextField
                  variant="standard"
                  fullWidth
                  name="total"
                  label="Total"
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={1}>
                <DetailTool
                  textoBotaoNovo="Nova"
                  mostrarBotaoSalvarEFechar={id == 'nova'}
                  mostrarBotaoVoltar={id == 'nova'}
                  mostrarBotaoNovo={id == 'nova'}
                  mostrarBotaoApagar={id == 'nova'}
                  aoClicarEmSalvar={save}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm>
      <Box
        margin={1}
        display="flex"
        flexDirection="column"
        component={Paper}
        variant="outlined"
      >
        <Grid container direction="column" padding={2} spacing={2}>
          <Grid
            container
            item
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 3, sm: 6, md: 8 }}
          ></Grid>
        </Grid>
      </Box>
      <Box
        sx={{ flexGrow: 1, p: 2 }}
        margin={1}
        display="flex"
        flexDirection="column"
        component={Paper}
        variant="outlined"
      >
        <Grid container direction="column" margin={2} padding={2} spacing={2}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={2}
            borderBottom={1}
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 3, sm: 6, md: 8 }}
          >
            <Grid item xs={2} sm={4} md={3}>
              <Typography variant="h6">Produto/Serviço</Typography>
            </Grid>
            <Grid item xs={2} sm={4} md={2}>
              <Typography variant="h6">Qtd</Typography>
            </Grid>
            <Grid item xs={2} sm={4} md={2}>
              <Typography variant="h6">Total</Typography>
            </Grid>
          </Grid>
          {rows.map((row) => (
            <TableList handleDelete={handleDelete} key={row.id} id={row.id} name="item" data={row} />
          ))}
        </Grid>
      </Box>
    </>
  );
};
