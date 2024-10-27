import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import deliveryPartnersData from "../assets/pincode.json"; // Assume delivery partners data is stored here

const ProductDetails = () => {
  const { product } = useGlobalSearchParams();
  const router = useRouter();

  const [pincode, setPincode] = useState("");
  const [availablePartners, setAvailablePartners] = useState([]);
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const parsedProduct = product ? JSON.parse(product) : null;

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setHours(17, 0, 0, 0); // Set to 5 PM (17:00:00)

      // If it's already past 5 PM, set targetTime to 5 PM of the next day
      if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      // Calculate the difference in milliseconds
      const diff = targetTime - now;

      // Calculate hours, minutes, and seconds from the difference
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Update countdown state
      setCountdown({ hours, minutes, seconds });
    };

    // Initial countdown calculation
    updateCountdown();

    // Update countdown every second
    const interval = setInterval(updateCountdown, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (!parsedProduct) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Product not found</Text>
      </View>
    );
  }

  const handleAddToCart = async () => {
    try {
      const existingCart = await AsyncStorage.getItem("cart");
      const cart = existingCart ? JSON.parse(existingCart) : [];
      const existingProductIndex = cart.findIndex(
        (item) => item["Product ID"] === parsedProduct["Product ID"]
      );

      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
      } else {
        const productToAdd = { ...parsedProduct, quantity: 1 };
        cart.push(productToAdd);
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      console.log(
        `${parsedProduct["Product Name"]} added to cart. Current cart:`,
        cart
      );
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleCheckout = () => {
    if (!parsedProduct["inStock"]) {
      Alert.alert("Out of Stock", "Sorry, this product is out of stock.");
      return;
    }

    const pincodePattern = /^[1-9][0-9]{5}$/;

    if (!pincodePattern.test(pincode)) {
      Alert.alert("Invalid Pincode", "Please enter a valid 6-digit pincode.");
      return;
    }

    const partners = deliveryPartnersData[pincode] || [];
    setAvailablePartners(partners);

    if (partners.length === 0) {
      Alert.alert("Delivery Not Available", "Can't deliver to this pincode.");
    } else {
      // You could also fetch delivery estimates here
      const estimates = partners.map((partner) => getDeliveryEstimate(partner));
      console.log("Available partners and estimates:", estimates);
    }

    console.log("Proceeding with Pincode:", pincode);
  };

  const handleBuyNow = () => {
    if (pincode === "") {
      Alert.alert("Enter Pincode", "Please enter your pincode.");
      return;
    }
    router.push({
      pathname: "/BuyProduct",
      params: { product: JSON.stringify(parsedProduct) }, // Ensure the product is passed correctly
    });
  };

  const getDeliveryEstimate = (provider) => {
    // Mock delivery estimate; replace with actual logic
    return {
      message: `Estimated delivery by ${provider} in 2-3 days.`,
      cutoff: new Date(Date.now() + 48 * 60 * 60 * 1000), // Example cutoff in 48 hours
    };
  };

  return (
    <View style={styles.container}>
      {parsedProduct.image && (
        <Image
          source={{ uri: parsedProduct.image }}
          style={styles.productImage}
        />
      )}
      <Text style={styles.title}>{parsedProduct["Product Name"]}</Text>
      <Text style={styles.price}>
        ${parseFloat(parsedProduct["Price"]).toFixed(2)}
      </Text>
      <Text style={styles.description}>{parsedProduct.description}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your Pincode"
          value={pincode}
          onChangeText={setPincode}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.checkButton} onPress={handleCheckout}>
          <Text style={styles.checkButtonText}>Check</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional rendering of the countdown */}
      {availablePartners.includes("Provider A") && (
        <>
          <Text style={styles.countdown}>Deliver today if ordered in:</Text>
          <Text
            style={styles.countdown}
          >{`${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}</Text>
        </>
      )}

      {/* Show available partners if there are any */}
      {availablePartners.length > 0 && (
        <View style={styles.partnersContainer}>
          <Text style={styles.partnersTitle}>Available Delivery Partners:</Text>
          {availablePartners.map((partner, index) => (
            <Text key={index} style={styles.partnerName}>
              {partner}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cartbutton} onPress={handleAddToCart}>
          <Text style={styles.cartbuttonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleBuyNow}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
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
  price: {
    fontSize: 20,
    color: "green",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
  countdown: {
    fontSize: 18,
    marginVertical: 10,
    color: "blue", // Style the countdown text
  },
  error: {
    fontSize: 18,
    color: "red",
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  checkButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: "center",
  },
  checkButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#2a9d8f",
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cartbutton: {
    backgroundColor: "transparent",
    borderColor: "#2a9d8f",
    borderWidth: 2,
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cartbuttonText: {
    color: "#2a9d8f",
    fontWeight: "bold",
    fontSize: 16,
  },
  partnersContainer: {
    marginTop: 20,
  },
  partnersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  partnerName: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default ProductDetails;
