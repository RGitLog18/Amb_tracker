import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Navigation type
type RootStackParamList = {
  RoleSelection: undefined;
  HospitalRegistration: undefined;
  HospitalDashboard: undefined;
  OtherRole: { role: string };
};
type HospitalRegistrationNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'HospitalRegistration'
>;

const HospitalRegistration: React.FC = () => {
  const navigation = useNavigation<HospitalRegistrationNavProp>();

  type FormDataType = {
    name: string;
    address: string;
  };

  const [form, setForm] = useState<FormDataType>({ name: '', address: '' });
  const [file, setFile] = useState<any>({});

  // Request storage permission on Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const getFileUri = (uri: string) => {
    if (Platform.OS === 'android') return uri.startsWith('file://') ? uri : `file://${uri}`;
    return uri; // iOS works fine
  };

  const pickImage = async (key: string) => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
      if (result.assets && result.assets.length > 0) {
        // result.assets is an array of selected images/files returned by launchImageLibrary
        // Each asset contains properties like uri, fileName, type, etc.
        const asset = result.assets[0];
        setFile((prev: any) => ({ ...prev, [key]: asset }));
        Alert.alert('Image Selected', result.assets[0].fileName || 'Image selected');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    if (
      !form.name.trim() ||
      !form.address.trim() ||
      !file.hospitalCert ||
      !file.ambulanceLicense ||
      !file.fireNOC ||
      !file.biomedicalAuth ||
      !file.serviceAgreement
    ) {
      Alert.alert('Error', 'Please fill all fields and select all required documents.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('address', form.address);

    const fileKeys = [
      'hospitalCert',
      'ambulanceLicense',
      'fireNOC',
      'biomedicalAuth',
      'serviceAgreement',
    ];

    fileKeys.forEach(key => {
      const f = file[key];
      if (f) {
        formData.append(key, {
          uri: getFileUri(f.uri),
          type: f.type || 'image/jpeg',
          name: f.fileName || `${key}.jpg`,
        } as any);
      }
    });

    try {
      await axios({
        method: 'post',
        url: 'https://amb-tracker.onrender.com/upload',
        data: formData,
        headers: { Accept: 'application/json' },
      });
      Alert.alert('Success', 'Form submitted successfully!');
      setForm({ name: '', address: '' });
      setFile({});
      navigation.navigate('HospitalDashboard');
    } catch (error: any) {
      console.log('Submit Error:', error.response || error.message || error);
      Alert.alert('Error', 'Failed to submit form.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hospital Registration</Text>

      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={text => handleChange('name', text)}
      />

      <Text style={styles.label}>Address:</Text>
      {[0, 1, 2].map(i => (
        <TextInput
          key={i}
          style={styles.input}
          placeholder={`Line ${i + 1}`}
          value={form.address.split('\n')[i] || ''}
          onChangeText={text => {
            const lines = form.address.split('\n');
            lines[i] = text;
            handleChange('address', lines.join('\n'));
          }}
        />
      ))}

      {[
        { key: 'hospitalCert', label: 'Hospital Certificate' },
        { key: 'ambulanceLicense', label: 'Ambulance License' },
        { key: 'fireNOC', label: 'Fire NOC' },
        { key: 'biomedicalAuth', label: 'Biomedical Authorization' },
        { key: 'serviceAgreement', label: 'Service Agreement' },
      ].map(item => (
        <View key={item.key} style={styles.fileContainer}>
          <Text style={styles.label}>{item.label}:</Text>
          <Button
            title={file[item.key] ? 'Change Selected Image' : 'Select Image'}
            color="#b94141ff"
            onPress={() => pickImage(item.key)}
          />
        </View>
      ))}

      <View style={styles.submitButton}>
        <Button title="Submit" color="#b94141ff" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  fileContainer: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 20,
    width: '50%',
    alignSelf: 'center',
    borderRadius: 6,
    overflow: 'hidden',
  },
});

export default HospitalRegistration;
