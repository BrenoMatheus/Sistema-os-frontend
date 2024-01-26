import { AxiosError } from 'axios';

import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IListItemofLine {
  id: number,
  orderID: number,
  itemID: number,
  amount: number,
  total: number,
}

export interface IDetailItemofLine {
  id: number,
  orderID: number,
  itemID: number,
  amount: number,
  total: number,
}

type TItemofLineTotalCount = {
  data: IListItemofLine[];
  totalCount: number;
}

const getAll = async (page = 1, filter = '', id = 0): Promise<TItemofLineTotalCount | Error> => {
  try {
    const urlRelativa = `/itemofLines?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}&id=${id}`;

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

const getById = async (id: number): Promise<IDetailItemofLine | Error> => {
  try {
    const { data } = await Api().get(`/itemofLines/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetailItemofLine, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api().post<number>('/itemofLines', dados);

    if (data) {
      return data;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: number, dados: IDetailItemofLine): Promise<void | Error> => {
  try {
    await Api().put(`/itemofLines/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api().delete(`/itemofLines/${id}`);
  } catch (error) {
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao apagar o registro.');
  }
};


export const ItemofLinesService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
