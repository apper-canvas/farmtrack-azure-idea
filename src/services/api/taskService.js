import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const taskService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('task_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('task_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  create: async (taskData) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('task_c', {
        records: [{
          Name: taskData.title_c,
          title_c: taskData.title_c,
          description_c: taskData.description_c || "",
          due_date_c: taskData.due_date_c,
          priority_c: taskData.priority_c,
          completed_c: false,
          completed_at_c: null,
          farm_id_c: taskData.farm_id_c ? parseInt(taskData.farm_id_c) : null,
          crop_id_c: taskData.crop_id_c ? parseInt(taskData.crop_id_c) : null
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
      console.error("Error creating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  update: async (id, taskData) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord('task_c', {
        records: [{
          Id: parseInt(id),
          Name: taskData.title_c,
          title_c: taskData.title_c,
          description_c: taskData.description_c || "",
          due_date_c: taskData.due_date_c,
          priority_c: taskData.priority_c,
          completed_c: taskData.completed_c !== undefined ? taskData.completed_c : false,
          completed_at_c: taskData.completed_at_c || null,
          farm_id_c: taskData.farm_id_c ? parseInt(taskData.farm_id_c) : null,
          crop_id_c: taskData.crop_id_c ? parseInt(taskData.crop_id_c) : null
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
      console.error("Error updating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  toggleComplete: async (id) => {
    try {
      const apperClient = getApperClient();
      
      // First get the current task
      const task = await taskService.getById(id);
      if (!task) return null;

      const newCompletedState = !task.completed_c;
      const response = await apperClient.updateRecord('task_c', {
        records: [{
          Id: parseInt(id),
          completed_c: newCompletedState,
          completed_at_c: newCompletedState ? new Date().toISOString() : null
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
          console.error(`Failed to toggle task completion:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error toggling task completion:", error?.response?.data?.message || error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('task_c', {
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
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  }
};
export default taskService;