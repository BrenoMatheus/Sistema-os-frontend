import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

import { ItemsService } from '../../../../shared/services/api/items/ItemsService';
import { useDebounce } from '../../../../shared/hooks';
import { useField } from '@unform/core';

type TAutoCompleteItemOption = {
  id: number;
  label: string;
}

interface IAutoCompleteItemProps {
  isExternalLoading?: boolean;
  itemID: number;
}
export const AutoCompleteItem: React.FC<IAutoCompleteItemProps> = ({ isExternalLoading = false, itemID }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField('itemID');
  const { debounce } = useDebounce();

  const [selectedItemId, setSelectedItemId] = useState<number | undefined>(itemID || defaultValue);

  const [opcoesItem, setOpcoesItem] = useState<TAutoCompleteItemOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buscaItem, setBuscaItem] = useState('');

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectedItemId,
      setValue: (_, newSelectedItemID) => setSelectedItemId(newSelectedItemID),
    });
  }, [registerField, fieldName, selectedItemId]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      ItemsService.getAll(1, buscaItem, selectedItemId)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            // alert(result.message);
          } else {
            setOpcoesItem(result.data.map(item => ({ id: item.id, label: item.name })));
          }
        });
    });
  }, [buscaItem, selectedItemId]);

  const autoCompleteItemSelectedOption = useMemo(() => {
    if (!selectedItemId) return null;

    const selectedItemOption = opcoesItem.find(opcoesItem => opcoesItem.id === selectedItemId);
    if (!selectedItemOption) return null;

    return selectedItemOption;
  }, [selectedItemId, opcoesItem]);

  return (
    <Autocomplete
      openText='Abrir'
      closeText='Fechar'
      noOptionsText='Sem opções'
      loadingText='Carregando...'
    
      disablePortal
      options={opcoesItem}
      loading={isLoading}
      disabled={isExternalLoading}
      value={autoCompleteItemSelectedOption}
      onInputChange={(_, newValueItem) => setBuscaItem(newValueItem)}
      onChange={(_, newValueItem) => { setSelectedItemId(newValueItem?.id); setBuscaItem(''); clearError(); }}
      popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28} /> : undefined}
      renderInput={(paramsItem) => (
        <TextField
          variant="standard"
          {...paramsItem}
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};
