import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, MenuItem, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { EquipmentsService } from '../../shared/services/api/equipments/EquipmentsService';
import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms';
import { DetailTool } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';


interface IFormData {
  name: string,
  serieNumber: string,
  type: string,
  description?: string,
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  name: yup.string().required().min(3).max(70),
  serieNumber: yup.string().required().min(3).max(30),
  type: yup.string().required().min(3).max(70),
  description: yup.string().optional(),
});

export const DetailEquipments: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');


  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);

      EquipmentsService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/equipments');
          } else {
            setName(result.name);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        setName: '',
        setSerieNumber: '',
        setType: '',
        setDescription: '',
      });
    }
  }, [id]);


  const handleSave = (dados: IFormData) => {
    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'nova') {
          EquipmentsService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/equipments');
                } else {
                  navigate(`/equipments/detail/${result}`);
                }
              }
            });
        } else {
          EquipmentsService
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/equipments');
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
      EquipmentsService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/equipments');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'New Equipment' : name}
      barraDeFerramentas={
        <DetailTool
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate('/equipments')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/equipments/detail/nova')}
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
              <Typography variant='h6'>Register Equipment</Typography>
            </Grid>


            <Grid container item direction="row" spacing={2}>
              <Grid item direction="column">
                <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                  <VTextField
                    fullWidth
                    name='name'
                    label='Nome'
                    disabled={isLoading}
                    onChange={e => setName(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid item direction="column">
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <VTextField
                    fullWidth
                    name='serieNumber'
                    label='Numero de Serie'
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>
            </Grid>
           
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={8} lg={6} xl={4}>
                <VTextField
                  fullWidth
                  select
                  name='type'
                  label='Tipo'
                  disabled={isLoading}
                >
                  <MenuItem key="1" value="Combustão">
                    Combustão
                  </MenuItem>
                  <MenuItem key="2" value="Eletrica">
                    Eletrica
                  </MenuItem>
                  <MenuItem key="3" value="Retratil">
                    Retratil
                  </MenuItem>
                </VTextField>

              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={8} lg={6} xl={4}>
                <VTextField
                  fullWidth
                  name='description'
                  label='Descrição'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </VForm>
    </LayoutBaseDePagina >
  );
};