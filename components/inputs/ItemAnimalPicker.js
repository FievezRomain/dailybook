import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import FileStorageService from "../../services/FileStorageService";

const ItemAnimalPicker = ({ isSelected, showBadge, item, selectedIndex }) => {
    const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const fileStorageService = new FileStorageService();

    const truncateAnimalName = (name) => {
        if (name.length <= 15) {
            return name; // Le nom est déjà court
        }
    
        // Tronquer à 10 caractères
        const truncated = name.slice(0, 15);
    
        // Vérifier s'il y a un espace dans les 10 premiers caractères
        const lastSpaceIndex = truncated.indexOf(" ");
        if (lastSpaceIndex !== -1) {
            return truncated.slice(0, lastSpaceIndex); // Tronquer au dernier espace
        }
    
        return truncated + "..."; // Ajouter "..." après 10 caractères
    };

    const styles = StyleSheet.create({
        containerAvatar:{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignSelf: "center",
            marginLeft: 5,
        },
        avatar: {
            width: 60,
            height: 60,
            borderRadius: 50,
            zIndex: 1,
            justifyContent: "center"
        },
        containerAvatarWithoutImage:{
            height: 65, 
            width: 65, 
            borderRadius: 50, 
            justifyContent: "center", 
            alignItems: "center"
        },
        containerWithGradient:{
            width: 70, 
            height: 70, 
            borderRadius: 50, 
            alignItems: "center", 
            justifyContent: "center"
        },
        containerAvatarWithImage:{
            width: 65, 
            height: 65, 
            borderRadius: 50, 
            alignItems: "center", 
            justifyContent: "center"
        },
        avatarText: {
            textAlign: "center", 
            color: colors.background, 
            fontSize: 30
        },
        badge: {
            position: 'absolute',
            top: 2,
            right: 2,
            backgroundColor: colors.accent,
            borderRadius: 8,
            width: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
        },
        badgeText: {
            color: colors.background,
            fontSize: 10,
        },
        defaultText:{
            color: colors.quaternary
        },
        selectedText:{
            color: colors.accent
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        },
    });

    return(
        <View style={[styles.containerAvatar, {position: "relative"}]}>
            { item.image !== null ? 
                <LinearGradient
                    colors={isSelected ? [colors.accent, colors.tertiary] : ['transparent', 'transparent']}
                    style={styles.containerWithGradient}
                    start={{ x: 0.2, y: 0 }} // Dégradé commence à gauche
                >
                    <View style={[styles.containerAvatarWithImage, isSelected ? {backgroundColor: colors.background} : {backgroundColor: "transparent"}]}>
                        <Image style={[styles.avatar]} source={{uri:  fileStorageService.getFileUrl( item.image, currentUser.uid ) }} cachePolicy="disk" />
                    </View>
                </LinearGradient>
                :
                <LinearGradient
                    colors={isSelected ? [colors.accent, colors.quaternary] : ['transparent', 'transparent']}
                    style={styles.containerWithGradient}
                    start={{ x: 0.2, y: 0 }} // Dégradé commence à gauche
                >
                    <View style={[styles.containerAvatarWithoutImage, isSelected ? {backgroundColor: colors.background} : {backgroundColor: "transparent"}]}>
                        <View style={[styles.avatar, isSelected ? {backgroundColor: colors.default_dark} : {backgroundColor: colors.quaternary}]}>
                            <Text style={[styles.avatarText, styles.textFontRegular]}>{ item.id === "select_all" ? "+" : item.nom[0]}</Text>
                        </View>
                    </View>
                </LinearGradient>
            }
            {showBadge &&
                <View style={styles.badge}>
                    <Text style={[styles.badgeText, styles.textFontBold]}>{selectedIndex + 1}</Text>
                </View>
            }
            <Text style={[(isSelected ? styles.selectedText : styles.defaultText), styles.textFontRegular]}>{truncateAnimalName(item.nom)}</Text>
        </View>
    );
}

export default ItemAnimalPicker;