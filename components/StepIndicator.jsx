import React from "react";
import { View, StyleSheet } from "react-native";

const StepIndicator = ({ currentStep, totalSteps = 3 }) => {
  return (
    <View style={styles.container}>
      {[...Array(totalSteps)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.step,
            index === currentStep - 1 ? styles.activeStep : styles.inactiveStep,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  step: {
    width: 30,
    height: 4,
    marginHorizontal: 5,
    borderRadius: 2,
  },
  activeStep: {
    backgroundColor: "#3B82F6", // Active step color (blue)
  },
  inactiveStep: {
    backgroundColor: "#D1D5DB", // Inactive step color (gray)
  },
});

export default StepIndicator;
