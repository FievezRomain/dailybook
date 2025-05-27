import { FlatList, StyleSheet, Text, View } from "react-native";
import ModalDefaultNoValue from "../modals/common/ModalDefaultNoValue";
import MemberCard from "../cards/MemberCard";
import Button from "../inputs/Button";
import { Icon, useTheme } from "react-native-paper";

const MembersGroup = ({ group, userRole }) => {
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
                        <Text>Ajouter un membre</Text>
                    </Button>
                </View>
            }
            {userRole === "manager" &&
                <View>
                    <View style={styles.containerHeader}>
                        <Icon source={"clock-outline"} size={20} color={colors.default_dark} />
                        <Text style={[styles.title, styles.textFontBold]}>Utilisateurs en attente</Text>
                    </View>
                    <View>
                        <FlatList
                            data={group.invitations}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => <MemberCard member={item} />}
                            contentContainerStyle={{ padding: 20 }}
                            ListEmptyComponent={
                                <ModalDefaultNoValue
                                    text={"Aucun utilisateur en attente"}
                                />
                            }
                        />
                    </View>
                </View>
            }
            <View>
                <View style={styles.containerHeader}>
                    <Icon source={"format-list-bulleted"} size={20} color={colors.default_dark} />
                    <Text style={[styles.title, styles.textFontBold]}>Membres du groupe</Text>
                </View>
                <View>
                    <FlatList
                        data={group.members}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <MemberCard member={item} />}
                        contentContainerStyle={{ padding: 20 }}
                        ListEmptyComponent={
                            <ModalDefaultNoValue
                                text={"Aucun membre dans le groupe"}
                            />
                        }
                    />
                </View>
            </View>
        </>
    );
}

export default MembersGroup;