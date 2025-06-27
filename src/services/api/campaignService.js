import { toast } from 'react-toastify';
import strategyService from "@/services/api/strategyService";

const campaignService = {
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
          { field: { Name: "strategy_id" } },
          { field: { Name: "platform" } },
          { field: { Name: "budget" } },
          { field: { Name: "spent" } },
          { field: { Name: "status" } },
          { field: { Name: "start_date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "impressions" } },
          { field: { Name: "clicks" } },
          { field: { Name: "conversions" } }
        ]
      };

      const response = await apperClient.fetchRecords('campaign', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to fetch campaigns");
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
          { field: { Name: "strategy_id" } },
          { field: { Name: "platform" } },
          { field: { Name: "budget" } },
          { field: { Name: "spent" } },
          { field: { Name: "status" } },
          { field: { Name: "start_date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "impressions" } },
          { field: { Name: "clicks" } },
          { field: { Name: "conversions" } }
        ]
      };

      const response = await apperClient.getRecordById('campaign', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching campaign with ID ${id}:`, error);
      toast.error("Failed to fetch campaign");
      return null;
    }
  },

  async getByClientId(clientId) {
    try {
      const strategies = await strategyService.getByClientId(clientId);
      const strategyIds = strategies.map(s => s.Id);
      
      if (strategyIds.length === 0) {
        return [];
      }

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
          { field: { Name: "strategy_id" } },
          { field: { Name: "platform" } },
          { field: { Name: "budget" } },
          { field: { Name: "spent" } },
          { field: { Name: "status" } },
          { field: { Name: "start_date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "impressions" } },
          { field: { Name: "clicks" } },
          { field: { Name: "conversions" } }
        ],
        where: [
          {
            FieldName: "strategy_id",
            Operator: "ExactMatch",
            Values: strategyIds
          }
        ]
      };

      const response = await apperClient.fetchRecords('campaign', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching campaigns by client ID:', error);
      toast.error("Failed to fetch campaigns");
      return [];
    }
  },

  async getByStrategyId(strategyId) {
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
          { field: { Name: "strategy_id" } },
          { field: { Name: "platform" } },
          { field: { Name: "budget" } },
          { field: { Name: "spent" } },
          { field: { Name: "status" } },
          { field: { Name: "start_date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "impressions" } },
          { field: { Name: "clicks" } },
          { field: { Name: "conversions" } }
        ],
        where: [
          {
            FieldName: "strategy_id",
            Operator: "EqualTo",
            Values: [parseInt(strategyId, 10)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('campaign', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching campaigns by strategy ID:", error);
      toast.error("Failed to fetch campaigns");
      return [];
    }
  },

  async create(campaignData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: campaignData.Name,
          Tags: campaignData.Tags,
          Owner: campaignData.Owner,
          strategy_id: campaignData.strategy_id,
          platform: campaignData.platform,
          budget: campaignData.budget,
          spent: campaignData.spent || 0,
          status: campaignData.status || 'Active',
          start_date: campaignData.start_date,
          end_date: campaignData.end_date,
          impressions: campaignData.impressions || 0,
          clicks: campaignData.clicks || 0,
          conversions: campaignData.conversions || 0
        }]
      };

      const response = await apperClient.createRecord('campaign', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} campaigns:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Campaign created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
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
          strategy_id: data.strategy_id,
          platform: data.platform,
          budget: data.budget,
          spent: data.spent,
          status: data.status,
          start_date: data.start_date,
          end_date: data.end_date,
          impressions: data.impressions,
          clicks: data.clicks,
          conversions: data.conversions
        }]
      };

      const response = await apperClient.updateRecord('campaign', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} campaigns:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Campaign updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Failed to update campaign");
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

      const response = await apperClient.deleteRecord('campaign', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} campaigns:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Campaign deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
      return false;
    }
  }
};

export default campaignService;