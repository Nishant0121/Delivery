import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { useGlobalSearchParams } from "expo-router";

// Sample payment options
const paymentOptions = [
  { id: "1", label: "Credit/Debit Card" },
  { id: "2", label: "Net Banking" },
  { id: "3", label: "UPI" },
  { id: "4", label: "Cash on Delivery" },
];

const BuyProduct = () => {
  const { product } = useGlobalSearchParams();

  // Parse the product back into an object
  const parsedProduct = product ? JSON.parse(product) : null;

  // State for selected payment option
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);

  // Function to handle payment option selection
  const handlePayment = () => {
    if (!selectedPaymentOption) {
      Alert.alert(
        "No Payment Option Selected",
        "Please select a payment option."
      );
      return;
    }

    // Here you can handle the payment process
    Alert.alert(
      "Payment Successful",
      `You have selected ${selectedPaymentOption.label} for payment.`
    );
  };
  console.log(parsedProduct["Product Name"]);

  return (
    <View style={styles.container}>
      {parsedProduct ? (
        <>
          <Text style={styles.title}>Order Summary</Text>
          <Text style={styles.productName}>
            {parsedProduct["Product Name"]}
          </Text>
          <Text style={styles.price}>
            ${parseFloat(parsedProduct["Price"]).toFixed(2)}
          </Text>
          <Text style={styles.description}>{parsedProduct.description}</Text>

          {/* Payment Options */}
          <Text style={styles.paymentTitle}>Select Payment Method:</Text>
          {paymentOptions.map((option) => (
            <View key={option.id} style={styles.paymentOption}>
              <Button
                title={option.label}
                onPress={() => setSelectedPaymentOption(option)}
                color={
                  selectedPaymentOption?.id === option.id ? "blue" : "gray"
                }
              />
            </View>
          ))}

          {/* Checkout Button */}
          <Button title="Proceed to Payment" onPress={handlePayment} />
        </>
      ) : (
        <Text style={styles.error}>No product selected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  productName: {
    fontSize: 20,
    marginVertical: 10,
  },
  price: {
    fontSize: 20,
    color: "green",
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
  error: {
    fontSize: 18,
    color: "red",
  },
  paymentTitle: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold",
  },
  paymentOption: {
    marginVertical: 5,
  },
});

export default BuyProduct;
