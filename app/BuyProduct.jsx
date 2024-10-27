import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useGlobalSearchParams } from "expo-router";

// Sample data for delivery partners based on pincodes
import deliveryPartners from "../assets/pincode.json";

const getDeliveryEstimate = (provider) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  // Calculate total minutes from the start of the day
  const totalMinutes = currentHour * 60 + currentMinutes;

  if (provider === "Provider A") {
    // Same-day delivery if ordered before 5 PM (17:00)
    if (totalMinutes < 17 * 60) {
      return {
        message: "Same-day delivery if ordered before 5 PM and in stock.",
        cutoff: new Date().setHours(17, 0, 0, 0), // 5 PM today
      };
    } else {
      return {
        message: "Next-day delivery.",
        cutoff: null,
      };
    }
  } else if (provider === "Provider B") {
    // Same-day delivery if ordered before 9 AM (09:00)
    if (totalMinutes < 9 * 60) {
      return {
        message: "Same-day delivery if ordered before 9 AM.",
        cutoff: new Date().setHours(9, 0, 0, 0), // 9 AM today
      };
    } else {
      return {
        message: "Next-day delivery.",
        cutoff: null,
      };
    }
  } else if (provider === "General Partners") {
    return {
      message: "Delivery within 2-5 days depending on the region.",
      cutoff: null,
    };
  }

  return {
    message: "Delivery estimate not available.",
    cutoff: null,
  };
};

const BuyProduct = () => {
  const { product } = useGlobalSearchParams();

  // Parse the product back into an object
  const parsedProduct = product ? JSON.parse(product) : null;

  // State for the pincode input
  const [pincode, setPincode] = useState("");
  const [availablePartners, setAvailablePartners] = useState([]);
  const [deliveryEstimates, setDeliveryEstimates] = useState([]);
  const [timers, setTimers] = useState({}); // Store timers for each partner

  useEffect(() => {
    // Update the timer every second if timers exist
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const updatedTimers = { ...prevTimers };

        Object.keys(prevTimers).forEach((provider) => {
          const cutoff = prevTimers[provider];
          if (cutoff) {
            const now = new Date();
            const timeRemaining = cutoff - now;

            // If the time is up, remove the timer
            if (timeRemaining <= 0) {
              delete updatedTimers[provider];
            } else {
              updatedTimers[provider] = timeRemaining; // Update remaining time
            }
          }
        });

        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval); // Clear the interval on unmount
  }, [timers]);

  const handleCheckout = () => {
    // Regex pattern for validating Indian pincode (6 digits)
    const pincodePattern = /^[1-9][0-9]{5}$/;

    // Check if the pincode matches the pattern
    if (!pincodePattern.test(pincode)) {
      Alert.alert("Invalid Pincode", "Please enter a valid 6-digit pincode.");
      return;
    }

    // Convert pincode to a number for comparison
    const pincodeNumber = parseInt(pincode, 10);

    // Check if the pincode is within the valid range
    if (pincodeNumber < 400001 || pincodeNumber > 400030) {
      Alert.alert("Delivery Not Available", "Can't deliver to this pincode.");
      return;
    }

    // Fetch delivery partners based on the pincode
    const partners = deliveryPartners[pincode] || [];
    setAvailablePartners(partners);

    // Calculate delivery estimates for the available partners
    const estimates = partners.map((provider) => {
      const { message, cutoff } = getDeliveryEstimate(provider);
      if (cutoff) {
        // Set the timer only if there's a cutoff time
        setTimers((prev) => ({ ...prev, [provider]: cutoff }));
      }
      return {
        provider,
        estimate: message,
        cutoff,
      };
    });
    setDeliveryEstimates(estimates);

    // Handle the checkout process here if pincode is valid
    console.log("Proceeding with Pincode:", pincode);
  };

  // Function to format the time remaining into hours, minutes, and seconds
  const formatTime = (time) => {
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <View style={styles.container}>
      {parsedProduct ? (
        <>
          <Text style={styles.title}>Order Summary</Text>
          <Text style={styles.productName}>{parsedProduct.name}</Text>
          <Text style={styles.price}>${parsedProduct.price.toFixed(2)}</Text>
          <Text style={styles.description}>{parsedProduct.description}</Text>

          {/* Pincode Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter your Pincode"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
          />

          {/* Checkout Button */}
          <Button title="Proceed to Checkout" onPress={handleCheckout} />

          {/* Available Partners with Delivery Estimates */}
          {deliveryEstimates.length > 0 && (
            <View style={styles.partnerContainer}>
              <Text style={styles.partnerTitle}>
                Available Delivery Partners:
              </Text>
              {deliveryEstimates.map(
                ({ provider, estimate, cutoff }, index) => (
                  <View key={index}>
                    <Text style={styles.partner}>
                      {provider}: {estimate}
                    </Text>
                    {/* Show timer if same-day delivery is available */}
                    {cutoff && timers[provider] && (
                      <Text style={styles.timer}>
                        Time remaining for same-day delivery:{" "}
                        {formatTime(timers[provider])}
                      </Text>
                    )}
                  </View>
                )
              )}
            </View>
          )}
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  partnerContainer: {
    marginTop: 20,
  },
  partnerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  partner: {
    fontSize: 16,
  },
  timer: {
    fontSize: 14,
    color: "blue",
    marginTop: 4,
  },
});

export default BuyProduct;
