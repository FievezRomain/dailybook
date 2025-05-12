import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Icon, useTheme } from 'react-native-paper';
import { useAuth } from '../../providers/AuthenticatedUserProvider';
import ModalManageBodyAnimal from '../modals/animals/ModalManageBodyAnimal';
import AnimalImageCarousel from './AnimalImageCarousel';

const AnimalBody = ({ animal, onModify }) => {
    const { abonnement } = useAuth();
    const { colors, fonts } = useTheme();
    const data = {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            data: [70, 72, 75, 73, 76, 77],
          },
        ],
    };

    const [displayedValue, setDisplayedValue] = useState(null);
    const [position, setPosition] = useState({});
    const [isBodyManageModalVisible, setBodyManageModalVisible] = useState(false);
    const [item, setItem] = useState(null);

    const handleDataPointClick = (data, index, x, y) => {
        const value = data.datasets[0].data[index];
        setDisplayedValue(value);
        setPosition({ x, y });
        setTimeout(() => {
            setDisplayedValue(null);
        }, 3000);
    };

    const handleBodyUpdate = ( ) =>{
        setBodyManageModalVisible(false);
        onModify( );
    };

    const openModal = (item) => {
        setItem(item);
        setBodyManageModalVisible(true);
    };

    const styles = StyleSheet.create({
        card:{
            backgroundColor: colors.background,
            width: "100%", 
            paddingLeft: 20, 
            paddingVertical: 25, 
            borderRadius: 5, 
            shadowColor: "black", 
            shadowOpacity: 0.1, 
            elevation: 1, 
            shadowOffset: {width: 0,height: 1},
            marginBottom: 20
        },
        text:{
            color: colors.default_dark
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textInput:{
            alignSelf: "flex-start",
            marginBottom: 5
        },
        input: {
            height: 40,
            width: "80%",
            marginBottom: 10,
            borderRadius: 5,
            paddingLeft: 15,
            backgroundColor: colors.quaternary,
            color: "black",
            alignSelf: "baseline"
        },
        iconUpdate:{
            height: 40,
            width: "20%",
            justifyContent: "center",
            alignItems: "center"
        },
        headerContainer:{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            marginLeft: 20
        },
        title:{
            color: colors.default_dark,
            fontSize: 16,
            marginLeft: 10
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
        <>
            <ModalManageBodyAnimal
                isVisible={isBodyManageModalVisible}
                setVisible={setBodyManageModalVisible}
                animal={animal}
                onModify={handleBodyUpdate}
                item={item}
                actionType={"create"}
            />
            <ScrollView>
                <View style={{display: "flex", flexDirection: "column"}}>
                    {/* <Text style={{textAlign: "center", color: colors.default_dark, fontFamily: fonts.bodyLarge.fontFamily, fontSize: 16, paddingVertical: 15}}>Nutrition</Text> */}
                    {abonnement.libelle === "Premium" &&   
                        <>
                            <View style={styles.headerContainer}>
                                <Icon source={"camera-burst"} size={25} color={colors.default_dark} />
                                <Text style={[styles.title, styles.textFontBold]}>Évolution physique</Text>
                            </View>
                            <AnimalImageCarousel animalId={animal.id}/>
                        </>
                        
                    }
                    <View style={styles.headerContainer}>
                        <Icon source={"clipboard-pulse-outline"} size={25} color={colors.default_dark} />
                        <Text style={[styles.title, styles.textFontBold]}>Informations physique</Text>
                    </View>
                    <View style={{width: "90%", alignSelf: "center"}}>
                        
                        <View style={styles.card}>
                            
                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular, styles.text]}>Taille (cm) :</Text>
                                <View style={{flexDirection: "row"}}>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : 140"
                                        placeholderTextColor={colors.secondary}
                                        defaultValue={animal.taille != null ? String(animal.taille) : undefined}
                                        editable={false}
                                    />
                                    <TouchableOpacity style={styles.iconUpdate} onPress={() => openModal('taille')}>
                                        <Icon source={"update"} size={25} color={colors.default_dark} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular, styles.text]}>Poids (kg) :</Text>
                                <View style={{flexDirection: "row"}}>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : 400"
                                        placeholderTextColor={colors.secondary}
                                        defaultValue={animal.poids != null ? String(animal.poids) : undefined}
                                        editable={false}
                                    />
                                    <TouchableOpacity style={styles.iconUpdate} onPress={() => openModal('poids')}>
                                            <Icon source={"update"} size={25} color={colors.default_dark} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular, styles.text]}>Nom alimentation :</Text>
                                <View style={{flexDirection: "row"}}>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : Granulés X"
                                        placeholderTextColor={colors.secondary}
                                        defaultValue={animal.food}
                                        editable={false}
                                    />
                                    <TouchableOpacity style={styles.iconUpdate} onPress={() => openModal('food')}>
                                            <Icon source={"update"} size={25} color={colors.default_dark} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular, styles.text]}>Quantité :</Text>
                                <View style={{flexDirection: "row"}}>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : 200"
                                        placeholderTextColor={colors.secondary}
                                        defaultValue={(animal.quantity != null ? String(animal.quantity) + (animal.unity ? " " + animal.unity : "") : undefined)}
                                        editable={false}
                                    />
                                    <TouchableOpacity style={styles.iconUpdate} onPress={() => openModal('quantity')}>
                                            <Icon source={"update"} size={25} color={colors.default_dark} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                            
                        
                    </View>
                    

                    {/*< View style={{width: "60%", alignSelf: "center"}}>
                        <Button size={"m"} type={"tertiary"}>
                            <Text>Ajouter un poids</Text>
                        </Button>
                    </View>

                    <View style={{width: "90%", marginTop: 20, alignSelf: "center"}}>
                        <Text style={{color: colors.default_dark, fontSize: 16}}>Courbe de poids :</Text>
                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10}}>
                            <LineChart
                                data={data}
                                width={350}
                                height={220}
                                yAxisSuffix=" kg"
                                chartConfig={{
                                backgroundColor: colors.quaternary,
                                backgroundGradientFrom: colors.background,
                                backgroundGradientTo: colors.background,
                                decimalPlaces: 1,
                                color: (opacity = 1) => colors.default_dark,
                                labelColor: (opacity = 1) => colors.default_dark,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: '6',
                                    strokeWidth: '2',
                                    stroke: colors.quaternary,
                                },
                                }}
                                onDataPointClick={({ value, dataset, getColor, x, y }) =>
                                    handleDataPointClick(data, dataset.data.indexOf(value), x, y)
                                }
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 10,
                                    backgroundColor: colors.background,
                                    padding: 5
                                }}
                            />
                            {displayedValue && (
                                <TouchableOpacity
                                style={[{position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 5, borderRadius: 5, zIndex: 1,}, { left: position.x - 30, top: position.y - 40 }]}
                                onPress={() => setDisplayedValue(null)}
                                >
                                <Text>{displayedValue} kg</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={{color: colors.default_dark, fontSize: 16}}>Alimentation :</Text>
                        <View style={{backgroundColor: colors.background, borderRadius: 10, padding: 30, marginTop: 20}}>
                            <Text>Nom alimentation :</Text>
                            <TextInput
                                style={{backgroundColor: colors.quaternary, borderRadius: 5, height: 30, marginBottom: 5, marginTop: 5, padding: 10}}
                                placeholderTextColor={colors.default_dark}
                                defaultValue={animal.food}
                                placeholder='N/A'
                                editable={false}
                            />
                            <Text>Quantité :</Text>
                            <TextInput
                                style={{backgroundColor: colors.quaternary, borderRadius: 5, height: 30, marginBottom: 5, marginTop: 5, padding: 10}}
                                placeholderTextColor={colors.default_dark}
                                defaultValue={animal.quantity != null ? String(animal.quantity) : undefined}
                                placeholder='N/A'
                                editable={false}
                            />
                        </View>
                    </View> */}
                </View>
            </ScrollView>
        </>
    );
};

export default AnimalBody;