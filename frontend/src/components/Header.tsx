// frontend/components/Header.tsx
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { fonts } from "../theme/fonts";
import { useAuth } from "../hooks/useAuth";

type Props = {
  onAvatarPress?: () => void;
  name?: string;
  date?: string;
};

export default function Header({
  onAvatarPress,
  name = "yam",
  date = "Mon 8 Sept",
}: Props) {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {/* fila superior: logo + avatar */}
      <View style={styles.topRow}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <TouchableOpacity onPress={onAvatarPress} style={styles.avatarWrap}>
          <Image
            source={
              user?.photoUrl
                ? { uri: user.photoUrl }
                : require("../../assets/images/avatar.png")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* fila inferior: saludo */}
      <View style={styles.greetingRow}>
        <Text style={styles.greeting}>Hola, {name}</Text>
        <Text style={styles.sub}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 22,
    paddingTop: 0,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 120,
    resizeMode: "contain",
    marginLeft: -25, // mueve el logo hacia la izquierda
  },
  avatarWrap: {
    marginRight: 4,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  greetingRow: {
    marginTop: -5,
  },
  greeting: {
    fontFamily: fonts.title,
    color: "#FFFFFF",
    fontSize: 25,
  },
  sub: {
    fontFamily: fonts.text,
    color: "#DDEDEB",
    fontSize: 15,
    marginTop: 4,
  },
});
