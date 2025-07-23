import { FlatList, StyleSheet, Text, View } from "react-native";
import ModalDefaultNoValue from "../modals/common/ModalDefaultNoValue";
import MemberCard from "../cards/MemberCard";
import { Icon, useTheme } from "react-native-paper";

const MembersGroup = ({ members, group, userRole }) => {
    const { colors, fonts } = useTheme();

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
            {members !== undefined && members.type === "pending" &&
                <View style={styles.container}>
                    <View style={styles.containerHeader}>
                        <Icon source={"clock-outline"} size={20} color={colors.default_dark} />
                        <Text style={[styles.title, styles.textFontBold]}>Utilisateurs en attente</Text>
                    </View>
                    <View>
                        <FlatList
                            data={members.items}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => <MemberCard member={item} group={group} memberState={members.type} userRole={userRole} />}
                            ListEmptyComponent={
                                <ModalDefaultNoValue
                                    text={"Aucun utilisateur en attente"}
                                />
                            }
                        />
                    </View>
                </View>
            }
            { members && members.type === "accepted" && 
                <View style={styles.container}>
                    <View style={styles.containerHeader}>
                        <Icon source={"format-list-bulleted"} size={20} color={colors.default_dark} />
                        <Text style={[styles.title, styles.textFontBold]}>Membres du groupe</Text>
                    </View>
                    <View>
                        <FlatList
                            data={members.items}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => <MemberCard member={item} group={group} memberState={members.type} userRole={userRole} />}
                            ListEmptyComponent={
                                <ModalDefaultNoValue
                                    text={"Aucun membre dans le groupe"}
                                />
                            }
                        />
                    </View>
                </View>
            }
        </>
    );
}

export default MembersGroup;