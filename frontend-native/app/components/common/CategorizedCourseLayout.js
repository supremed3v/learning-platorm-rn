import { View, FlatList, ImageBackground } from "react-native";
import React from "react";
import { useSession } from "../../context/ctx";
import { Text } from "react-native-paper";

const Item = ({ item }) => {
  return (
    <View
      style={{
        borderRadius: 20,
      }}
    >
      <ImageBackground
        source={{ uri: item.poster.url }}
        style={{
          height: 200,
          width: 200,
          borderRadius: 20,
        }}
      >
        <Text>{item.title}</Text>
      </ImageBackground>
    </View>
  );
};

export default function CategorizedCourseLayout({ category }) {
  const { courses } = useSession();

  // Normalize the case of the category prop
  const normalizedCategory = category.toLowerCase();

  // Debugging: Log the normalized category
  console.log("normalized category:", normalizedCategory);

  // Filter courses by category
  const filteredCourses = courses?.filter((course) => {
    // Debugging: Log the category of each course
    console.log("course category:", course.category);

    // Normalize the case of the category property in courses
    const normalizedCourseCategory = course.category.toLowerCase();

    return normalizedCourseCategory === normalizedCategory;
  });

  // Debugging: Log the filtered courses
  console.log("filtered courses:", filteredCourses);

  return (
    <View>
      <Text>{category.name}</Text>
      <FlatList
        data={filteredCourses}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}
