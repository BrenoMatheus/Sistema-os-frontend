import { AxiosError } from 'axios';

import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IListEquipment {
  id: number,
  name: string, 
  serieNumber: string, 
  type: string,
  description?: string,
}

export interface IDetailEquipment {
  id: number,
  name: string, 
  serieNumber: string, 
  type: string,
  description?: string,
}

type TEquipmentTotalCount = {
  data: IListEquipment[];
  totalCount: number;
}

const getAll = async (page = 1, filter = '', id = 0): Promise<TEquipmentTotalCount | Error> => {
  try {
    const urlRelativa = `/equipments?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}&id=${id}`;

    const { data, headers } = await Api().get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao listar os registros.');
  }
};

const getById = async (id: number): Promise<IDetailEquipment | Error> => {
  try {
    const { data } = await Api().get(`/equipments/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetailEquipment, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api().post<number>('/equipments', dados);

    if (data) {
      return data;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: number, dados: IDetailEquipment): Promise<void | Error> => {
  try {
    await Api().put(`/equipments/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api().delete(`/equipments/${id}`);
  } catch (error) {
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao apagar o registro.');
  }
};


export const EquipmentsService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
