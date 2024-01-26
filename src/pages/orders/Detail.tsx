import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, MenuItem, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { OrdersService } from '../../shared/services/api/orders/OrdersService';
import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms';
import { DetailTool } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { VDateField } from '../../shared/forms/VDateField';
import { AutoCompleteEquipment } from './components/AutoCompleteEquipment';
import { AutoCompleteTechnician } from './components/AutoCompleteTechnician';
import { DetailItemofLines } from './components/itemofLines/DetailItemofLines';


interface IFormData {
  equipmentID: number,
  technicianID: number,
  type: string,
  defect: string,
  causes: string,
  solution: string,
  status: boolean,
  date_init_os: Date,
  date_end_os?: Date,
  total: number,
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  type: yup.string().required().min(5).max(20),
  defect: yup.string().required().min(3).max(150),
  causes: yup.string().required().min(3).max(150),
  solution: yup.string().required().min(3).max(150),
  date_init_os: yup.date().required(),
  date_end_os: yup.date().optional(),
  total: yup.number().required(),
  status: yup.boolean().required(),
  equipmentID: yup.number().required(),
  technicianID: yup.number().required(),
});

export const DetailOrders: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();


  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);

      OrdersService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/orders');
          } else {
            setName(result.solution);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        equipmentID: '',
        technicianID: '',
        type: '',
        defect: '',
        causes: '',
        solution: '',
        date_init_os: '',
        date_end_os: null,
        total: '',
      });
    }
  }, [id]);


  const handleSave = (dados: IFormData) => {
    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'nova') {
          OrdersService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/orders');
                } else {
                  navigate(`/orders/detalhe/${result}`);
                }
              }
            });
        } else {
          OrdersService
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/orders');
                }
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {};

        errors.inner.forEach(error => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      });
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      OrdersService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/orders');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova order' : name}
      barraDeFerramentas={
        <DetailTool
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate('/orders')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/orders/detalhe/nova')}
        />
      }
    >
      <VForm ref={formRef} onSubmit={handleSave}>
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">

          <Grid container direction="column" padding={2} spacing={2}>

            {isLoading && (
              <Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>
            )}

            <Grid item>
              <Typography variant='h6'>Geral</Typography>
            </Grid>

            <Grid container item spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 6, md: 8 }}>
              <Grid item xs={4} sm={6} md={4}>
                <AutoCompleteEquipment isExternalLoading={isLoading} />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <AutoCompleteTechnician isExternalLoading={isLoading} />
              </Grid>
            </Grid>

            <Grid container item spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 6, md: 8 }}>
              
              <Grid item xs={4} sm={6} md={4}>
                <Grid item xs={12}>
                  <VTextField
                    fullWidth
                    select
                    name='type'
                    label='Tipo'
                    disabled={isLoading}
                  >
                    <MenuItem key="1" value="Corretiva">
                      Corretiva
                    </MenuItem>
                    <MenuItem key="2" value="Preventiva">
                      Preventiva
                    </MenuItem>
                    <MenuItem key="3" value="Garantia">
                      Garantia
                    </MenuItem>
                  </VTextField>

                </Grid>
              </Grid>

              <Grid item xs={4} sm={6} md={4}>
                <Grid item xs={12}>
                  <VTextField
                    fullWidth
                    select
                    name='status'
                    label='Status'
                    disabled={isLoading}
                  >
                    <MenuItem key="1" value="1">
                      Aberta
                    </MenuItem>
                    <MenuItem key="2" value="0">
                      Fechada
                    </MenuItem>
                  </VTextField>

                </Grid>
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12}>
                <VTextField
                  fullWidth
                  name='defect'
                  disabled={isLoading}
                  label='Defeito'
                  multiline
                  maxRows={4}
                  defaultValue="Default Value"
                  onChange={e => setName(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12}>
                <VTextField
                  fullWidth
                  name='causes'
                  disabled={isLoading}
                  label='Causa'
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12}>
                <VTextField
                  fullWidth
                  name='solution'
                  disabled={isLoading}
                  label='Solucao'
                />
              </Grid>
            </Grid>

            <Grid container item spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 6, md: 8, lg: 12 }}>
              <Grid item xs={6} sm={6} md={4}>
                <VDateField
                  name='date_init_os'
                  label='Inicio'
                />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <VDateField
                  name='date_end_os'
                  label='Termino'
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12}>
                <VTextField
                  fullWidth
                  name='total'
                  label='Total'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12}>
                <DetailItemofLines
                />
              </Grid>
            </Grid>

            

          </Grid>

        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};
