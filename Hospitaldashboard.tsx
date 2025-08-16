import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

type Ambulance = {
    id: number;
    name: string;
    status: string;
    location: string;
};

type Profile = {
    hospitalName: string;
    address: string;
    contact: string;
};

const ambulanceData: Ambulance[] = [
    { id: 1, name: 'Ambulance A', status: 'Available', location: 'Sector 12' },
    { id: 2, name: 'Ambulance B', status: 'Available', location: 'Sector 5' },
    { id: 3, name: 'Ambulance C', status: 'On Duty', location: 'Sector 8' },
];

const profileData: Profile = {
    hospitalName: 'City Hospital',
    address: '123 Main St, Metro City',
    contact: '0123-456789',
};

const HospitalDashboard: React.FC = () => {
    const [view, setView] = useState<'profile' | 'ambulances' | null>(null);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Hospital Dashboard</Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={() => setView('profile')}>
                    <Text style={styles.buttonText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setView('ambulances')}>
                    <Text style={styles.buttonText}>View Ambulance Data</Text>
                </TouchableOpacity>
            </View>

            {view === 'profile' && (
                <View style={styles.card}>
                    <Text style={styles.subHeader}>Hospital Profile</Text>
                    <Text style={styles.label}>
                        Name: <Text style={styles.value}>{profileData.hospitalName}</Text>
                    </Text>
                    <Text style={styles.label}>
                        Address: <Text style={styles.value}>{profileData.address}</Text>
                    </Text>
                    <Text style={styles.label}>
                        Contact: <Text style={styles.value}>{profileData.contact}</Text>
                    </Text>
                </View>
            )}

            {view === 'ambulances' && (
                <View style={styles.card}>
                    <Text style={styles.subHeader}>Available Ambulances</Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCellHeader}>ID</Text>
                        <Text style={styles.tableCellHeader}>Name</Text>
                        <Text style={styles.tableCellHeader}>Status</Text>
                        <Text style={styles.tableCellHeader}>Location</Text>
                    </View>
                    {ambulanceData
                        .filter(a => a.status === 'Available')
                        .map(a => (
                            <View key={a.id} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{a.id}</Text>
                                <Text style={styles.tableCell}>{a.name}</Text>
                                <Text style={styles.tableCell}>{a.status}</Text>
                                <Text style={styles.tableCell}>{a.location}</Text>
                            </View>
                        ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        maxWidth: 600,
        alignSelf: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        marginBottom: 16,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 6,
        marginHorizontal: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    card: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fafafa',
    },
    subHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 6,
    },
    value: {
        fontWeight: 'normal',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingBottom: 6,
        marginBottom: 6,
    },
    tableCellHeader: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 16,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingVertical: 6,
    },
    tableCell: {
        flex: 1,
        fontSize: 15,
    },
});

export default HospitalDashboard;