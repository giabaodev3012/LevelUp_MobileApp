import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useUser from "@/hooks/auth/useUser";
import Loader from "@/components/loader/loader";
import CourseLesson from "@/components/courses/course.lesson";
import ReviewCard from "@/components/cards/review.card";

const { width } = Dimensions.get('window');

// Enhanced color palette with gradients and modern colors
const COLORS = {
  primary: "#2467EC",
  primaryLight: "#4A7FFF",
  primaryDark: "#1B4DB8",
  secondary: "#FFB013",
  secondaryLight: "#FFC547",
  accent: "#FF6B6B",
  accentLight: "#FF8E8E",
  dark: "#141517",
  lightBlue: "#E1E9F8",
  lightGray: "#F6F7F9",
  mediumGray: "#E5ECF9",
  darkGray: "#525258",
  gray: "#808080",
  lightText: "#6B7280",
  white: "#FFFFFF",
  black: "#000000",
  yellowStar: "#FFB800",
  success: "#10B981",
  cardBg: "#FAFBFC",
  shadow: "rgba(36, 103, 236, 0.15)",
};

const FONT_SIZES = {
  small: 14,
  medium: 15,
  large: 16,
  xLarge: 18,
  xxLarge: 20,
  xxxLarge: 22,
  hero: 24,
};

const SPACING = {
  xSmall: 3,
  small: 8,
  medium: 10,
  large: 16,
  xLarge: 25,
  xxLarge: 32,
};

const BORDER_RADIUS = {
  small: 3,
  medium: 4,
  large: 6,
  xLarge: 12,
  xxLarge: 16,
  pill: 50,
  extraPill: 54,
};

