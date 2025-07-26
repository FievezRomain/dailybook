import { FlatList, StyleSheet, Text, View } from "react-native";
import ModalDefaultNoValue from "../modals/common/ModalDefaultNoValue";
import AnimalCard from "../cards/AnimalCard";
import { Icon, useTheme } from "react-native-paper";
import { useAnimaux } from "../../contexts/AnimauxProvider";

const AnimalsGroup = ({ animals, userRole, group }) => {
    const { colors, fonts } = useTheme();
    const { animaux } = useAnimaux();

    const areMyAnimalsWaiting = () => {
        if( animals.type === "pending" && animals !== undefined ){
            const pendingAnimalsIds = animals.items
                .map((item) => item.id);
            
            return animaux.some(animal => pendingAnimalsIds.includes( animal.id ) );
        } else{
            return false;
        }
    }

    const canSeePendingAnimals = () => {
        if( userRole === "manager" && animals !== undefined && animals.type === "pending" ){
            return true;
        } else {
            return areMyAnimalsWaiting();
        }
    }

    const getPendingAnimalsICanSee = () => {
        if( userRole === "manager"){
            return animals.items;
        } else{
            const pendingAnimalsIds = animals.items
                .map((item) => item.id);

            return animals.items.filter(animal => pendingAnimalsIds.includes( animal.id ));
        }
    }

    const styles = StyleSheet.create({
        containerHeader:{
            paddingBottom: 10,
            flexDirection: "row",
            alignItems: "center",
        },
        container:{
            paddingVertical: 10
        },
        title:{
            marginLeft: 5,
            color: colors.default_dark
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
            {canSeePendingAnimals() &&
                <>
                    <View style={styles.container}>
                        <View style={styles.containerHeader}>
                            <Icon source={"clock-outline"} size={20} color={colors.default_dark} />
                            <Text style={[styles.title, styles.textFontBold]}>Animaux en attente</Text>
                        </View>
                        <View>
                            <FlatList
                                data={getPendingAnimalsICanSee()}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => <AnimalCard animal={item} animalState={animals.type} userRole={userRole} group={group} />}
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

            { animals && animals.type === "accepted" && 
                <View style={styles.container}>
                    <View style={styles.containerHeader}>
                        <Icon source={"format-list-bulleted"} size={20} color={colors.default_dark} />
                        <Text style={[styles.title, styles.textFontBold]}>Animaux du groupe</Text>
                    </View>
                    <View>
                        <FlatList
                            data={animals.items}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => <AnimalCard animal={item} animalState={animals.type} userRole={userRole} group={group} />}
                            ListEmptyComponent={
                                <ModalDefaultNoValue
                                    text={"Aucun animal dans le groupe"}
                                />
                            }
                        />
                    </View>
                </View>
            }
            
            

        </>
    );
}

export default AnimalsGroup;