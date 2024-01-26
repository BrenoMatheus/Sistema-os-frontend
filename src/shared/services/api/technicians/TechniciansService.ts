import { AxiosError } from 'axios';

import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IListTechnician {
  id: number,
  name: string,
  email: string,
  category: string,
  description?: string,
}

export interface IDetailTechnician {
  id: number,
  name: string,
  email: string,
  category: string,
  description?: string,
}

type TTechnicianTotalCount = {
  data: IListTechnician[];
  totalCount: number;
}

const getAll = async (page = 1, filter = '', id = 0): Promise<TTechnicianTotalCount | Error> => {
  try {
    const urlRelativa = `/technicians?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}&id=${id}`;

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

const getById = async (id: number): Promise<IDetailTechnician | Error> => {
  try {
    const { data } = await Api().get(`/technicians/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetailTechnician, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api().post<number>('/technicians', dados);

    if (data) {
      return data;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: number, dados: IDetailTechnician): Promise<void | Error> => {
  try {
    await Api().put(`/technicians/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api().delete(`/technicians/${id}`);
  } catch (error) {
    return new Error((error as AxiosError).response?.data.errors.default || 'Erro ao apagar o registro.');
  }
};


export const TechniciansService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
