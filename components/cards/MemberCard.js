import { StyleSheet, Text, View } from "react-native";

const MemberCard = ({ member, memberState, userRole }) => {

    const styles = StyleSheet.create({

    });

    return(
        <>
            <View>
                <Text>{member.email}</Text>
                <Text>{member.role}</Text>
            </View>
        </>
    );
}

export default MemberCard;