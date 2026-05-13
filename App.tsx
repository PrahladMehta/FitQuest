/**
 * Gym Tracker
 */

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddWorkoutScreen from './src/screens/AddWorkoutScreen';
import HomeScreen from './src/screens/HomeScreen';
import TrackerScreen from './src/screens/TrackerScreen';
import { colors } from './src/constants/theme';
import { WorkoutsProvider } from './src/context/WorkoutsContext';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
    notification: colors.accent,
  },
};

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <WorkoutsProvider>
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: colors.background },
              headerTitleStyle: { color: colors.text, fontWeight: '700' },
              headerTintColor: colors.text,
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Tracker"
              component={TrackerScreen}
              options={{ title: 'Tracker' }}
            />
            <Stack.Screen
              name="AddWorkout"
              component={AddWorkoutScreen}
              options={{ title: 'New Workout' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </WorkoutsProvider>
    </SafeAreaProvider>
  );
}

export default App;
