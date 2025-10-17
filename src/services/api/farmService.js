import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const farmService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('farm_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "total_area_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching farms:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('farm_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "total_area_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  create: async (farmData) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('farm_c', {
        records: [{
          Name: farmData.name_c,
          name_c: farmData.name_c,
          location_c: farmData.location_c,
          total_area_c: parseFloat(farmData.total_area_c),
          unit_c: farmData.unit_c,
          notes_c: farmData.notes_c || ""
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
      console.error("Error creating farm:", error?.response?.data?.message || error);
      return null;
    }
  },

  update: async (id, farmData) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord('farm_c', {
        records: [{
          Id: parseInt(id),
          Name: farmData.name_c,
          name_c: farmData.name_c,
          location_c: farmData.location_c,
          total_area_c: parseFloat(farmData.total_area_c),
          unit_c: farmData.unit_c,
          notes_c: farmData.notes_c || ""
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
      console.error("Error updating farm:", error?.response?.data?.message || error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('farm_c', {
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
      console.error("Error deleting farm:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default farmService;