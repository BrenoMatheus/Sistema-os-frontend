import React, { useState } from 'react';

import { Grid, Icon, IconButton, TextField } from '@mui/material';
import * as yup from 'yup';
import { formValidationSchema } from './DetailItemofLines';
import {
  IListItemofLine,
  ItemofLinesService,
} from '../../../../shared/services/api/itemofLines/ItemofLinesService';
import { IVFormErrors, VForm, useVForm } from '../../../../shared/forms';
import { useNavigate } from 'react-router-dom';
import { AutoCompleteItem } from './AutoCompleteItem';

type TVTextFieldProps = {
  name: string;
  data: IListItemofLine;
  key: number;
  id: number;
  handleDelete:any;
};

export interface IFormData {
  orderID: number;
  itemID: number;
  amount: number;
  total: number;
}

export const TableList: React.FC<TVTextFieldProps> = ({ data, key, id, handleDelete }) => {
  const [changedAmount, setChangedAmount] = useState(data.amount);
  const [changedTotal, setChangedTotal] = useState(data.total);
  const [isLoading, setIsLoading] = useState(false);
  const { formRef, isSaveAndClose } = useVForm();
  const navigate = useNavigate();

  const handleSave = (dados: IFormData) => {
    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);
        if (changedAmount !== dados.amount || changedTotal !== dados.total) {
          ItemofLinesService.updateById(Number(id), {
            id: Number(id),
            ...dadosValidados,
            amount: changedAmount,
            total: changedTotal,
          }).then((result) => {
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

        errors.inner.forEach((error) => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      });
  };

  return (
    <VForm key={key} ref={formRef} onSubmit={handleSave}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={1}
        spacing={{ xs: 0, md: 0 }}
        columns={{ xs: 3, sm: 6, md: 8 }}
      >
        <Grid item spacing={0} margin={0} padding={0}>
          <IconButton size="small" onClick={() => handleDelete(data.id)}>
            <Icon>delete</Icon>
          </IconButton>
        </Grid>
        <Grid item xs={2} sm={4} md={3}>
          <AutoCompleteItem
            isExternalLoading={isLoading}
            itemID={data.itemID}
          />
        </Grid>

        <Grid item xs={2} sm={4} md={2}>
          <TextField
            variant="standard"
            defaultValue={data.amount}
            onChange={(e) => setChangedAmount(Number(e.target.value))}
            onBlur={() => handleSave(data)}
          />
        </Grid>
        <Grid item xs={2} sm={4} md={2}>
          <TextField
            variant="standard"
            defaultValue={data.total}
            onChange={(e) => setChangedTotal(Number(e.target.value))}
            onBlur={() => handleSave(data)}
          />
        </Grid>
      </Grid>
    </VForm>
  );
};

export default TableList;
