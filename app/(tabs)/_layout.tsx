import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenListeners={{
        beforeRemove: () => {
          // Prevent default behavior of leaving the screen
          return false;
        },
      }}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "#4993FA",
        tabBarInactiveTintColor: "#000",
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Go Store",

          headerStyle: {
            backgroundColor: "#4993FA",
            elevation: 4,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="allProducts"
        options={{
          title: "All Products",
          headerStyle: {
            backgroundColor: "#4993FA",
            elevation: 4,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Your Cart",
          headerStyle: {
            backgroundColor: "#4993FA",
            elevation: 4,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },

          tabBarIcon: ({ color }) => (
            <FontAwesome name="cart-plus" size={25} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
