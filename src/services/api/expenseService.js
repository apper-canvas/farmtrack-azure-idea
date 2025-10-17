import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const expenseService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('expense_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching expenses:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('expense_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching expense ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  create: async (expenseData) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('expense_c', {
        records: [{
          Name: expenseData.description_c,
          date_c: expenseData.date_c,
          category_c: expenseData.category_c,
          amount_c: parseFloat(expenseData.amount_c),
          description_c: expenseData.description_c,
          farm_id_c: expenseData.farm_id_c ? parseInt(expenseData.farm_id_c) : null
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating expense:", error?.response?.data?.message || error);
      return null;
    }
  },

  update: async (id, expenseData) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord('expense_c', {
        records: [{
          Id: parseInt(id),
          Name: expenseData.description_c,
          date_c: expenseData.date_c,
          category_c: expenseData.category_c,
          amount_c: parseFloat(expenseData.amount_c),
          description_c: expenseData.description_c,
          farm_id_c: expenseData.farm_id_c ? parseInt(expenseData.farm_id_c) : null
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating expense:", error?.response?.data?.message || error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('expense_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting expense:", error?.response?.data?.message || error);
      return false;
    }
  }
};
export default expenseService;