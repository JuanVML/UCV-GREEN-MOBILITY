// frontend/src/components/SavedRoutes.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

type Route = {
  id: number;
  distance: string;
  duration: string;
};

type Props = {
  routes: Route[];
};

export default function SavedRoutes({ routes }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rutas guardadas:</Text>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.distance} - {item.duration}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});
