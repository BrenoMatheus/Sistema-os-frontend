import { AxiosError } from 'axios';

import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IListOrders {
  id: number;
  type: string,
  defect: string,
  solution: string,
  status: boolean,
}

export interface IDetailOrder {
  id: number;
  equipmentID: number,
  technicianID: number,
  type: string,
  defect: string,
  causes: string,
  status: boolean,
  solution: string,
  date_init_os: Date,
  date_end_os?: Date | undefined,
  total: number,
}

type TOrdersTotalCount = {
  data: IListOrders[];
  totalCount: number;
}

const getAll = async (page = 1, filter = '', id = 0): Promise<TOrdersTotalCount | Error> => {
  try {
    const urlRelativa = `/orders?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}&id=${id}`;

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

const getById = async (id: number): Promise<IDetailOrder | Error> => {
  try {
    const { data } = await Api().get(`/orders/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetailOrder, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api().post<number>('/orders', dados);

    if (data) {
      return data;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: number, dados: IDetailOrder): Promise<void | Error> => {
  try {
    await Api().put(`/orders/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api().delete(`/orders/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao apagar o registro.');
  }
};


export const OrdersService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
