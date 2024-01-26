import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

import { TechniciansService } from '../../../shared/services/api/technicians/TechniciansService';
import { useDebounce } from '../../../shared/hooks';
import { useField } from '@unform/core';


type TAutoCompleteTechnicianOption = {
  id: number;
  label: string;
}

interface IAutoCompleteTechnicianProps {
  isExternalLoading?: boolean;
}
export const AutoCompleteTechnician: React.FC<IAutoCompleteTechnicianProps> = ({ isExternalLoading = false }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField('technicianID');
  const { debounce } = useDebounce();

  const [selectedTechnicianId, setSelectedTechnicianId] = useState<number | undefined>(defaultValue);

  const [opcoesTechnician, setOpcoesTechnician] = useState<TAutoCompleteTechnicianOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buscaTechnician, setBuscaTechnician] = useState('');

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectedTechnicianId,
      setValue: (_, newSelectedTechnicianID) => setSelectedTechnicianId(newSelectedTechnicianID),
    });
  }, [registerField, fieldName, selectedTechnicianId]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      TechniciansService.getAll(1, buscaTechnician, selectedTechnicianId)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            // alert(result.message);
          } else {
            setOpcoesTechnician(result.data.map(technician => ({ id: technician.id, label: technician.name })));
          }
        });
    });
  }, [buscaTechnician, selectedTechnicianId]);

  const autoCompleteTechnicianSelectedOption = useMemo(() => {
    if (!selectedTechnicianId) return null;

    const selectedTechnicianOption = opcoesTechnician.find(opcoesTechnician => opcoesTechnician.id === selectedTechnicianId);
    if (!selectedTechnicianOption) return null;

    return selectedTechnicianOption;
  }, [selectedTechnicianId, opcoesTechnician]);


  return (
    <Autocomplete
      openText='Abrir'
      closeText='Fechar'
      noOptionsText='Sem opções'
      loadingText='Carregando...'
    
      disablePortal
      options={opcoesTechnician}
      loading={isLoading}
      disabled={isExternalLoading}
      value={autoCompleteTechnicianSelectedOption}
      onInputChange={(_, newValueTechnician) => setBuscaTechnician(newValueTechnician)}
      onChange={(_, newValueTechnician) => { setSelectedTechnicianId(newValueTechnician?.id); setBuscaTechnician(''); clearError(); }}
      popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28} /> : undefined}
      renderInput={(paramsTechnician) => (
        <TextField
          {...paramsTechnician}
          label="Técnico"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};
