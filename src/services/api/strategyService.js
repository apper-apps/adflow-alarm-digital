import { toast } from 'react-toastify';

const strategyService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "goal" } },
          { field: { Name: "allocated_budget" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "target_audience" } },
          { field: { Name: "kpi" } },
          { field: { Name: "client_id" } }
        ]
      };

      const response = await apperClient.fetchRecords('strategy', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching strategies:", error);
      toast.error("Failed to fetch strategies");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "goal" } },
          { field: { Name: "allocated_budget" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "target_audience" } },
          { field: { Name: "kpi" } },
          { field: { Name: "client_id" } }
        ]
      };

      const response = await apperClient.getRecordById('strategy', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching strategy with ID ${id}:`, error);
      toast.error("Failed to fetch strategy");
      return null;
    }
  },

  async getByClientId(clientId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "goal" } },
          { field: { Name: "allocated_budget" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "target_audience" } },
          { field: { Name: "kpi" } },
          { field: { Name: "client_id" } }
        ],
        where: [
          {
            FieldName: "client_id",
            Operator: "EqualTo",
            Values: [parseInt(clientId, 10)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('strategy', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching strategies by client ID:", error);
      toast.error("Failed to fetch strategies");
      return [];
    }
  },

  async create(strategyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: strategyData.Name,
          Tags: strategyData.Tags,
          Owner: strategyData.Owner,
          goal: strategyData.goal,
          allocated_budget: strategyData.allocated_budget,
          status: strategyData.status || 'Active',
          created_at: strategyData.created_at || new Date().toISOString(),
          target_audience: strategyData.target_audience,
          kpi: strategyData.kpi,
          client_id: strategyData.client_id
        }]
      };

      const response = await apperClient.createRecord('strategy', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} strategies:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Strategy created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating strategy:", error);
      toast.error("Failed to create strategy");
      return null;
    }
  },

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const params = {
        records: [{
          Id: parseInt(id, 10),
          Name: data.Name,
          Tags: data.Tags,
          Owner: data.Owner,
          goal: data.goal,
          allocated_budget: data.allocated_budget,
          status: data.status,
          created_at: data.created_at,
          target_audience: data.target_audience,
          kpi: data.kpi,
          client_id: data.client_id
        }]
      };

      const response = await apperClient.updateRecord('strategy', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} strategies:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Strategy updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating strategy:", error);
      toast.error("Failed to update strategy");
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await apperClient.deleteRecord('strategy', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} strategies:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Strategy deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting strategy:", error);
      toast.error("Failed to delete strategy");
      return false;
    }
  }
};

export default strategyService;