export default function CourseDetailScreen() {
  const [activeButton, setActiveButton] = useState("About");
  const { user, loading } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const { item } = useLocalSearchParams();
  const courseData = JSON.parse(item as string);
  const [checkPurchased, setCheckPurchased] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    if (user?.courses?.some((i: any) => i._id === courseData?._id)) {
      setCheckPurchased(true);
    }
  }, [user, courseData]);

  const handleAddToCart = async () => {
    const existingCartData = await AsyncStorage.getItem("cart");
    const cartData = existingCartData ? JSON.parse(existingCartData) : [];

    const itemExists = cartData.some(
      (cartItem: any) => cartItem._id === courseData._id
    );

    if (!itemExists) {
      cartData.push(courseData);
      await AsyncStorage.setItem("cart", JSON.stringify(cartData));
    }
    router.push("/(routes)/cart");
  };

  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          <Animated.ScrollView 
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {/* Hero Section with Parallax Effect */}
            <Animated.View style={[styles.heroSection, { opacity: headerOpacity }]}>
              <LinearGradient
                colors={['rgba(36, 103, 236, 0.1)', 'rgba(255, 176, 19, 0.05)']}
                style={styles.heroGradient}
              >
                <View style={styles.imageContainer}>
                  {/* Enhanced Badges */}
                  <View style={styles.badgeContainer}>
                    <LinearGradient
                      colors={[COLORS.secondary, COLORS.secondaryLight]}
                      style={styles.bestSellerBadge}
                    >
                      <Text style={styles.bestSellerText}>✨ Best Seller</Text>
                    </LinearGradient>
                    
                    <LinearGradient
                      colors={[COLORS.dark, '#2D2F33']}
                      style={styles.ratingBadge}
                    >
                      <FontAwesome name="star" size={FONT_SIZES.small} color={COLORS.yellowStar} />
                      <Text style={styles.ratingText}>{courseData?.ratings}</Text>
                    </LinearGradient>
                  </View>
                  
                  <Image
                    source={{ uri: courseData?.thumbnail.url! }}
                    style={styles.courseThumbnail}
                  />
                  
                  {/* Floating Card Overlay */}
                  <View style={styles.floatingCard}>
                    <LinearGradient
                      colors={[COLORS.white, COLORS.cardBg]}
                      style={styles.cardGradient}
                    >
                      <View style={styles.courseInfoRow}>
                        <View style={styles.studentsInfo}>
                          <Ionicons name="people" size={16} color={COLORS.primary} />
                          <Text style={styles.studentsText}>{courseData?.purchased}+ students</Text>
                        </View>
                        <View style={styles.lessonsInfo}>
                          <Ionicons name="play-circle" size={16} color={COLORS.success} />
                          <Text style={styles.lessonsText}>25 lessons</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
              {/* Enhanced Course Title Section */}
              <View style={styles.titleSection}>
                <Text style={styles.courseTitle}>{courseData?.name}</Text>
                
                {/* Price Section with Better Styling */}
                <View style={styles.priceSection}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.currentPrice}>${courseData?.price}</Text>
                    <Text style={styles.estimatedPrice}>${courseData?.estimatedPrice}</Text>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>
                        {Math.round(((courseData?.estimatedPrice - courseData?.price) / courseData?.estimatedPrice) * 100)}% OFF
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Enhanced Course Features */}
              <View style={styles.featuresSection}>
                <FeatureCard 
                  icon="checkmark-circle-outline" 
                  title="Prerequisites" 
                  items={courseData?.prerequisites}
                  color={COLORS.primary}
                />
                <FeatureCard 
                  icon="trophy-outline" 
                  title="What you'll learn" 
                  items={courseData?.benefits}
                  color={COLORS.success}
                />
              </View>

              {/* Enhanced Tab Navigation */}
              <View style={styles.tabContainer}>
                <LinearGradient
                  colors={[COLORS.lightBlue, COLORS.mediumGray]}
                  style={styles.tabBackground}
                >
                  {['About', 'Lessons', 'Reviews'].map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      style={[
                        styles.tabButton,
                        activeButton === tab && styles.tabButtonActive,
                      ]}
                      onPress={() => setActiveButton(tab)}
                      activeOpacity={0.8}
                    >
                      {activeButton === tab && (
                        <LinearGradient
                          colors={[COLORS.primary, COLORS.primaryLight]}
                          style={styles.tabGradient}
                        />
                      )}
                      <Text
                        style={[
                          styles.tabButtonText,
                          activeButton === tab && styles.tabButtonTextActive,
                        ]}
                      >
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </LinearGradient>
              </View>

              {/* Enhanced Content Sections */}
              <View style={styles.contentWrapper}>
                {activeButton === "About" && (
                  <View style={styles.aboutSection}>
                    <Text style={styles.sectionTitle}>About this course</Text>
                    <View style={styles.descriptionCard}>
                      <Text style={styles.contentDescription}>
                        {isExpanded
                          ? courseData?.description
                          : courseData?.description.slice(0, 302)}
                      </Text>
                      {courseData?.description.length > 302 && (
                        <TouchableOpacity
                          style={styles.readMoreButton}
                          onPress={() => setIsExpanded(!isExpanded)}
                          activeOpacity={0.7}
                        >
                          <LinearGradient
                            colors={[COLORS.primary, COLORS.primaryLight]}
                            style={styles.readMoreGradient}
                          >
                            <Text style={styles.readMoreButtonText}>
                              {isExpanded ? "Show Less" : "Show More"}
                            </Text>
                            <Ionicons 
                              name={isExpanded ? "chevron-up" : "chevron-down"} 
                              size={16} 
                              color={COLORS.white} 
                            />
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
                
                {activeButton === "Lessons" && (
                  <View style={styles.lessonsSection}>
                    <CourseLesson courseDetails={courseData} />
                  </View>
                )}
                
                {activeButton === "Reviews" && (
                  <View style={styles.reviewsSection}>
                    <Text style={styles.sectionTitle}>Student Reviews</Text>
                    <View style={styles.reviewsList}>
                      {courseData?.reviews?.map((item: any, index: number) => (
                        <ReviewCard item={item} key={index} />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </Animated.View>
          </Animated.ScrollView>

          {/* Enhanced Bottom Action Bar */}
          <View style={styles.bottomActionBar}>
            <LinearGradient
              colors={[COLORS.white, COLORS.cardBg]}
              style={styles.actionBarGradient}
            >
              {checkPurchased ? (
                <TouchableOpacity
                  style={styles.mainActionButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(routes)/course-access",
                      params: { courseData: JSON.stringify(courseData) },
                    })
                  }
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[COLORS.success, '#0EA66D']}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="play-circle" size={20} color={COLORS.white} />
                    <Text style={styles.mainActionButtonText}>Continue Learning</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.mainActionButton}
                  onPress={handleAddToCart}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryLight]}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="cart" size={20} color={COLORS.white} />
                    <Text style={styles.mainActionButtonText}>Add to Cart</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </LinearGradient>
          </View>
        </View>
      )}
    </>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  items: Array<{ title: string }>;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, items, color }) => (
  <View style={styles.featureCard}>
    <LinearGradient
      colors={[COLORS.white, COLORS.cardBg]}
      style={styles.featureCardGradient}
    >
      <View style={styles.featureHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.featureTitle}>{title}</Text>
      </View>
      <View style={styles.featureList}>
        {items?.slice(0, 3).map((item: any, index: number) => (
          <View key={index} style={styles.featureItem}>
            <View style={[styles.checkIcon, { backgroundColor: `${color}20` }]}>
              <Ionicons name="checkmark" size={12} color={color} />
            </View>
            <Text style={styles.featureItemText}>{item.title}</Text>
          </View>
        ))}
        {items?.length > 3 && (
          <Text style={styles.moreItemsText}>+{items.length - 3} more items</Text>
        )}
      </View>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },

  // Hero Section
  heroSection: {
    height: 320,
  },
  heroGradient: {
    flex: 1,
    paddingTop: SPACING.large,
  },
  imageContainer: {
    marginHorizontal: SPACING.large,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.small,
    paddingTop: SPACING.small,
  },
  bestSellerBadge: {
    borderRadius: BORDER_RADIUS.extraPill,
    paddingVertical: SPACING.small,
    paddingHorizontal: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bestSellerText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.small,
    fontFamily: "Nunito_600SemiBold",
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.large,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  ratingText: {
    color: COLORS.white,
    marginLeft: 4,
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_SIZES.small,
  },
  courseThumbnail: {
    width: "100%",
    height: 220,
    borderRadius: BORDER_RADIUS.xxLarge,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingCard: {
    position: 'absolute',
    bottom: -20,
    left: SPACING.large,
    right: SPACING.large,
    borderRadius: BORDER_RADIUS.xLarge,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cardGradient: {
    borderRadius: BORDER_RADIUS.xLarge,
    padding: SPACING.large,
  },
  courseInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  studentsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentsText: {
    marginLeft: 6,
    fontSize: FONT_SIZES.medium,
    fontFamily: "Nunito_600SemiBold",
    color: COLORS.primary,
  },
  lessonsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonsText: {
    marginLeft: 6,
    fontSize: FONT_SIZES.medium,
    fontFamily: "Nunito_600SemiBold",
    color: COLORS.success,
  },

  // Content Container
  contentContainer: {
    marginTop: SPACING.xxLarge,
    paddingBottom: 100,
  },

  // Title Section
  titleSection: {
    paddingHorizontal: SPACING.large,
    marginBottom: SPACING.xLarge,
  },
  courseTitle: {
    fontSize: FONT_SIZES.hero,
    fontFamily: "Raleway_700Bold",
    color: COLORS.dark,
    lineHeight: 32,
    marginBottom: SPACING.large,
  },
  priceSection: {
    marginTop: SPACING.medium,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  currentPrice: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.xxxLarge,
    fontFamily: "Raleway_700Bold",
    fontWeight: '700',
  },
  estimatedPrice: {
    color: COLORS.gray,
    fontSize: FONT_SIZES.xLarge,
    marginLeft: SPACING.medium,
    textDecorationLine: "line-through",
    fontFamily: "Nunito_500Medium",
  },
  discountBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.small,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.medium,
    marginLeft: SPACING.medium,
  },
  discountText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.small,
    fontFamily: "Nunito_600SemiBold",
    fontWeight: '600',
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: SPACING.large,
    marginBottom: SPACING.xLarge,
  },
  featureCard: {
    marginBottom: SPACING.large,
    borderRadius: BORDER_RADIUS.xxLarge,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureCardGradient: {
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.xxLarge,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  featureTitle: {
    fontSize: FONT_SIZES.xLarge,
    fontFamily: "Raleway_600SemiBold",
    marginLeft: SPACING.medium,
    color: COLORS.dark,
    fontWeight: '600',
  },
  featureList: {
    gap: SPACING.medium,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.medium,
  },
  featureItemText: {
    fontSize: FONT_SIZES.medium,
    fontFamily: "Nunito_500Medium",
    color: COLORS.darkGray,
    flex: 1,
  },
  moreItemsText: {
    fontSize: FONT_SIZES.small,
    fontFamily: "Nunito_600SemiBold",
    color: COLORS.primary,
    fontStyle: 'italic',
    marginTop: SPACING.small,
  },

  // Tab Navigation
  tabContainer: {
    marginHorizontal: SPACING.large,
    marginBottom: SPACING.xLarge,
    borderRadius: BORDER_RADIUS.extraPill,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabBackground: {
    flexDirection: "row",
    borderRadius: BORDER_RADIUS.extraPill,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
    borderRadius: BORDER_RADIUS.extraPill,
    alignItems: 'center',
    position: 'relative',
  },
  tabButtonActive: {
    elevation: 2,
  },
  tabGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BORDER_RADIUS.extraPill,
  },
  tabButtonText: {
    color: COLORS.darkGray,
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: COLORS.white,
  },

  // Content Sections
  contentWrapper: {
    paddingHorizontal: SPACING.large,
  },
  aboutSection: {
    marginBottom: SPACING.xLarge,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xLarge,
    fontFamily: "Raleway_700Bold",
    color: COLORS.dark,
    marginBottom: SPACING.large,
    fontWeight: '700',
  },
  descriptionCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxLarge,
    padding: SPACING.large,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contentDescription: {
    color: COLORS.lightText,
    fontSize: FONT_SIZES.medium,
    lineHeight: 24,
    textAlign: "justify",
    fontFamily: "Nunito_500Medium",
  },
  readMoreButton: {
    marginTop: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
  },
  readMoreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
    gap: SPACING.small,
  },
  readMoreButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontFamily: "Nunito_600SemiBold",
    fontWeight: '600',
  },
  lessonsSection: {
    marginBottom: SPACING.xLarge,
  },
  reviewsSection: {
    marginBottom: SPACING.xLarge,
  },
  reviewsList: {
    gap: SPACING.large,
  },

  // Bottom Action Bar
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  actionBarGradient: {
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.large,
    paddingBottom: SPACING.xLarge,
  },
  mainActionButton: {
    borderRadius: BORDER_RADIUS.xLarge,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.large,
    gap: SPACING.medium,
  },
  mainActionButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.large,
    fontFamily: "Nunito_700Bold",
    fontWeight: '700',
  },
});