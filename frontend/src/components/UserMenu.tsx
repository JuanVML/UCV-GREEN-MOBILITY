import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function UserMenu({ visible, onClose }: Props) {
  const navigation = useNavigation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.menu}>
          {/* Opción Ver perfil */}
          <TouchableOpacity
            onPress={() => {
              onClose();
              navigation.navigate("Profile" as never); // 🔹 Navega a pantalla perfil
            }}
          >
            <Text style={styles.option}>ver perfil</Text>
          </TouchableOpacity>

          {/* Opción Modo oscuro */}
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.option}>modo oscuro</Text>
          </TouchableOpacity>

          {/* Opción Salir */}
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.option}>salir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginTop: 50,
    marginRight: 10,
  },
  menu: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    width: 150,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    padding: 10,
    fontSize: 14,
    textAlign: "center",
  },
});
