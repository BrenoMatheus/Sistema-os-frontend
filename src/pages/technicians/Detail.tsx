import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, MenuItem, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { TechniciansService } from '../../shared/services/api/technicians/TechniciansService';
import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms';
import { DetailTool } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';


interface IFormData {
  name: string,
  email: string,
  category: string,
  description?: string,
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  name: yup.string().required().min(3).max(70),
  email: yup.string().required().email(),
  category: yup.string().required().min(3).max(70),
  description: yup.string().optional(),
});

export const DetailTechnicians: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');


  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);

      TechniciansService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/technicians');
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
          TechniciansService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/technicians');
                } else {
                  navigate(`/technicians/detail/${result}`);
                }
              }
            });
        } else {
          TechniciansService
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/technicians');
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
      TechniciansService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/technicians');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'New Technician' : name}
      barraDeFerramentas={
        <DetailTool
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate('/technicians')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/technicians/detail/nova')}
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
              <Typography variant='h6'>Register Technician</Typography>
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
                    name='email'
                    label='Email'
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
                  name='category'
                  label='Categoria'
                  disabled={isLoading}
                >
                  <MenuItem key="1" value="Mecanico">
                    Mecanico
                  </MenuItem>
                  <MenuItem key="2" value="Eletricista">
                    Eletricista
                  </MenuItem>
                  <MenuItem key="3" value="TTT">
                    TTT
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