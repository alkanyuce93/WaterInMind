import React, { AppRegistry } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/pages/home";
import Goal from "./src/pages/goal";
import { NavigationContainer } from "@react-navigation/native";

AppRegistry.registerComponent("WaterInMind", () => App);

export default function App() {
  const queryClient = new QueryClient();
  const Stack = createNativeStackNavigator();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="Home"
            component={Home}
          />
          <Stack.Screen name="Goal" component={Goal} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
