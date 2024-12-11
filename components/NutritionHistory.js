import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import Button from './Button';
import { LineChart } from 'react-native-chart-kit';
import OfferInformations from './OfferInformations';
import { useTheme } from 'react-native-paper';

const NutritionHistory = ({ animal }) => {
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

    const handleDataPointClick = (data, index, x, y) => {
        const value = data.datasets[0].data[index];
        setDisplayedValue(value);
        setPosition({ x, y });
        setTimeout(() => {
            setDisplayedValue(null);
        }, 3000);
    };

    return(
        <>
            <ScrollView>
                <View style={{display: "flex", flexDirection: "column"}}>
                    {/* <Text style={{textAlign: "center", color: colors.accent, fontFamily: fonts.bodyLarge.fontFamily, fontSize: 16, paddingVertical: 15}}>Nutrition</Text> */}

                    <View style={{width: "90%", alignSelf: "center"}}>
                        <OfferInformations />
                    </View>
                    

                    {/*< View style={{width: "60%", alignSelf: "center"}}>
                        <Button size={"m"} type={"tertiary"}>
                            <Text>Ajouter un poids</Text>
                        </Button>
                    </View>

                    <View style={{width: "90%", marginTop: 20, alignSelf: "center"}}>
                        <Text style={{color: colors.accent, fontSize: 16}}>Courbe de poids :</Text>
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
                                color: (opacity = 1) => colors.accent,
                                labelColor: (opacity = 1) => colors.accent,
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
                                    backgroundColor: "white",
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
                        <Text style={{color: colors.accent, fontSize: 16}}>Alimentation :</Text>
                        <View style={{backgroundColor: colors.background, borderRadius: 10, padding: 30, marginTop: 20}}>
                            <Text>Nom alimentation :</Text>
                            <TextInput
                                style={{backgroundColor: colors.quaternary, borderRadius: 5, height: 30, marginBottom: 5, marginTop: 5, padding: 10}}
                                placeholderTextColor={colors.accent}
                                defaultValue={animal.food}
                                placeholder='N/A'
                                editable={false}
                            />
                            <Text>Quantité :</Text>
                            <TextInput
                                style={{backgroundColor: colors.quaternary, borderRadius: 5, height: 30, marginBottom: 5, marginTop: 5, padding: 10}}
                                placeholderTextColor={colors.accent}
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

export default NutritionHistory;