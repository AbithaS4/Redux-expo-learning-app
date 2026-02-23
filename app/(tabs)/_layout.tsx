import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="login" options={{ title: 'Login' }} />
      <Tabs.Screen name="topics" options={{ title: 'Topics' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="topic-details" options={{ href: null }} />
    </Tabs>
  );
}