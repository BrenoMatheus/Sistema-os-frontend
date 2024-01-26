import { AxiosError } from 'axios';

import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IListItem {
  id: number,
  name: string, 
  price: number, 
  amount: number,
}

export interface IDetailItem {
  id: number,
  name: string, 
  price: number, 
  amount: number,
}

type TItemTotalCount = {
  data: IListItem[];
  totalCount: number;
}

const getAll = async (page = 1, filter = '', id = 0): Promise<TItemTotalCount | Error> => {
  try {
    const urlRelativa = `/items?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}&id=${id}`;

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

const getById = async (id: number): Promise<IDetailItem | Error> => {
  try {
    const { data } = await Api().get(`/items/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetailItem, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api().post<number>('/items', dados);

    if (data) {
      return data;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: number, dados: IDetailItem): Promise<void | Error> => {
  try {
    await Api().put(`/items/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api().delete(`/items/${id}`);
  } catch (error) {
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao apagar o registro.');
  }
};


export const ItemsService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
