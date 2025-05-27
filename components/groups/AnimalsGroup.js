import { FlatList, StyleSheet, Text, View } from "react-native";
import ModalDefaultNoValue from "../modals/common/ModalDefaultNoValue";
import AnimalCard from "../cards/AnimalCard";
import { Icon, useTheme } from "react-native-paper";
import Button from "../inputs/Button";

const AnimalsGroup = ({ group, userRole }) => {
    const { colors, fonts } = useTheme();

    const styles = StyleSheet.create({
        containerHeader:{
            paddingLeft: 20,
            flexDirection: "row",
            alignItems: "center",
        },
        title:{
            marginLeft: 5
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        }
    });

    return(
        <>
            {userRole === "manager" &&
                <View style={{ padding: 20}}>
                    <Button
                        type={"quaternary"}
                    >
                        <Text>Ajouter un animal</Text>
                    </Button>
                </View>
            }
            {userRole === "manager" && 
                <>
                    <View>
                        <View style={styles.containerHeader}>
                            <Icon source={"clock-outline"} size={20} color={colors.default_dark} />
                            <Text style={[styles.title, styles.textFontBold]}>Animaux en attente</Text>
                        </View>
                        <View>
                            <FlatList
                                data={group.pending_animals}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => <AnimalCard animal={item} animalState={"pending"} userRole={userRole} />}
                                contentContainerStyle={{ padding: 20 }}
                                ListEmptyComponent={
                                    <ModalDefaultNoValue
                                        text={"Aucun animal en attente"}
                                    />
                                }
                            />
                        </View>
                    </View>
                </>
            }
            <View>
                <View style={styles.containerHeader}>
                    <Icon source={"format-list-bulleted"} size={20} color={colors.default_dark} />
                    <Text style={[styles.title, styles.textFontBold]}>Animaux du groupe</Text>
                </View>
                <View>
                    <FlatList
                        data={group.animals}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <AnimalCard animal={item} animalState={"accepted"} userRole={userRole} />}
                        contentContainerStyle={{ padding: 20 }}
                        ListEmptyComponent={
                            <ModalDefaultNoValue
                                text={"Aucun animal dans le groupe"}
                            />
                        }
                    />
                </View>
            </View>
            

        </>
    );
}

export default AnimalsGroup;