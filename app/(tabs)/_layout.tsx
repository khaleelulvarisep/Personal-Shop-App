import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSegments } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppHeader } from '@/components/app-header';

const TITLE_BY_TAB: Record<string, string> = {
  home: 'Home',
  'nearby-orders': 'Orders',
  earnings: 'Earn',
  tracking: 'Tracking',
};

function isKnownTabSegment(
  segment: string | undefined
): segment is keyof typeof TITLE_BY_TAB {
  return !!segment && Object.prototype.hasOwnProperty.call(TITLE_BY_TAB, segment);
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const segments = useSegments();
  const segmentStrings = segments.map((s) => (typeof s === 'string' ? s : String(s)));

  const tabSegment = (() => {
    const last = segmentStrings[segmentStrings.length - 1];
    if (isKnownTabSegment(last)) return last;

    const tabsIdx = segmentStrings.indexOf('(tabs)');
    const next = tabsIdx >= 0 ? segmentStrings[tabsIdx + 1] : undefined;
    return isKnownTabSegment(next) ? next : undefined;
  })();

  const title = tabSegment ? TITLE_BY_TAB[tabSegment] : 'Delivery';

  return (
    <View style={styles.shell}>
      <AppHeader title={title} />
      <View style={styles.tabs}>
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
            name="home"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="nearby-orders"
            options={{
              title: 'Orders',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="earnings"
            options={{
              title: 'Earn',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="paperplane.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="tracking"
            options={{
              title: 'Tracking',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabs: {
    flex: 1,
  },
});
