import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        animation: 'shift',
        tabBarActiveTintColor: palette.tint,
        tabBarInactiveTintColor: '#94A3B8',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopWidth: 0,
          backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
          elevation: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="nearby-orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earn',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
