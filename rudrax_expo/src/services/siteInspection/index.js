import apiService from '../apiService';

class SiteInspectionService {
  async getAllInspections() {
    try {
      const response = await apiService.get('/entity/site_inspection/readAll');
      return {
        success: response.status,
        data: response.data || [],
        message: response.msg,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.message,
      };
    }
  }

  async getInspectionById(id) {
    try {
      const response = await apiService.get(`/entity/site_inspection/${id}`);
      return {
        success: response.status,
        data: response.data,
        message: response.msg,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }

  async createInspection(data) {
    try {
      const response = await apiService.post('/entity/site_inspection/create', data);
      return {
        success: response.status,
        data: response.data,
        message: response.msg,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }

  async updateInspection(id, data) {
    try {
      const response = await apiService.put(`/entity/site_inspection/update/${id}`, data);
      return {
        success: response.status,
        data: response.data,
        message: response.msg,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }

  async deleteInspection(id) {
    try {
      const response = await apiService.delete(`/entity/site_inspection/delete/${id}`);
      return {
        success: response.status,
        message: response.msg,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

export const siteInspectionService = new SiteInspectionService();