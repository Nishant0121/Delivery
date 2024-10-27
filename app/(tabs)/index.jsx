import React, { useCallback } from "react";
import { StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import featuredProducts from "@/assets/product.json";

// Memoized Product Item Component
const ProductItem = React.memo(({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
});

export default function HomeScreen() {
  const router = useRouter();

  // Sample data for categories
  const categories = [
    { id: "1", title: "Furniture", icon: "https://via.placeholder.com/80" },
    { id: "2", title: "Clothing", icon: "https://via.placeholder.com/80" },
    { id: "3", title: "Electronics", icon: "https://via.placeholder.com/80" },
  ];

  // Callback for rendering category items
  const renderCategoryItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => alert(`Selected ${item.title}`)}
      >
        <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
        <Text style={styles.categoryText}>{item.title}</Text>
      </TouchableOpacity>
    ),
    []
  );

  // Callback for rendering product items
  const renderProductItem = useCallback(
    ({ item }) => {
      return (
        <ProductItem
          item={item}
          onPress={() =>
            router.push({
              pathname: "/ProductDetails",
              params: { product: JSON.stringify(item) }, // Stringify the product
            })
          }
        />
      );
    },
    [router]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          One Place To Shop All Your Essentials
        </Text>
      </View>

      <View style={styles.heroContainer}>
        <Image
          style={styles.heroImage}
          source={{
            uri: "https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWNvbW1lcmNlfGVufDB8fDB8fHww",
          }}
        />
      </View>

      <View style={styles.separator} />

      <Text style={styles.title}>Featured Products</Text>
      <FlatList
        data={featuredProducts.slice(0, 10)} // Only take the first 10 products
        horizontal
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productList}
      />
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6439FF",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4993FA",
    marginBottom: 10,
  },
  heroContainer: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  header: {
    alignItems: "start",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
  productList: {
    paddingTop: 5, // Minimal padding to reduce spacing
  },
  productCard: {
    width: 160,
    height: 240,
    borderRadius: 15,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  productImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    borderRadius: 10,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "100%",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 8,
  },
  productPrice: {
    fontSize: 16,
    color: "#2a9d8f",
  },
});
