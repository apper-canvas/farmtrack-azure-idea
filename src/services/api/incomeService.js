import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const incomeService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('income_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "crop_id_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "price_per_unit_c"}},
          {"field": {"Name": "buyer_c"}},
          {"field": {"Name": "total_amount_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching income:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('income_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "crop_id_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "price_per_unit_c"}},
          {"field": {"Name": "buyer_c"}},
          {"field": {"Name": "total_amount_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching income ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  create: async (incomeData) => {
    try {
      const apperClient = getApperClient();
      const totalAmount = parseFloat(incomeData.quantity_c) * parseFloat(incomeData.price_per_unit_c);
      
      const response = await apperClient.createRecord('income_c', {
        records: [{
          Name: `${incomeData.buyer_c} - ${incomeData.quantity_c} units`,
          date_c: incomeData.date_c,
          crop_id_c: parseInt(incomeData.crop_id_c),
          quantity_c: parseFloat(incomeData.quantity_c),
          price_per_unit_c: parseFloat(incomeData.price_per_unit_c),
          buyer_c: incomeData.buyer_c,
          total_amount_c: totalAmount
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
      console.error("Error creating income:", error?.response?.data?.message || error);
      return null;
    }
  },

  update: async (id, incomeData) => {
    try {
      const apperClient = getApperClient();
      const totalAmount = parseFloat(incomeData.quantity_c) * parseFloat(incomeData.price_per_unit_c);
      
      const response = await apperClient.updateRecord('income_c', {
        records: [{
          Id: parseInt(id),
          Name: `${incomeData.buyer_c} - ${incomeData.quantity_c} units`,
          date_c: incomeData.date_c,
          crop_id_c: parseInt(incomeData.crop_id_c),
          quantity_c: parseFloat(incomeData.quantity_c),
          price_per_unit_c: parseFloat(incomeData.price_per_unit_c),
          buyer_c: incomeData.buyer_c,
          total_amount_c: totalAmount
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
      console.error("Error updating income:", error?.response?.data?.message || error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('income_c', {
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
      console.error("Error deleting income:", error?.response?.data?.message || error);
      return false;
    }
  }
};
export default incomeService;