const API_BASE_URL = "http://10.188.135.75:3500/api/v1";

class PhotoUploadService {
  async uploadInspectionPhoto(inspectionId, photoUri) {
    try {
      // Create form data
      const formData = new FormData();
      
      const uriParts = photoUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
            formData.append('image', {
        uri: photoUri,
        name: `photo_${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      });

      const response = await fetch(
        `${API_BASE_URL}/core/site_inspection/upload/images/${inspectionId}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const result = await response.json();
      
      return {
        success: result.status || response.ok,
        data: result.data,
        message: result.msg || 'Photo uploaded successfully',
      };
    } catch (error) {
      console.error('Photo upload error:', error);
      return {
        success: false,
        message: error.message || 'Failed to upload photo',
      };
    }
  }

  async updateInspectionStatus(inspectionId, status) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/entity/site_inspection/update-status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            si_id: inspectionId,
            status: status,
          }),
        }
      );

      const result = await response.json();
      
      return {
        success: result.status || response.ok,
        message: result.msg || 'Status updated',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

export const photoUploadService = new PhotoUploadService();