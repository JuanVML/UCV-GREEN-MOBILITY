// frontend/src/components/MapButtons.tsx
import React from "react";
import { View, Button, StyleSheet } from "react-native";

type Props = {
  onRoute: () => void;
  onReturn: () => void;
  onSave: () => void;
};

export default function MapButtons({ onRoute, onReturn, onSave }: Props) {
  return (
    <View style={styles.container}>
      <Button title="Calcular Ruta" onPress={onRoute} />
      <Button title="Ruta de Retorno" onPress={onReturn} />
      <Button title="Guardar Ruta" onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
});
