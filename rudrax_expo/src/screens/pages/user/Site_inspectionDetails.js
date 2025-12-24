import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { photoUploadService } from '../../../services/siteInspection/photoUploadService';
import { COLORS } from '../../../theme/colors';
import { SPACING } from '../../../theme/spacing';
import { TYPOGRAPHY } from '../../../theme/typography';

export const InspectionDetailsScreen = ({ route, navigation }) => {
  const { inspection } = route.params;
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [hasPhotos, setHasPhotos] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'rejected':
        return COLORS.error;
      case 'completed':
        return COLORS.primary;
      default:
        return COLORS.inactive;
    }
  };

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!cameraPermission.granted || !galleryPermission.granted) {
      Alert.alert(
        'Permissions Required',
        'Camera and gallery permissions are needed to take and upload photos.'
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.8,
            });

            if (!result.canceled) {
              handlePhotoSelected(result.assets[0]);
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.8,
            });

            if (!result.canceled) {
              handlePhotoSelected(result.assets[0]);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handlePhotoSelected = async (photo) => {
    setPhotos([...photos, { uri: photo.uri, uploaded: false }]);
    
    // Upload photo
    setUploading(true);
    const result = await photoUploadService.uploadInspectionPhoto(
      inspection.si_id,
      photo.uri
    );
    setUploading(false);

    if (result.success) {
      Alert.alert('Success', 'Photo uploaded successfully!');
      setPhotos(prev => 
        prev.map(p => p.uri === photo.uri ? { ...p, uploaded: true } : p)
      );
      setHasPhotos(true);
    } else {
      Alert.alert('Upload Failed', result.message);
      // Remove failed photo
      setPhotos(prev => prev.filter(p => p.uri !== photo.uri));
    }
  };

  const markAsCompleted = async () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'Please upload at least one photo before marking as completed.');
      return;
    }

    Alert.alert(
      'Mark as Completed',
      'Are you sure you want to mark this inspection as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const result = await photoUploadService.updateInspectionStatus(
              inspection.si_id,
              'completed'
            );

            if (result.success) {
              Alert.alert('Success', 'Inspection marked as completed!', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Error', result.message);
            }
          },
        },
      ]
    );
  };

  const statusColor = getStatusColor(inspection.status);

  const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailLabel}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Text style={styles.valueText}>{value || 'Not set'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {inspection.status?.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.title}>Inspection #{inspection.si_id}</Text>
          <Text style={styles.subtitle}>Project ID: {inspection.project_id}</Text>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inspection Details</Text>
          
          <DetailRow
            icon="calendar"
            label="Inspection Date"
            value={formatDate(inspection.si_date)}
          />
          <DetailRow
            icon="location"
            label="Location"
            value={inspection.si_location}
          />
          <DetailRow
            icon="list"
            label="Type"
            value={inspection.si_type}
          />
          <DetailRow
            icon="person"
            label="Assigned ID"
            value={inspection.si_asign_id?.toString()}
          />
        </View>

        {/* Photo Section */}
        <View style={styles.card}>
          <View style={styles.photoHeader}>
            <Text style={styles.cardTitle}>Site Photos</Text>
            <View style={styles.photoCount}>
              <Ionicons name="images" size={16} color={COLORS.primary} />
              <Text style={styles.photoCountText}>{photos.length}</Text>
            </View>
          </View>

          {photos.length > 0 && (
            <View style={styles.photoGrid}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                  {photo.uploaded && (
                    <View style={styles.uploadedBadge}>
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                    </View>
                  )}
                  {!photo.uploaded && uploading && (
                    <View style={styles.uploadingOverlay}>
                      <ActivityIndicator color="#fff" />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity 
            style={styles.addPhotoButton}
            onPress={takePhoto}
            disabled={uploading}
          >
            <Ionicons name="camera" size={24} color={COLORS.primary} />
            <Text style={styles.addPhotoText}>
              {uploading ? 'Uploading...' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timestamps Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Timestamps</Text>
          
          <DetailRow
            icon="time"
            label="Created At"
            value={formatDate(inspection.created_at)}
          />
          <DetailRow
            icon="refresh"
            label="Updated At"
            value={formatDate(inspection.updated_at)}
          />
        </View>

        {/* Action Buttons */}
        {inspection.status !== 'completed' && (
          <View style={styles.actionsCard}>
            <TouchableOpacity 
              style={[styles.completeButton, photos.length === 0 && styles.buttonDisabled]}
              onPress={markAsCompleted}
              disabled={photos.length === 0}
            >
              <Ionicons name="checkmark-done" size={24} color="#fff" />
              <Text style={styles.completeButtonText}>Mark as Completed</Text>
            </TouchableOpacity>
          </View>
        )}

        {inspection.status === 'completed' && (
          <View style={styles.completedBanner}>
            <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
            <Text style={styles.completedText}>Inspection Completed</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerCard: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  statusText: {
    ...TYPOGRAPHY.small,
    fontWeight: 'bold',
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: '#fff',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: '#fff',
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  detailRow: {
    marginBottom: SPACING.lg,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  labelText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    fontWeight: '600',
  },
  valueText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginLeft: 28,
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  photoCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  photoCountText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  photoContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  uploadedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: SPACING.lg,
  },
  addPhotoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  actionsCard: {
    margin: SPACING.md,
  },
  completeButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.success,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: COLORS.inactive,
    opacity: 0.5,
  },
  completeButtonText: {
    ...TYPOGRAPHY.body,
    color: '#fff',
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success + '15',
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 12,
  },
  completedText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.success,
    marginLeft: SPACING.md,
  },
});