import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { ColorPicker } from 'react-native-color-picker';

const SettingsScreen = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [themeColor, setThemeColor] = React.useState('#1E88E5');

  const handleColorChange = (color) => {
    setThemeColor(color);
    document.documentElement.style.setProperty('--theme-color', color);
    document.documentElement.style.setProperty('--theme-color-light', lighten(color, 20));
    document.documentElement.style.setProperty('--theme-color-dark', darken(color, 20));
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Theme Color</Text>
          <ColorPicker
            onColorSelected={handleColorChange}
            style={{ flex: 1, height: 200 }}
            defaultColor={themeColor}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]}>
          <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
  },
  logoutText: {
    color: '#fff',
  },
});

export default SettingsScreen; 