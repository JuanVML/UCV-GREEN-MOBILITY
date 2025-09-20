import { useNavigation as useNav } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../navigation/types";

export function useNavigation() {
  return useNav<BottomTabNavigationProp<TabParamList>>();
}
